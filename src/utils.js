const ethUtils = require('ethereumjs-util')
const { BlockHeader } = require('@ethereumjs/block')

const web3 = require('./web3')


module.exports = {
    getBlockAuthor: async (block) => {
        let m1
        const dataBuff = ethUtils.toBuffer(block.extraData)
        const sig = ethUtils.fromRpcSig(dataBuff.slice(dataBuff.length - 65, dataBuff.length))

        block.extraData =
            '0x' +
            ethUtils
                .toBuffer(block.extraData)
                .slice(0, dataBuff.length - 65)
                .toString('hex')

        const headerHash = BlockHeader.fromHeaderData({
            parentHash: ethUtils.toBuffer(block.parentHash),
            uncleHash: ethUtils.toBuffer(block.sha3Uncles),
            coinbase: ethUtils.toBuffer(block.miner),
            stateRoot: ethUtils.toBuffer(block.stateRoot),
            transactionsTrie: ethUtils.toBuffer(block.transactionsRoot),
            receiptTrie: ethUtils.toBuffer(block.receiptsRoot),
            bloom: ethUtils.toBuffer(block.logsBloom),
            difficulty: ethUtils.toBuffer(parseInt(block.difficulty)),
            number: ethUtils.toBuffer(block.number),
            gasLimit: ethUtils.toBuffer(block.gasLimit),
            gasUsed: ethUtils.toBuffer(block.gasUsed),
            timestamp: ethUtils.toBuffer(block.timestamp),
            extraData: ethUtils.toBuffer(block.extraData),
            mixHash: ethUtils.toBuffer(block.mixHash),
            nonce: ethUtils.toBuffer(block.nonce),
        })

        const pub = ethUtils.ecrecover(headerHash.hash(), sig.v, sig.r, sig.s)
        m1 = ethUtils.addHexPrefix(ethUtils.pubToAddress(pub).toString('hex'))
        m1 = web3.utils.toChecksumAddress(m1)
        return m1
    },

    toChecksumAddress: (address) => {
        return web3.utils.toChecksumAddress(address)
    },

    getDate: (timestamp) => {
        const yourDate = new Date(timestamp * 1000)
        return yourDate.toISOString().split('T')[0]
    },

}