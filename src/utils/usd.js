import satoshi from './satoshi'

function to(btc, decimals, usd, usdDecimals) {
  let copy = btc
  const satUsd = satoshi.to(usd.toString(), usdDecimals)
  return satoshi.from(satoshi.to(copy, decimals).multiply(satUsd), decimals + usdDecimals)
}

function from(btc, decimals, usd, usdDecimals) {
  let copy = btc
  const satUsd = satoshi.to(usd.toString(), usdDecimals)
  return satoshi.from(satoshi.to(copy, decimals + usdDecimals).divide(satUsd), decimals)
}

export default {
  to,
  from
}