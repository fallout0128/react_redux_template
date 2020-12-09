import formatNumber from 'format-number'

function decimals(v, decimals) {
  return formatNumber({ truncate: decimals, integerSeparator: '' })(v)
}

function fiat(v, prefix, decimals = 2) {
  return formatNumber({ truncate: decimals, prefix })(v)
}

function btc(v, decimals, symbol) {
  return formatNumber({ truncate: decimals, suffix: ` ${symbol}` })(v)
}

export default {
  decimals,
  fiat,
  btc
}