import { Coin } from '../../logic'

const required = v => !v? `Can't be empty` : undefined
const minBtc = (minBtc, decimals, included = true) => {
  const minCoin = Coin.fromBtc(minBtc, decimals)
  
  return btc => {
    if (!btc) return undefined

    const status = Coin
      .fromBtc(btc, decimals)
      .compare(minCoin)

    const isError = included? status === -1 : status !== 1
    return isError? 
      `Less ${!included? 'or equal' : ''} than ${minCoin.format()}` :
      undefined 
}}

const maxBtc = (maxBtc, decimals, included = true) => {
  const maxCoin = Coin.fromBtc(maxBtc, decimals)
  return btc => {
    if (!btc) return undefined

    const status = Coin
      .fromBtc(btc, decimals)
      .compare(maxCoin)
    
    const isError = included? status === 1 : status !== -1
    return isError? 
      `Higher ${!included? 'or equal' : ''} than ${maxCoin.format()}` :
      undefined 
}}

const betweenBtc = (minBtcV, maxBtcV, decimals, { left, right } = { left: true, right: true }) => v => {
  return minBtc(minBtcV, decimals, left)(v) || maxBtc(maxBtcV, decimals, right)(v)
}

export default {
  required,
  minBtc,
  maxBtc,
  betweenBtc
}