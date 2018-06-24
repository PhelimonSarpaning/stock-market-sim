[ ![Codeship Status for murtazasmart/stock-market-sim](https://app.codeship.com/projects/d9e84da0-56c6-0136-a61e-62d37ace2b50/status?branch=master)](https://app.codeship.com/projects/294830)

# Stock market simulator

This application is a REST Service which enables the simulation of a stock market

# Prominent technologies/libraries used
 - InversifyJs - for dependency injection
 - Winston - for logging purposes
 - Mocha/Chai - as unit testing libraries
 - Typescript
 - Mongodb(NoSQL) using mongoose library
 - Sinon to stub the functions for unit testing
 - TSLint for linting, refer below for more details
 
 # Project details
### Team name: EXIT
### API doc link - https://docs.google.com/spreadsheets/d/1tFuveKrxBRxqtGC7-UDONrHTRYYbcqwofPyL0zMwmcE/edit#gid=0
### Members:
 - Murtaza Anverali Esufali 16211211
 - Maheshi K.H.Gunaratne    16211197
 - Rathnayake Bhagya P M    16211279
 - Mekala Rashmika K B      16211194
 - M.Kasun lalendra Silva   16211181

| Repository Name        | Github Link           | Live URL  |
| ------------- |-------------| -----|
| Stock market simulator | https://github.com/murtazasmart/stock-market-sim | http://stock-market-simulator.herokuapp.com/ |
| Stock market broker | https://github.com/murtazasmart/stock-market-broker | https://eager-babbage-836674.netlify.com |
| Stock market broker backend | https://github.com/murtazasmart/stock-market-broker-backend | https://hidden-badlands-21838.herokuapp.com/ |
| Stock market analyst service | https://github.com/murtazasmart/stock-market-analyst-service/ | https://stock-market-analyst.herokuapp.com |
| Stock market bank service | https://github.com/murtazasmart/stock-market-bank-service/ | https://stock-market-bank-service.herokuapp.com/ |

# Architecture
 

# Git Workflow

Master branch is the main development branch. Do not commit directly to master branch.

Steps to contribute:

- Clone a local repo or if already cloned pull latest version with `git pull`
- Create a new feature branch for the work you're doing `git checkout -b feature-branch-name`
- Develop, Add, Commit as much as you like 😎 
- Once your feature is complete and all tests are passed, you can push your branch to bitbucket with `git push -u origin feature-branch-name`
- Goto bitbucket and create a new pull request to merge your feature branch
- Add a team member to review your pull request and ask to merge.

# Getting Started

- Install dependencies
```
npm install
```

- Build 
```
npm run build
```

- Start/Run
```
npm run start
```

# Folder Structure

| Name | Description |
| ------------------------ | ----------------------------------------------------------------- |
| **dist**                 | Contains the distributable from the TypeScript build.             |
| **src**                  | Contains source code that will be compiled to the dist dir   |                
| **test**                 | Contains tests                                                    |
| tsconfig.json            | Config settings for compiling TypeScript                          |
| tslint.json              | Config settings for TSLint code style checking                    |                          


# Linting

TSLint with recommended rules are used

- Run tslint 
```
npm run tslint
```
- Fix errors automatically 
```
npm run tslint:fix
```
## Rules

Uses [recommended rules](https://palantir.github.io/tslint/rules/) by TSLint.

- Use camelCase when naming objects, functions, and instances
- Use PascalCase only when naming constructors or classes.
- A base filename should exactly match the name of its default export.
- Use camelCase when you export-default a function. Your filename should be identical to your function’s name.
- Use PascalCase when you export a constructor / class / singleton / function library / bare object.
- Acronyms and initialisms should always be all capitalized, or all lowercased.

Adapted from [airbnb-styleguide](https://github.com/airbnb/javascript#naming-conventions)
