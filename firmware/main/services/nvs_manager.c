#include "esp_log.h"
#include "nvs_flash.h"
#include "nvs.h"
#include <stdio.h>

#include "nvs_manager.h"

#define DEVICE_DETAIL_NAMESPACE "detail_store"
#define DEVICE_ID_KEY "device_id"
#define CLIENT_ID_KEY "client_id"

#define TAG "NVS"

esp_err_t save_device_detail(const device_detail *detail) {
    nvs_handle_t nvs_handle;
    esp_err_t err = nvs_open(DEVICE_DETAIL_NAMESPACE, NVS_READWRITE, &nvs_handle);
    if (err != ESP_OK) {
        ESP_LOGE(TAG, "Failed to open NVS: %s", esp_err_to_name(err));
        return err;
    }

    err = nvs_set_str(nvs_handle, DEVICE_ID_KEY, detail->device_id);
    if (err == ESP_OK) {
        ESP_LOGE(TAG, "Failed to save device_id: %s", esp_err_to_name(err));
        err = nvs_commit(nvs_handle);
    }

    err = nvs_set_str(nvs_handle, CLIENT_ID_KEY, detail->client_id);
    if (err == ESP_OK) {
        ESP_LOGE(TAG, "Failed to save client_id: %s", esp_err_to_name(err));
        err = nvs_commit(nvs_handle);
    }
    nvs_close(nvs_handle);


    if (err == ESP_OK) {
        ESP_LOGI(TAG, "Successfully saved client_id and device_id");
    } else {
        ESP_LOGE(TAG, "Failed to commit NVS changes: %s", esp_err_to_name(err));
    }
    return err;
}

esp_err_t read_device_detail(device_detail *detail) {
    nvs_handle_t nvs_handle;
    esp_err_t err = nvs_open(DEVICE_DETAIL_NAMESPACE, NVS_READONLY, &nvs_handle);
    if (err != ESP_OK) {
        ESP_LOGE(TAG, "Failed to open NVS: %s", esp_err_to_name(err));
        return err;
    }

    // Read device_id
    size_t device_id_size = 0;
    err = nvs_get_str(nvs_handle, DEVICE_ID_KEY, NULL, &device_id_size); // Query size required to store the device_id string
    if (err != ESP_OK || device_id_size == 0) {
        nvs_close(nvs_handle);
        ESP_LOGI(TAG, "No device ID found in NVS");
        return ESP_ERR_NVS_NOT_FOUND;
    }

    detail->device_id = malloc(device_id_size);
    if (!detail->device_id) {
        nvs_close(nvs_handle);
        ESP_LOGE(TAG, "Failed to allocate memory for device id");
        return ESP_ERR_NO_MEM;
    }

    err = nvs_get_str(nvs_handle, DEVICE_ID_KEY, detail->device_id, &device_id_size); // Actually store the value into the newly allocated memory
    if (err != ESP_OK) {
        ESP_LOGE(TAG, "Failed to read device_id: %s", esp_err_to_name(err));
        free(detail->device_id);
        detail->device_id = NULL;
        nvs_close(nvs_handle);
        return err;
    }


    // Read client_id
    size_t client_id_size = 0;
    err = nvs_get_str(nvs_handle, CLIENT_ID_KEY, NULL, &client_id_size);
    if (err != ESP_OK || client_id_size == 0) {
        ESP_LOGI(TAG, "No client_id found in NVS");
        nvs_close(nvs_handle);
        return ESP_ERR_NVS_NOT_FOUND;
    }
    detail->client_id = malloc(client_id_size);
    if (!detail->client_id) {
        ESP_LOGE(TAG, "Failed to allocate memory for client_id");
        nvs_close(nvs_handle);
        return ESP_ERR_NO_MEM;
    }
    err = nvs_get_str(nvs_handle, CLIENT_ID_KEY, detail->client_id, &client_id_size);
    if (err != ESP_OK) {
        ESP_LOGE(TAG, "Failed to read client_id: %s", esp_err_to_name(err));
        free(detail->client_id);
        free(detail->device_id);
        detail->client_id = NULL;
        detail->device_id = NULL;
        nvs_close(nvs_handle);
        return err;
    }

    nvs_close(nvs_handle);
    ESP_LOGI(TAG, "Read client_id: %s", detail->client_id);
    ESP_LOGI(TAG, "Read device_id: %s", detail->device_id);
    return ESP_OK;
}