import satoshi from './satoshi'

function to(btc, decimals, fiat, fiatDecimals) {
  let copy = btc
  const satfiat = satoshi.to(fiat.toString(), fiatDecimals)
  return satoshi.from(satoshi.to(copy, decimals).multiply(satfiat), decimals + fiatDecimals)
}

function from(btc, decimals, fiat, fiatDecimals) {
  let copy = btc
  const satfiat = satoshi.to(fiat.toString(), fiatDecimals)
  return satoshi.from(satoshi.to(copy, decimals + fiatDecimals).divide(satfiat), decimals)
}

export default {
  to,
  from
}