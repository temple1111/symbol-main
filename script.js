const symbol = require('/node_modules/symbol-sdk')

const GENERATION_HASH = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6'
const EPOCH = 1615853185
const XYM_ID = '6BED913FA20223F8'
const NODE_URL = 'https://sym-main.opening-line.jp:3001'
const NET_TYPE = symbol.NetworkType.MAIN_NET

const repositoryFactory = new symbol.RepositoryFactoryHttp(NODE_URL)
const accountHttp = repositoryFactory.createAccountRepository()
const transactionHttp = repositoryFactory.createTransactionRepository()

setTimeout(() => {
  
const address = symbol.Address.createFromRawAddress(window.SSS.activeAddress)

const dom_addr = document.getElementById('wallet-addr')
dom_addr.innerText = address.pretty()

accountHttp.getAccountInfo(address)
  .toPromise()
  .then((accountInfo) => {
    for (let m of accountInfo.mosaics) {
      if (m.id.id.toHex() === XYM_ID) {
        const dom_xym = document.getElementById('wallet-xym')
        dom_xym.innerText = `TEMPLE point : ${m.amount.compact() / Math.pow(10, 6)}`
      }
    }
  })
const searchCriteria = {
  group: symbol.TransactionGroup.Confirmed,
  address,
  pageNumber: 1,
  pageSize: 1,
  order: symbol.Order.Desc,
}

transactionHttp
  .search(searchCriteria)
  .toPromise()
  .then((txs) => {
    console.log(txs)
    const dom_txInfo = document.getElementById('wallet-transactions')
    for (let tx of txs.data) {
      console.log(tx)
      const dom_tx = document.createElement('div')
      const dom_txType = document.createElement('div')
      const dom_hash = document.createElement('div')

      dom_txType.innerText = `Transaction Type : ${getTransactionType(tx.type)}`
      dom_hash.innerText = `Transaction Hash : ${tx.transactionInfo.hash}`

      dom_tx.appendChild(dom_txType)
      dom_tx.appendChild(dom_hash)
      dom_tx.appendChild(document.createElement('hr'))

      dom_txInfo.appendChild(dom_tx)
    }
  })
}, 500)

function getTransactionType (type) { // https://symbol.github.io/symbol-sdk-typescript-javascript/1.0.3/enums/TransactionType.html
  if (type === 16724) return 'TRANSFER TRANSACTION'
  return 'OTHER TRANSACTION'
}

function handleSSS() {
  console.log('handle sss')
  const addr = document.getElementById('form-addr').value
  const amount = document.getElementById('form-amount').value
  const message = document.getElementById('form-message').value
  
  const tx = symbol.TransferTransaction.create(
    symbol.Deadline.create(EPOCH),
    symbol.Address.createFromRawAddress(addr),
    [
      new symbol.Mosaic(
        new symbol.MosaicId(XYM_ID),
        symbol.UInt64.fromUint(Number(amount))
      )
    ],
    symbol.PlainMessage.create(message),
    NET_TYPE,
    symbol.UInt64.fromUint(2000000)
  )

  window.SSS.setTransaction(tx)

  window.SSS.requestSign().then(signedTx => {
    console.log('signedTx', signedTx)
    transactionHttp.announce(signedTx)
  })
}

