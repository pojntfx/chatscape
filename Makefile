obj = hello-world hello-secret hello-db

all: build

$(addprefix build-js/,$(obj)):
	mkdir -p out
	cd src/$(subst build-js/,,$@) && npm run build &&	zip -rj ../../out/$(subst build-js/,,$@).zip out/

build: $(addprefix build-js/,$(obj))

run: build
	terraform apply --auto-approve

clean:
	terraform destroy --auto-approve
	rm -rf out

$(addprefix depend-js/,$(obj)):
	cd src/$(subst depend-js/,,$@) && npm install

depend: $(addprefix depend-js/,$(obj))