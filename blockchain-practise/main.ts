import { sha256 } from 'https://raw.githubusercontent.com/chiefbiiko/sha256/master/mod.ts';

interface BlockData {
  name: string;
  time: Date;
}

class Block {
  private readonly index: number;
  private readonly timestamp: Date;
  private data: BlockData;
  public previousHash: string;
  public hash: string;

  constructor(index: number, timestamp: Date, data: BlockData, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash(): string {
    return sha256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data), 'utf-8', 'hex').toString();
  }
}

class Blockchain {
  private chain: Array<Block>;

  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock(): Block {
    const date = {
      name: 'snyung',
      time: new Date()
    };

    return new Block(0, new Date(), date, '0');
  }
 
  getLatesBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock: Block):void {
    newBlock.previousHash = this.getLatesBlock().calculateHash();
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
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
snyungBlock.addBlock(new Block(1, new Date(), {name:'a', time: new Date()}))
snyungBlock.addBlock(new Block(2, new Date(), {name:'b', time: new Date()}))

console.log('Is vlockchain valid? ' + snyungBlock.isChainValid())

// console.log(JSON.stringify(snyungBlock, null, 4))