import assert from 'assert'
import { satoshi } from '../src/utils'
import { Val } from '../src/logic'

describe('utils', function() {
  describe('satoshi', function() {
    it('can convert satoshi and vice versa', function() {
      assert(satoshi.to('1.23', 3).toString(), '1230')
      assert(satoshi.from('123', 3).toString(), '1.23')

      assert(satoshi.to('-1.23', 3).toString(), '-1230')
      assert(satoshi.from('-123', 3).toString(), '-1.23')
    })
  })

  describe('val', function() {
    it('methods are correct', function() {
      const a = Val.fromSat('12', 2)
      const b = Val.fromSat('10', 2)
      assert(a.add(b).btc, '0.22')
      assert(a.mul(10).btc, '1.2')
      assert(a.mul(0.02).btc, '0')
      assert(a.mul(0.2).btc, '0.02')
      assert(a.mul(5.5).btc, '0.66')

      const c = Val.fromSat('-20', 2)
      assert(c.add(a).mul(2).btc, '-0.16')
    })

    it('usd convertions', function() {
      const a = Val.fromSat('12', 2)
      assert(a.usd(0.2, 5), '0.024')
      assert(Val.fromUsd('0.024', 2, '0.2', 2).btc, '0.12')
    })
  })
})
