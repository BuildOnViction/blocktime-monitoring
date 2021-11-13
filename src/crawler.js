const fs = require('fs')
const config = require('config')
const web3 = require('./web3')
const {
    exec
} = require('child_process')

const notiBot = require('noti_bot')

const THRESHOLD = config.get('blockTimeThreshold') || 60

const CURRENT_BLOCK_FILENAME = 'src/current.txt'

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))

// previous: the previous block
// current: the current block
const getBlockTime = (previous, current) => {
    if (!previous || !current) {
        console.error(`Invalid block. previous: ${previous}. current: ${current}`)
        return
    }
    return (current.timestamp - previous.timestamp)
}

const main = async () => {
    let current, currentBlock, previous, previousBlock, latest
    try {
        latest = await web3.eth.getBlockNumber()
        try {
            current = fs.readFileSync(CURRENT_BLOCK_FILENAME, 'utf8')
        } catch (er) {
            current = latest
        }
        

        while (true) {
            if (!current) {
                current = 1
                continue
            }
            console.log(`checking block ${current}`)
            if (current >= latest) {
                await sleep(2000)
            }
            previous = current - 1


            if (!currentBlock) {
                previousBlock = await web3.eth.getBlock(previous)
                currentBlock = await web3.eth.getBlock(current)

            } else {
                previousBlock = currentBlock
                currentBlock = await web3.eth.getBlock(current)

            }
            if (!previous || !current) {
                await sleep(2000)
                continue
            }

            let blockTime = getBlockTime(previousBlock, currentBlock)
            if (blockTime > THRESHOLD) {
                let msg = `Block ${previous} took ${blockTime} seconds`
                console.log(msg)
                await notiBot.notifySlack(msg, config.get("slack.token"), config.get("slack.target"), config.get("slack.botname"), config.get("slack.boticon"))

                //TODO: do something else to count all slow block
            }

            current++
        }
        
    } catch (err) {
        exec(`echo ${current} > ${CURRENT_BLOCK_FILENAME}`)
        console.error(`Crawler error ${JSON.stringify(err)}`)
    }
}
main()