{
    "network": {
        "identifier": "mainnet",
        "nemesisSignerPublicKey": "BE0B4CF546B7B4F4BBFCFF9F574FDA527C07A53D3FC76F8BB7DB746F8E8E0A9F",
        "nodeEqualityStrategy": "host",
        "generationHashSeed": "57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6",
        "epochAdjustment": "1615853185s"
    },
    "chain": {
        "enableVerifiableState": true,
        "enableVerifiableReceipts": true,
        "currencyMosaicId": "0x6BED'913F'A202'23F8",
        "harvestingMosaicId": "0x6BED'913F'A202'23F8",
        "blockGenerationTargetTime": "30s",
        "blockTimeSmoothingFactor": "3000",
        "importanceGrouping": "720",
        "importanceActivityPercentage": "5",
        "maxRollbackBlocks": "0",
        "maxDifficultyBlocks": "60",
        "defaultDynamicFeeMultiplier": "100",
        "maxTransactionLifetime": "6h",
        "maxBlockFutureTime": "300ms",
        "initialCurrencyAtomicUnits": "7'842'928'625'000'000",
        "maxMosaicAtomicUnits": "8'999'999'999'000'000",
        "totalChainImportance": "7'842'928'625'000'000",
        "minHarvesterBalance": "10'000'000'000",
        "maxHarvesterBalance": "50'000'000'000'000",
        "minVoterBalance": "3'000'000'000'000",
        "votingSetGrouping": "1440",
        "maxVotingKeysPerAccount": "3",
        "minVotingKeyLifetime": "112",
        "maxVotingKeyLifetime": "360",
        "harvestBeneficiaryPercentage": "25",
        "harvestNetworkPercentage": "5",
        "harvestNetworkFeeSinkAddressV1": "NBUTOBVT5JQDCV6UEPCPFHWWOAOPOCLA5AY5FLI",
        "harvestNetworkFeeSinkAddress": "NAVORTEX3IPBAUWQBBI3I3BDIOS4AVHPZLCFC7Y",
        "maxTransactionsPerBlock": "6'000"
    },
    "plugins": {
        "accountlink": {
            "dummy": "to trigger plugin load"
        },
        "aggregate": {
            "maxTransactionsPerAggregate": "100",
            "maxCosignaturesPerAggregate": "25",
            "enableStrictCosignatureCheck": false,
            "enableBondedAggregateSupport": true,
            "maxBondedTransactionLifetime": "48h"
        },
        "lockhash": {
            "lockedFundsPerAggregate": "10'000'000",
            "maxHashLockDuration": "2d"
        },
        "locksecret": {
            "maxSecretLockDuration": "365d",
            "minProofSize": "0",
            "maxProofSize": "1024"
        },
        "metadata": {
            "maxValueSize": "1024"
        },
        "mosaic": {
            "maxMosaicsPerAccount": "1'000",
            "maxMosaicDuration": "3650d",
            "maxMosaicDivisibility": "6",
            "mosaicRentalFeeSinkAddressV1": "NC733XE7DF46Q7QYLIIZBBSCJN2BEEP5FQ6PAYA",
            "mosaicRentalFeeSinkAddress": "NCVORTEX4XD5IQASZQEHDWUXT33XBOTBMKFDCLI",
            "mosaicRentalFee": "500000"
        },
        "multisig": {
            "maxMultisigDepth": "3",
            "maxCosignatoriesPerAccount": "25",
            "maxCosignedAccountsPerAccount": "25"
        },
        "namespace": {
            "maxNameSize": "64",
            "maxChildNamespaces": "100",
            "maxNamespaceDepth": "3",
            "minNamespaceDuration": "30d",
            "maxNamespaceDuration": "1825d",
            "namespaceGracePeriodDuration": "30d",
            "reservedRootNamespaceNames": "symbol, symbl, xym, xem, nem, user, account, org, com, biz, net, edu, mil, gov, info",
            "namespaceRentalFeeSinkAddressV1": "NBDTBUD6R32ZYJWDEWLJM4YMOX3OOILHGDUMTSA",
            "namespaceRentalFeeSinkAddress": "NCVORTEX4XD5IQASZQEHDWUXT33XBOTBMKFDCLI",
            "rootNamespaceRentalFeePerBlock": "2",
            "childNamespaceRentalFee": "100000"
        },
        "restrictionaccount": {
            "maxAccountRestrictionValues": "100"
        },
        "restrictionmosaic": {
            "maxMosaicRestrictionValues": "20"
        },
        "transfer": {
            "maxMessageSize": "1024"
        }
    }
}