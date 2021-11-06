const { IS_TESTNET } = process.env;

export const COSMOS_LCD_ENDPOINT = IS_TESTNET ? 'https://node.taipei.like.co' : 'https://mainnet-node.like.co';
export const COSMOS_CHAIN_ID = IS_TESTNET ? 'likechain-cosmos-testnet-2' : 'likecoin-chain-sheungwan';
export const COSMOS_DENOM = 'nanolike';
