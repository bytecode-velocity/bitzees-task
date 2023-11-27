# Bitzees Blockchain Internship Assignment

## How to run

```shell
# clone the repo
git clone https://github.com/bytecode-velocity/bitzees-task.git
# change directory
cd bitzees-task
```

Then open and fill all the fields in .env using appropriate values. They are as follows:

```
# This account should have some AVAX
PRIVATE_KEY_OWNER=
PRIVATE_KEY_ADMIN=
# This account should have some AVAX
PRIVATE_KEY_ACC1=
PRIVATE_KEY_ACC2=
INFURA_FUJI_URL=
# Following is optional
INFURA_MUMBAI_URL=
SQL_USER=
SQL_PASS=
```

Then run the following:

```shell
# install dependencies
npm i
# create the DB
node scripts/initDB.js
# press CTRL+C
# create the Tables
node scripts/initTables.js
# press CTRL+C
# run the script
npx hardhat run scripts/run.js --network fuji
# press CTRL+C
```

Check out the SQL DB!

```
# enter the mysql command line client
mysql -u <your-username> -p
<enter-password>
> use bitzees_task;
> SELECT * FROM deployments;
> SELECT * FROM interactions;
```
