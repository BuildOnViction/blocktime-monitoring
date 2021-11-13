const config = require('config')
const Web3 = require('web3')
const timeout = 120000
let web3
try {
  web3 = new Web3(
    new Web3.providers.HttpProvider(config.get('rpc'), {
      timeout: timeout,
    })
  )
} catch (err) {
  console.log(err)
}
module.exports = web3