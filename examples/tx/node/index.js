const likecoin = require('../../../dist/commonjs');

const { DirectSecp256k1HdWallet } = require('@cosmjs/proto-signing');

const mnemonic = 'surround miss nominee dream gap cross assault thank captain prosper drop duty group candy wealth weather scale put';

async function main() {
  try {
    const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
    const [from] = await signer.getAccounts();
    const res = await likecoin.tx.sendLIKE(from.address, 'cosmos1rclg677y2jqt8x4ylj0kjlqjjmnn6w6304rrtc', '100', signer, 'test');
    await likecoin.tx.queryLIKETransaction(res.transactionHash);
  } catch (err) {
    console.error(err);
  }
}

main();
