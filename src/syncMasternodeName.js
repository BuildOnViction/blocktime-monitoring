const { default: axios } = require('axios')
const utils = require('./utils')
const fs = require('fs')
const fileName = './masternodes.json'



const main = async () => {
  let accountName = require(fileName)
  const { data } = await axios.get(`https://master.tomochain.com/api/candidates`)
  for (const node of data.items) {
    if (!node.name) {
      continue
    }
    let address = utils.toChecksumAddress(node.candidate)
    accountName[address] = `${node.name}`
  }
  await fs.writeFile(`src/` +fileName, JSON.stringify(accountName, null, 4), function () {})
}

main()
