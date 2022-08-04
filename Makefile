cf=cf-example

default: dev

dev: down
	docker run \
		-v $(shell pwd):/opt/harperdb/hdb/custom_functions/$(cf) \
		-e LOG_LEVEL=error \
		-e HDB_ADMIN_USERNAME=hdbcf \
		-e HDB_ADMIN_PASSWORD=hdbcf \
		-e LOG_TO_STDSTREAMS=true \
		-e RUN_IN_FOREGROUND=true \
		-e CUSTOM_FUNCTIONS=true \
		-e SERVER_PORT=9925 \
		-e CUSTOM_FUNCTIONS_PORT=9926 \
		-e MAX_CUSTOM_FUNCTION_PROCESSES=1 \
		-p 9925:9925 \
		-p 9926:9926 \
		harperdb/harperdb:latest

bash:
	docker run \
		-it \
		-v $(shell pwd):/opt/harperdb/hdb/custom_functions/$(cf) \
		harperdb/harperdb:latest \
		bash

down:
	docker stop $(shell docker ps -q --filter ancestor=harperdb/harperdb ) || exit 0
