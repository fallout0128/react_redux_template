import bigInt from 'big-integer'
import { satoshi, usd, format, util, is } from './utils'

export default class Coin {
  constructor(sat, decimals) {
    this.type = 'Coin'
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

  static fromUsd = (fiatBtc, decimals, rate, usdDecimals = undefined) => {
    const rateDecimals = usdDecimals || util.getFloatDecimals(rate)
    const btc = usd.from(fiatBtc, decimals, rate, rateDecimals)
    return Coin.fromBtc(btc, decimals)
  }

  check = (v) => {
    if (v.decimals !== this.decimals)
      throw 'Different decimals'
  }

  mul = (v) => {
    if (is.float(v)) {
      const dec = util.getFloatDecimals(v)
      const btc = usd.to(this.btc, this.decimals, v, dec)
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

  usd = (rate, decimals = undefined) => {
    const rateDecimals = decimals || util.getFloatDecimals(rate)
    return usd.to(this.btc, this.decimals, rate, rateDecimals)
  }
}