all: build

build:
	mkdir -p out
	zip -j out/hello-world.zip src/hello-world.js

run: build
	terraform apply -auto-approve

clean:
	terraform destroy -auto-approve
	rm -rf out
