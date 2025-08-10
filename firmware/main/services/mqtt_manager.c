#include "esp_log.h"
#include "mqtt_client.h"

#include "secrets.h"

#define MQTT_TAG "MQTT"

static esp_mqtt_client_handle_t mqtt_client = NULL;

static void mqtt_event_handler(void *handler_args, esp_event_base_t base, int32_t event_id, void *event_data) {
    esp_mqtt_event_handle_t event = event_data;
    switch (event->event_id) {
        case MQTT_EVENT_CONNECTED:
            ESP_LOGI(MQTT_TAG, "MQTT Connected");
            break;
        case MQTT_EVENT_DISCONNECTED:
            ESP_LOGW(MQTT_TAG, "MQTT Disconnected");
            break;
        case MQTT_EVENT_ERROR:
            ESP_LOGE(MQTT_TAG, "MQTT Error");
            break;
        default:
            break;
    }
}


void mqtt_app_start(void)
{
    const esp_mqtt_client_config_t mqtt_config = {
        .broker = {
            .address = {
                .uri = AWS_IOT_ENDPOINT,
            },
            .verification = {
                .certificate = (const char *)root_ca_pem_start,
                .certificate_len = root_ca_pem_end - root_ca_pem_start
            }
        },
        .credentials = {
            .client_id = AWS_IOT_CLIENT_ID,
            .authentication = {
                .certificate = (const char *)device_cert_pem_crt_start,
                .certificate_len = device_cert_pem_crt_end - device_cert_pem_crt_start,
                .key = (const char *)private_pem_key_start,
                .key_len = private_pem_key_end - private_pem_key_start
            }
        },
    };

    mqtt_client = esp_mqtt_client_init(&mqtt_config);
    esp_mqtt_client_register_event(mqtt_client, ESP_EVENT_ANY_ID, mqtt_event_handler, NULL);
    esp_mqtt_client_start(mqtt_client);
}

esp_mqtt_client_handle_t get_mqtt_client(void)
{
    return mqtt_client;
}
