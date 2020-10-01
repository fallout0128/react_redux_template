import bigInt from 'big-integer'
import { satoshi, usd, format, util } from '../utils'

const isFloat = (v) => (!isNaN(v) && v.toString().indexOf('.') != -1)

export default class Val {
  constructor(sat, decimals) {
    this.type = 'Val'
    this.decimals = decimals
    this.sat = sat
    this.btc = satoshi.from(sat, decimals)
  }

  static fromBtc(btc, decimals) {
    const sat = satoshi.to(btc, decimals)
    return Val.fromSat(sat, decimals)
  }

  static fromSat(sat, decimals) {
    return new Val(new bigInt(sat), decimals)
  }

  static fromUsd = (fiatBtc, decimals, rate, usdDecimals = undefined) => {
    const rateDecimals = usdDecimals || util.getFloatDecimals(rate)
    const btc = usd.from(fiatBtc, decimals, rate, rateDecimals)
    return Val.fromBtc(btc, decimals)
  }

  check = (v) => {
    if (v.decimals !== this.decimals)
      throw 'Different decimals'
  }

  mul = (v) => {
    if (isFloat(v)) {
      const dec = util.getFloatDecimals(v)
      const btc = usd.to(this.btc, this.decimals, v, dec)
      return Val.fromBtc(btc, this.decimals)
    }
    return Val.fromSat(this.sat.multiply(v), this.decimals)
  }

  add = (v) => {
    if (v.type === this.type) {
      this.check(v)
      return Val.fromSat(this.sat.add(v.sat), this.decimals)
    }

    return Val.fromSat(this.sat.add(v), this.decimals)
  }

  usd = (rate, decimals = undefined) => {
    const rateDecimals = decimals || util.getFloatDecimals(rate)
    return usd.to(this.btc, this.decimals, rate, rateDecimals)
  }
}