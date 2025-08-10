#ifndef CONFIG_H
#define CONFIG_H

// WiFi credentials
#define DHT_GPIO 16
#define DHT_TAG "DHT11"

// AWS IoT info
#define AWS_IOT_ENDPOINT "mqtts://a3hgw1d6icexj-ats.iot.ap-southeast-1.amazonaws.com"
#define AWS_IOT_CLIENT_ID "ESP32_IOT"
#define AWS_IOT_DHT_TOPIC "esp32_temp_humd"
#define AWS_IOT_DEVICE_TOPIC "device_detail"
#define AWS_IOT_THING_NAME "ESP32_T01_0002"

#endif // CONFIG_H