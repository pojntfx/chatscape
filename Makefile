obj = hello-world hello-secret hello-db

all: build

$(addprefix build-js/,$(obj)):
	mkdir -p out
	cd api/$(subst build-js/,,$@) && rm -rf out && npm run build && cp -r node_modules out && cd out && zip -r ../../../out/$(subst build-js/,,$@).zip .

build: $(addprefix build-js/,$(obj))

run: build
	terraform apply --auto-approve

clean:
	terraform destroy --auto-approve
	rm -rf out

$(addprefix depend-js/,$(obj)):
	cd api/$(subst depend-js/,,$@) && npm install

depend: $(addprefix depend-js/,$(obj))