#ifndef HTTP_MANAGER_H
#define HTTP_MANAGER_H

// #include "mqtt_client.h"
#include "nvs_manager.h"

esp_err_t fetch_device_detail_from_api(device_detail *out_detail);

#endif // HTTP_MANAGER_H