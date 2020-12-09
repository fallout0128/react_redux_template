import { Coin } from '../../logic'

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
  expect(a.fiat(0.2, 5)).toEqual('0.024')
  expect(Coin.fromFiat('0.024', 2, '0.2', 2).btc).toEqual('0.12')
})

it('formats btc', function() {
  let a = Coin.fromSat('123456789', 8)
  expect(a.format('BTC')).toEqual('1.23456789 BTC')

  a = Coin.fromSat('123456789', 1)
  expect(a.format('BTC')).toEqual('12,345,678.9 BTC')

  a = Coin.fromSat('-123456789', 1)
  expect(a.format('BTC')).toEqual('-12,345,678.9 BTC')
})