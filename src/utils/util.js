function getFloatDecimals(v) {
  const i = v.toString().indexOf('.')
  if (i === -1)
    return 0
  
  return v.toString().length - i - 1
}

export default {
  getFloatDecimals
}