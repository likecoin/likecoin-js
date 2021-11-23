const { DirectSecp256k1HdWallet } = require('@cosmjs/proto-signing');
const likecoin = require('../../../dist/commonjs');

const mnemonic = 'surround miss nominee dream gap cross assault thank captain prosper drop duty group candy wealth weather scale put';

async function main() {
  try {
    // https://github.com/likecoin/iscn-js samples
    // Query ISCN by ID
    const res1 = await likecoin.iscn.queryRecordsById('iscn://likecoin-chain/dLbKMa8EVO9RF4UmoWKk2ocUq7IsxMcnQL1_Ps5Vg80/1');
    console.log(res1);

    const client = likecoin.iscn.queryClient;
    // Query ISCN by owner
    const res2 = await client.queryRecordsByOwner('cosmos1sf2sc6t37xhd3m0dcaq6h5dz22mtru2ugdwp0v');
    console.log(res2);

    const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);

    const ISCNPayload = {
      contentFingerprints: [
        'hash://sha256/9564b85669d5e96ac969dd0161b8475bbced9e5999c6ec598da718a3045d6f2e',
      ],
      stakeholders: [
        {
          entity: {
            '@id': 'did:cosmos:5sy29r37gfxvxz21rh4r0ktpuc46pzjrmz29g45',
            name: 'Chung Wu',
          },
          rewardProportion: 95,
          contributionType: 'http://schema.org/author',
        },
      ],
      type: 'Article',
      name: '使用矩陣計算遞歸關係式',
      usageInfo: 'https://creativecommons.org/licenses/by/4.0',
      keywords: ['matrix', 'recursion'],
    };

    const res = await likecoin.iscn.createISCNRecord(signer, ISCNPayload);
    console.log(res);

    const iscnID = await client.queryISCNIdsByTx(res.transactionHash);
    console.log(iscnID);
  } catch (err) {
    console.error(err);
  }
}

main();
