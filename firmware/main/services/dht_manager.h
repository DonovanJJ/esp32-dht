#ifndef DHT_SENSOR_H
#define DHT_SENSOR_H

#include <stdbool.h>

bool read_dht11(float *temperature, float *humidity);

#endif // DHT_SENSOR_H