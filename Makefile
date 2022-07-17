# Development Makefile to make life easier.
default:
	make docker

.PHONY: docker
docker:
	docker-compose up --build