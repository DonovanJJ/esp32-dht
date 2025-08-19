#include "dht.h"
#include "esp_log.h"

#include "config.h"

bool read_dht22(float *temperature, float *humidity)
{
    int16_t temp_raw = 0;
    int16_t hum_raw = 0;

    esp_err_t result = dht_read_data(DHT_TYPE_AM2301, DHT_GPIO, &hum_raw, &temp_raw);
    if (result == ESP_OK) {
        *temperature = temp_raw / 10.0f;
        *humidity = hum_raw / 10.0f;
        ESP_LOGI(DHT_TAG, "Temperature: %.1f°C, Humidity: %.1f%%", *temperature, *humidity);
        return true;
    } else {
        ESP_LOGE(DHT_TAG, "Could not read data from DHT11 sensor");
        return false;
    }
}