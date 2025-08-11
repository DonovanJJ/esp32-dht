#include "nvs_manager.h"
#include "esp_http_client.h"
#include "esp_log.h"
#include "cJSON.h"
#include <string.h>

static const char *API_TAG = "API_CLIENT";
static const char *API_URL = "http://{SOME_ENDPOINT}/device";

esp_err_t fetch_device_detail_from_api( *out_detail) {
    if (out_detail == NULL) {
        return ESP_ERR_INVALID_ARG;
    }

    esp_http_client_config_t config = {
        .url = API_URL,
        .method = HTTP_METHOD_GET,
        .timeout_ms = 5000,
    };

    esp_http_client_handle_t client = esp_http_client_init(&config);
    if (client == NULL) {
        ESP_LOGE(API_TAG, "Failed to initialize HTTP client");
        return ESP_FAIL;
    }

    esp_err_t err = esp_http_client_perform(client);
    if (err != ESP_OK) {
        ESP_LOGE(API_TAG, "HTTP request failed: %s", esp_err_to_name(err));
        esp_http_client_cleanup(client);
        return err;
    }

    int status = esp_http_client_get_status_code(client);
    if (status != 200) {
        ESP_LOGE(API_TAG, "HTTP Status %d received", status);
        esp_http_client_cleanup(client);
        return ESP_FAIL;
    }

    int content_length = esp_http_client_get_content_length(client);
    if (content_length <= 0 || content_length > 1024) {
        ESP_LOGE(API_TAG, "Invalid content length: %d", content_length);
        esp_http_client_cleanup(client);
        return ESP_FAIL;
    }

    // Read response into buffer
    char *buffer = malloc(content_length + 1);
    if (buffer == NULL) {
        ESP_LOGE(API_TAG, "Failed to allocate memory");
        esp_http_client_cleanup(client);
        return ESP_ERR_NO_MEM;
    }

    int data_read = esp_http_client_read(client, buffer, content_length);
    if (data_read <= 0) {
        ESP_LOGE(API_TAG, "Failed to read HTTP response");
        free(buffer);
        esp_http_client_cleanup(client);
        return ESP_FAIL;
    }
    buffer[data_read] = '\0'; // Null terminate

    // Parse JSON
    cJSON *json = cJSON_Parse(buffer);
    free(buffer);
    esp_http_client_cleanup(client);

    if (json == NULL) {
        ESP_LOGE(API_TAG, "Failed to parse JSON");
        return ESP_FAIL;
    }

    cJSON *id = cJSON_GetObjectItem(json, "id");
    cJSON *clientId = cJSON_GetObjectItem(json, "clientId");

    if (!cJSON_IsString(id) || !cJSON_IsString(clientId) ||
        id->valuestring == NULL || clientId->valuestring == NULL) {
        ESP_LOGE(API_TAG, "Invalid JSON fields");
        cJSON_Delete(json);
        return ESP_FAIL;
    }

    // Copy UUID strings safely
    strncpy(out_detail->device_id, id->valuestring, sizeof(out_detail->device_id) - 1);
    out_detail->device_id[sizeof(out_detail->device_id) - 1] = '\0';

    strncpy(out_detail->client_id, clientId->valuestring, sizeof(out_detail->client_id) - 1);
    out_detail->client_id[sizeof(out_detail->client_id) - 1] = '\0';

    cJSON_Delete(json);
    ESP_LOGI(API_TAG, "Parsed device_id: %s", out_detail->device_id);
    ESP_LOGI(API_TAG, "Parsed client_id: %s", out_detail->client_id);

    return ESP_OK;
}