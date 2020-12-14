import { Coin } from '../../logic'

const required = v => !v? `Can't be empty` : undefined
const minBtc = (minBtc, decimals, { included = true, message, symbol = '' }) => {
  const minCoin = Coin.fromBtc(minBtc, decimals)
  
  return btc => {
    if (!btc) return undefined

    const status = Coin
      .fromBtc(btc, decimals)
      .compare(minCoin)

    const isError = included? status === -1 : status !== 1
    return isError? 
      (!message? `Enter value higher ${!included? 'or equal' : ''} than ${minCoin.format()} ${symbol.toUpperCase()}` : message(minCoin.format())) :
      undefined 
}}

const maxBtc = (maxBtc, decimals, { included = true, message, symbol = '' }) => {
  const maxCoin = Coin.fromBtc(maxBtc, decimals)
  return btc => {
    if (!btc) return undefined

    const status = Coin
      .fromBtc(btc, decimals)
      .compare(maxCoin)
    
    const isError = included? status === 1 : status !== -1
    return isError? 
      (!message? `Enter value less ${included? 'or equal' : ''} than ${maxCoin.format()} ${symbol.toUpperCase()}` : message(maxCoin.format())) :
      undefined 
}}

const betweenBtc = (minBtcV, maxBtcV, decimals, { left, right } = { left: true, right: true }) => v => {
  return minBtc(minBtcV, decimals, { included: left })(v) || maxBtc(maxBtcV, decimals, { included: right })(v)
}

export default {
  required,
  minBtc,
  maxBtc,
  betweenBtc
}