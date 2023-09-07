obj = add-contact get-contacts block-contact report-contact add-message get-messages

all: build

$(addprefix build/js/,$(obj)):
	mkdir -p out
	cd api/$(subst build/js/,,$@) && rm -rf out && npm run build && cp -r node_modules out && cd out && zip -r ../../../out/$(subst build/js/,,$@).zip .

build/pwa:
	cd frontend && npm run build

build: $(addprefix build/js/,$(obj)) build/pwa

$(addprefix test/js/,$(obj)):
	cd api/$(subst test/js/,,$@) && npm run test

test/pwa:
	cd frontend && npm run test

test: $(addprefix test/js/,$(obj)) test/pwa

run: build
	terraform -chdir=terraform apply --auto-approve

plan: build
	terraform -chdir=terraform plan 

clean:
	terraform -chdir=terraform destroy --auto-approve
	rm -rf out

$(addprefix depend/js/,$(obj)):
	cd api/$(subst depend/js/,,$@) && npm install

depend/pwa:
	cd frontend && npm install

depend: $(addprefix depend/js/,$(obj)) depend/pwa