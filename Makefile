# Development Makefile to make life easier.
default:
	make docker

# Development DB
.PHONY: db
db: 
	docker-compose up --build -f ./db/docker-compose.yaml

# Services containerization
.PHONY: docker
docker:
	docker-compose up --build