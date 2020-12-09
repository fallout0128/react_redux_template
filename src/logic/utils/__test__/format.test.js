import format from '../format'

it('formats decimals', function() {
  expect(format.decimals('10.23333333', 4)).toEqual('10.2333')
  expect(format.decimals('-10.23333333', 4)).toEqual('-10.2333')
  expect(format.decimals('0.1234134135315315139999999', 18)).toEqual('0.123413413531531513')
  expect(format.decimals('12312413413413', 4)).toEqual('12312413413413')
})
