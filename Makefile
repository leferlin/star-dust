DOCKER = docker

DOCKERFLAGS = --rm -it -p $(PORT):$(PORT) -v "`pwd`"/app:$(WORKINGDIR) -w $(WORKINGDIR) -u `id -u ${USER}`:`id -g ${USER}`
DOCKERIMG = node:lts

PORT=8082
WORKINGDIR = /home

test-locally:
	$(DOCKER) run $(DOCKERFLAGS) $(DOCKERIMG) npm start
.PHONY: test-locally

configure-locally:
	$(DOCKER) run $(DOCKERFLAGS) $(DOCKERIMG) npm install
.PHONY: configure-locally


clean:
	$(DOCKER) run $(DOCKERFLAGS) $(DOCKERIMG) rm -r node_modules
.PHONY: clean

docker:
	$(DOCKER) run $(DOCKERFLAGS) $(DOCKERIMG) $(CMD)
.PHONY: docker
