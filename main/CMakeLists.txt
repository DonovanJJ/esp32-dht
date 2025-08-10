idf_component_register(SRCS "main.c"
                    INCLUDE_DIRS "."
                    EMBED_TXTFILES
                        "./certs/root-ca.pem"
                        "./certs/device-certificate.pem.crt"
                        "./certs/private.pem.key"
)

# target_add_binary_data(${COMPONENT_TARGET} "certs/root-ca.pem" TEXT)
# target_add_binary_data(${COMPONENT_TARGET} "certs/device-certificate.pem.crt" TEXT)
# target_add_binary_data(${COMPONENT_TARGET} "certs/private.pem.key" TEXT)
