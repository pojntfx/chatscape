obj = hello-world hello-secret hello-db add-contact


all: build

$(addprefix build-js/,$(obj)):
	mkdir -p out
	cd api/$(subst build-js/,,$@) && rm -rf out && npm run build && cp -r node_modules out && cd out && zip -r ../../../out/$(subst build-js/,,$@).zip .

build-pwa:
	cd frontend && npm run build

build: $(addprefix build-js/,$(obj)) build-pwa

run: build
	terraform apply  --auto-approve

plan: build
	terraform plan 

clean:
	terraform destroy --auto-approve
	rm -rf out

$(addprefix depend-js/,$(obj)):
	cd api/$(subst depend-js/,,$@) && npm install

depend: $(addprefix depend-js/,$(obj))