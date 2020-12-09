import { satoshi } from '../utils'
import { Coin } from '../../logic'

it('can convert satoshi and vice versa', function() {
  expect(satoshi.to('1.23', 3).toString()).toEqual('1230')
  expect(satoshi.from('123', 3).toString()).toEqual('0.123')

  expect(satoshi.to('-1.23', 3).toString()).toEqual('-1230')
  expect(satoshi.from('-123', 3).toString()).toEqual('-0.123')
})

it('methods are correct', function() {
  const a = Coin.fromSat('12', 2)
  const b = Coin.fromSat('10', 2)
  expect(a.add(b).btc).toEqual('0.22')
  expect(a.mul(10).btc).toEqual('1.2')
  expect(a.mul(0.02).btc).toEqual('0')
  expect(a.mul(0.2).btc).toEqual('0.02')
  expect(a.mul(5.5).btc).toEqual('0.66')

  const c = Coin.fromSat('-20', 2)
  expect(c.add(a).mul(2).btc).toEqual('-0.16')
})

it('usd convertions', function() {
  const a = Coin.fromSat('12', 2)
  expect(a.usd(0.2, 5)).toEqual('0.024')
  expect(Coin.fromUsd('0.024', 2, '0.2', 2).btc).toEqual('0.12')
})
