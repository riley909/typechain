import * as CryptoJS from "crypto-js";

//? Block 구조 생성
class Block {
  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  //? static method: 이 클래스 안에서 항상 사용 가능한 method
  //? block객체를 생성하고 그 객체를 통해 함수를 사용하는 것이 일반적이지만 객체 생성 없이도 사용할 수 있는 함수
  //? 객체 없이 바로 Block.calculateBlockHash()로 사용가능
  static calculateBlockHash = (
    index: number,
    previousHash: string,
    timestamp: number,
    data: string
  ): string => CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

  //? 인자로 받은 블록의 구조를 검사
  static validateStructure = (aBlock: Block): boolean =>
    typeof aBlock.index === "number" &&
    typeof aBlock.hash === "string" &&
    typeof aBlock.previousHash === "string" &&
    typeof aBlock.timestamp === "number" &&
    typeof aBlock.data === "string";

  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timestamp: number
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

//? 첫 번째 블록
const genesisBlock: Block = new Block(0, "12345", "", "Hello", 123456);

//? 블록체인
let blockChain: Block[] = [genesisBlock];

//? 가장 최근 추가된 블록을 반환
const getLatestBlock = (): Block => blockChain[blockChain.length - 1];
//? Date.getTime(): 1970 년 1 월 1 일 00:00:00 UTC와 주어진 날짜 사이의 경과 시간 (밀리 초)을 반환
const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getLatestBlock();
  const newIndex: number = previousBlock.index + 1;
  const newTimeStamp: number = getNewTimeStamp();
  const newHash: string = Block.calculateBlockHash(
    newIndex,
    previousBlock.hash,
    newTimeStamp,
    data
  );

  const newBlock: Block = new Block(
    newIndex,
    newHash,
    previousBlock.hash,
    data,
    newTimeStamp
  );
  addBlock(newBlock);
  return newBlock;
};

//? 현재 해시를 검사하기 위해 다시 해싱하는 함수
const getHashForBlock = (aBlock: Block): string =>
  Block.calculateBlockHash(
    aBlock.index,
    aBlock.previousHash,
    aBlock.timestamp,
    aBlock.data
  );

//? 유효성 검사
//? block은 이전 블록으로의 링크가 존재함
const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
  if (!Block.validateStructure(candidateBlock)) {
    // 블록을 구성하는 요소들의 타입체크
    return false;
  } else if (previousBlock.index + 1 !== candidateBlock.index) {
    // 현재 블록의 인덱스가 이전 블록 인덱스+1 이 아니면
    return false;
  } else if (previousBlock.hash !== candidateBlock.previousHash) {
    // 인자로 받은 이전블록의 해시와 현재 블록이 가진 이전블록해시 정보가 불일치하면
    return false;
  } else if (getHashForBlock(candidateBlock) !== candidateBlock.hash) {
    // 현재블록을 가지고 다시 계산한 해시와 현재블록이 가진 자신의 해시정보가 불일치하면
    return false;
  } else {
    return true;
  }
};

const addBlock = (candidateBlock: Block): void => {
  if (isBlockValid(candidateBlock, getLatestBlock())) {
    blockChain.push(candidateBlock);
  }
};

createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");
createNewBlock("fifth block");
console.log(blockChain);

export {};
