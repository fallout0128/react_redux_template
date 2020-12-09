import satoshi from '../satoshi'

it('can convert satoshi and vice versa', function() {
  expect(satoshi.to('1.23', 3).toString()).toEqual('1230')
  expect(satoshi.from('123', 3).toString()).toEqual('0.123')

  expect(satoshi.to('-1.23', 3).toString()).toEqual('-1230')
  expect(satoshi.from('-123', 3).toString()).toEqual('-0.123')
})
