# CS520-course-project

## Description

This is course project for cs510. 

## Environment

- mysql Ver 8.0.22
- npm 6.14.8

## Usage

```shell
# start mysql 
brew services start mysql
# check if mysql is started
brew services list
# try connecting by root username
# PS: remember to config mysql username and password in server/sqlquery.js
mysql -u root -p
# in terminal 1, run server
cd server/
npm i 
npm start
# in terminal 2, run client
cd client/
npm i
npm start
# if node version issue pops up, fix by:
nvm install v14.3.0
```

PS: if "npm i" failed, try remove node_modules to start a fresh install. Above commands work on MacOS.
nice tutorial for MongoDB: https://zellwk.com/blog/install-mongodb/

