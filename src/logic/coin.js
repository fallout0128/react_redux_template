import bigInt from 'big-integer'
import { satoshi, fiat, format, util, is } from './utils'

export default class Coin {
  constructor(sat, decimals, symbol = '') {
    this.type = 'Coin'
    this.symbol = symbol
    this.decimals = decimals
    this.sat = sat
    this.btc = satoshi.from(sat, decimals)
  }

  static fromBtc(btc, decimals) {
    const sat = satoshi.to(btc, decimals)
    return Coin.fromSat(sat, decimals)
  }

  static fromSat(sat, decimals) {
    return new Coin(new bigInt(sat), decimals)
  }

  static fromFiat = (fiatBtc, decimals, rate, fiatDecimals = undefined) => {
    const rateDecimals = fiatDecimals || util.getFloatDecimals(rate)
    const btc = fiat.from(fiatBtc, decimals, rate, rateDecimals)
    return Coin.fromBtc(btc, decimals)
  }

  compare = (v) => {
    if (v.type === this.type) {
      this.check(v)
      return new bigInt(this.sat).compare(new bigInt(v.sat))
    }

    return new bigInt(this.sat).compare(v)
  }

  format = (symbol = this.symbol) => {
    return format.btc(this.btc, this.decimals, symbol)
  } 

  check = (v) => {
    if (v.decimals !== this.decimals)
      throw 'Different decimals'
  }

  mul = (v) => {
    if (is.float(v)) {
      const dec = util.getFloatDecimals(v)
      const btc = fiat.to(this.btc, this.decimals, v, dec)
      return Coin.fromBtc(btc, this.decimals)
    }
    return Coin.fromSat(this.sat.multiply(v), this.decimals)
  }

  add = (v) => {
    if (v.type === this.type) {
      this.check(v)
      return Coin.fromSat(this.sat.add(v.sat), this.decimals)
    }

    return Coin.fromSat(this.sat.add(v), this.decimals)
  }

  fiat = (rate, decimals = undefined) => {
    const rateDecimals = decimals || util.getFloatDecimals(rate)
    return fiat.to(this.btc, this.decimals, rate, rateDecimals)
  }
}