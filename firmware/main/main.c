#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "esp_log.h"
#include "sdkconfig.h"

#include "secrets.h"
#include "services/mqtt_manager.h"
#include "services./wifi_manager.h"
#include "services/dht_manager.h"

#include "mqtt_client.h"
#include "esp_tls.h"
#include "config.h"

void app_main(void)
{
    gpio_reset_pin(DHT_GPIO);
    gpio_set_direction(DHT_GPIO, GPIO_MODE_INPUT);

    wifi_connect();
    mqtt_app_start();

    while (1) {
        float temperature = 0;
        float humidity = 0;

        if (read_dht11(&temperature, &humidity)) {
            char payload[100];
            snprintf(payload, sizeof(payload),
                     "{\"sensor_id\": \"%s\", \"temperature\": %.1f, \"humidity\": %.1f}",
                     SENSOR_ID, temperature, humidity);

            esp_mqtt_client_publish(get_mqtt_client(), AWS_IOT_TOPIC, payload, 0, 1, 0);
        }

        vTaskDelay(pdMS_TO_TICKS(10000));
    }
}