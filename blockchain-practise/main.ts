import { sha256 } from 'https://raw.githubusercontent.com/chiefbiiko/sha256/master/mod.ts';

interface BlockData {
  name: string;
  time: Date;
}

class Transaction {
  public fromAddress:string;
  public toAddress:string;
  public amount:number;

  constructor(fromAddress:string, toAddress:string, amount:number) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  private readonly timestamp: number;
  public transactions: Array<Transaction>;
  public previousHash: string;
  public hash: string;
  private nonce: number;

  constructor(timestamp: number, transactions: Array<Transaction>, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash(): string {
    return sha256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce, 'utf-8', 'hex').toString();
  }

  mineBlock(difficulty:number){
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log('Block mined: ' + this.hash);
  }
}

class Blockchain {
  private chain: Array<Block>;
  private difficulty: number;
  private pendingTransactions: Array<Transaction>;
  private miningReward: number

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock(): Block {
    return new Block(Date.now(), [], '0');
  }
 
  getLatesBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransaction(miningRewardAddress:string):void{
    const block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log('Block successfully mined!');
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction('', miningRewardAddress, this.miningReward)
    ]
  }

  createTransaction(transaction:Transaction):void{
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address:string):number{
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  isChainValid():boolean{
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previosBlock = this.chain[i - 1];
      
      if(currentBlock.hash !== currentBlock.calculateHash()){
        return false;
      }

      if(currentBlock.previousHash !== previosBlock.hash){
        return false;
      }
    }

    return true;
  }
}

const snyungBlock =  new Blockchain();

snyungBlock.createTransaction(new Transaction('address1', 'address2', 100));
snyungBlock.createTransaction(new Transaction('address2', 'address1', 50))

console.log('String');
snyungBlock.minePendingTransaction('xaciers-address');

console.log('Balance of xavier is', snyungBlock.getBalanceOfAddress('xaciers-address'));

snyungBlock.minePendingTransaction('xaciers-address');

console.log('Balance of xavier is', snyungBlock.getBalanceOfAddress('xaciers-address'));