# Reactor Email Provider

> Email API as facade for other email clients



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

### Run the tests

```bash
$ npm test # run the tests
```


### Run the tests in watch mode

```bash
$ npm test -- -w # run the tests in watch mode
```


## Author

**Wilson Mendes (willmendesneto)**
+ <https://plus.google.com/+WilsonMendes>
+ <https://twitter.com/willmendesneto>
+ <http://github.com/willmendesneto>
