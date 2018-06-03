# Reactor Email Provider

> Email API as facade for other email clients


[![Build Status](https://circleci.com/gh/willmendesneto/reactor-email-facade.svg?style=shield)](https://circleci.com/gh/willmendesneto/reactor-email-facade)
[![Coverage Status](https://coveralls.io/repos/github/willmendesneto/reactor-email-facade/badge.svg?branch=master)](https://coveralls.io/github/willmendesneto/reactor-email-facade?branch=master)


## Frameworks, Libraries and Tools

- NPM as dependency manager;
- Mocha as test framework;
- Sinon as Standalone test spies, stubs and mocks;
- Chai as BDD/TDD assertion library;
- ESLint as lint tool;
- Pino as logger;
- NYC as code coverage tooling;
- Node Fetch as HTTP client;
- Optional: Docker and Docker compose for application provisioning;


## How to install

### Manual installation

Make sure that you are using the NodeJS version is the same as `.nvmrc` file version. If you don't have this version please use a version manager such as `nvm` or `n` to manage your local nodejs versions.

> Please make sure that you are using NodeJS version 6.10.2

Assuming that you are using `nvm`, please run the commands inside this folder:

```bash
$ nvm install $(cat .nvmrc); # install required nodejs version
$ nvm use $(cat .nvmrc); # use nodejs version
$ npm install
```

In Windows, please install NodeJS using one of these options:

Via `NVM Windows` package: Dowload via [this link](https://github.com/coreybutler/nvm-windows). After that, run the commands:

```bash
$ nvm install $(cat .nvmrc); # install required nodejs version
$ nvm use $(cat .nvmrc); # use nodejs version
$ npm install
```

Via Chocolatey:

```bash
$ choco install nodejs.install -version v8.9.3
```

## NPM Commands

### Run the app

```bash
$ npm start:app
```


### Run the app with debug

```bash
$ npm debug:app
```

And the project it will be running locally using `--inspect-brk` flag, enabling V8 inspector integration. For more details, please take a look at [NodeJS Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/).

### Run the unit tests

```bash
$ npm test:unit # run the tests
```

### Run the integration tests

```bash
$ npm test:integration # run the tests
```


### Run the tests in watch mode

```bash
$ npm test:unit -- -w # run the unit tests in watch mode
$ npm test:integration -- -w # run the integration tests in watch mode
```


## Circle CI Pipeline Model

This project is using Circle CI to run all the automated tasks/validations. This is the current build pipeline which runs if someone sends a new Pull Request or master is updated.


![Circle CI Pipeline](./docs/circle-ci-pipeline.png)

## Checking the API endpoints

You can download `postman`, a Rest client to simulate the requests locally, and import [this collection](./docs/REACTOR_EMAIL.postman_collection.json). After that, you can do all the calls you want to see how the API is working.


## Author

**Wilson Mendes (willmendesneto)**
+ <https://plus.google.com/+WilsonMendes>
+ <https://twitter.com/willmendesneto>
+ <http://github.com/willmendesneto>
