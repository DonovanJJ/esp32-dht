#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "esp_log.h"
#include "sdkconfig.h"
#include "nvs_flash.h"
#include "esp_sleep.h"

#include "secrets.h"
#include "services/mqtt_manager.h"
#include "services./wifi_manager.h"
#include "services/dht_manager.h"
#include "services/nvs_manager.h"

#include "mqtt_client.h"
#include "esp_tls.h"
#include "config.h"

void app_main(void)
{
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
      ESP_ERROR_CHECK(nvs_flash_erase());
      ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    device_detail detail;
    detail.client_id = NULL;
    detail.device_id = NULL;
    ret = read_device_detail(&detail);
    if (ret == ESP_ERR_NVS_NOT_FOUND) {
        
        // TODO: Implement calling of api to obtain device id and client id
        printf("Fetch from API\n");
        device_detail mock_detail;
        mock_detail.client_id = strdup("mock-client-1234");
        mock_detail.device_id = strdup("mock-device-5678");

        // TODO: Save mock_detail to NVS if needed
        esp_err_t save_ret = save_device_detail(&mock_detail);
        if (save_ret == ESP_OK) {
            printf("Mock device details saved to NVS\n");
        } else {
            printf("Failed to save mock device details: %s\n", esp_err_to_name(save_ret));
        }
        ret = read_device_detail(&detail);
        // printf("This is the newly inserted device detail: %s\n", detail->client_id);
        free(mock_detail.client_id);
        free(mock_detail.device_id);
    }

    gpio_reset_pin(DHT_GPIO);
    gpio_set_direction(DHT_GPIO, GPIO_MODE_INPUT);

    wifi_connect();
    mqtt_app_start();

    esp_mqtt_client_handle_t mqtt_client = get_mqtt_client();
    char device_payload[100];
    snprintf(device_payload, sizeof(device_payload),
            "{\"device_id\": \"%s\", \"client_id\": \"%s\", \"thing_name\": \"%s\"}",
            DEVICE_ID, AWS_IOT_CLIENT_ID, AWS_IOT_THING_NAME);

    esp_mqtt_client_publish(mqtt_client, AWS_IOT_DEVICE_TOPIC, device_payload, 0, 1, 0);

    float temperature = 0;
    float humidity = 0;

    if (read_dht11(&temperature, &humidity)) {
        char payload[100];
        snprintf(payload, sizeof(payload),
                    "{\"device_id\": \"%s\", \"temperature\": %.1f, \"humidity\": %.1f}",
                    DEVICE_ID, temperature, humidity);

        esp_mqtt_client_publish(mqtt_client, AWS_IOT_DHT_TOPIC, payload, 0, 1, 0);
    }

    const int64_t sleep_time_sec = 30;
    esp_sleep_enable_timer_wakeup(sleep_time_sec * 1000000);

    ESP_LOGI("MAIN", "Entering deep sleep for %lld seconds", sleep_time_sec);
    esp_deep_sleep_start();
}