.PHONY: build test clean all frontend-install frontend-start

all: build test

build:
	cd contracts/certificate && cargo build --target wasm32-unknown-unknown --release
	cd contracts/vault && cargo build --target wasm32-unknown-unknown --release

test:
	cd contracts/certificate && cargo test
	cd contracts/vault && cargo test

clean:
	cd contracts/certificate && cargo clean
	cd contracts/vault && cargo clean

frontend-install:
	npm install

frontend-start:
	npm run start
