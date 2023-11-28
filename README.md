# Bitzees Blockchain Internship Assignment

## How to run

```shell
# clone the repo
git clone https://github.com/bytecode-velocity/bitzees-task.git
# change directory
cd bitzees-task
```

Then create a new file called `.env` and fill all the fields in it using appropriate values. They are as follows:

```
# This account should have some AVAX
PRIVATE_KEY_OWNER=
PRIVATE_KEY_ADMIN=
# This account should have some AVAX
PRIVATE_KEY_ACC1=
PRIVATE_KEY_ACC2=
INFURA_FUJI_URL=
# This is optional
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

## Sample

The following transactions are recorded in the MySQL database

```
TetherToken implementation deployment
https://testnet.snowtrace.io/tx/0x56f6e794323d0ac0f0819b4b9561e611f3bb53896a7ddddacbcd62661b1b53e6?chainId=43113

TransparentUpgradeableProxy deployment
https://testnet.snowtrace.io/tx/0x3391a0b9b0759c38e59c6e9e913fb4867f31e34f911326a78941d7466dc491f3?chainId=43113

Initializing TetherToken
https://testnet.snowtrace.io/tx/0x33d60160d82fbe0096d1851e79e44103ff31cab390dd04eded7afd1a98b7a9dd?chainId=43113

Minting 0.0001 (100) USDT to an address
https://testnet.snowtrace.io/tx/0xe18f050f153f88f0abc8a845050f34ce1b25fb23d0eaedd69975186a32c44963?chainId=43113

Transfering 0.00005 (50) USDT to another address
https://testnet.snowtrace.io/tx/0xb1fdadb43d37b7d0da65634c25b26e13558299f157d4b7992c789488520e1a40?chainId=43113
```

![image](https://github.com/bytecode-velocity/bitzees-task/assets/29842127/31d86253-e6d2-4d92-a017-160f75d86d58)

