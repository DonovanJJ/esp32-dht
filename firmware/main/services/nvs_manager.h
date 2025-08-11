#ifndef NVS_MANAGER_H
#define NVS_MANAGER_H

#include "esp_err.h"

typedef struct {
    char *client_id;
    char *device_id;
} device_detail;

// // Initialize NVS storage (call once at app start)
// esp_err_t init_nvs(void);

// Save device ID string to NVS
esp_err_t save_device_detail(const device_detail *detail);

// Read device ID from NVS
// On success, *out_device_id is allocated and must be freed by caller
esp_err_t read_device_detail(device_detail *detail);

// // Get a new device ID from your API via HTTP GET
// // On success, *out_device_id is allocated and must be freed by caller
// esp_err_t get_device_id_from_api(char **out_device_id);

#endif // NVS_MANAGER_H
