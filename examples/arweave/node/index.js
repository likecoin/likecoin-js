const likecoin = require('../../../dist/commonjs');

const path = require('path');
const { DirectSecp256k1HdWallet } = require('@cosmjs/proto-signing');

const mnemonic = 'surround miss nominee dream gap cross assault thank captain prosper drop duty group candy wealth weather scale put';

async function main() {
  try {
    const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
    const [from] = await signer.getAccounts();
    const res1 = await likecoin.arweave.submitToArweaveAndISCN(
      path.resolve(__dirname, '../../asset/upload/index.html'),
      {
        name: 'Index',
      },
      signer,
      from.address,
    );
    console.log(res1);

    const res2 = await likecoin.arweave.submitToArweaveAndISCN(
      path.resolve(__dirname, '../../asset/upload'),
      {
        name: 'Index + Assets',
      },
      signer,
      from.address,
    );
    console.log(res2);
  } catch (err) {
    console.error(err);
  }
}

main();
