import React, { useState, useEffect } from 'react'
import { useRequest } from '../hooks'
import { format } from '../logic/utils'

const protectedToken = 'kH6BbieWzvwDQriW+nS6++CVkKdqwXDEGe90nq7PiZeIEFk6d2oHRR5xQt50/m2ZwTyo3VlDZKPQBIyVPrwiFfqdUgrcnNOdi1xkJKY5sUu9JyY2VtMpAUCPYBW235FUA177SrSVSiD1DrW4YG9bl9Kou/Oes/sfHcmF9db6Fp5YxDuFwhLbdY+Ul7/TCdV2IcUqSBOL51PLC8e/3dmdpw=='

export default function({ }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const { errors, doRequest } = useRequest({
    url: 'https://www.bitfi.com/exchange/history',
    body: {
      authToken: protectedToken
    },
    method: 'post',
    onSuccess: (arr) => {
      console.log(arr)

      setHistory(arr)
    }
  })

  useEffect(async function () {
    try {
      setLoading(true)
      await doRequest()
      setLoading(false)
    }
    catch (err) {
      console.log(err)
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="text-center">
        ...loading
      </div>
    )
  }
/*
  amountExpectedTo: "0.18503567"
amountSent: "1.26502658"
changellyID: "dvw9smlpvl81pq4i"
contractFrom: null
contractTo: null
fixedRate: false
fromSymbol: "ltc"
networkFrom: "ltc"
networkTo: "eth"
noxSwapID: "57e3a7d2-1a9a-429b-90a6-687475df8504"
payinAddress: "LhFnZXvYqA9aNe5eB8f3nBjCj6r8fntYKW"
payoutAddress: "0xa5740822D16E7e15912417850e1A123Be971D46C"
toSymbol: "eth"
tracking: "https:
*/
  return (
    <div>
      <h3>History</h3>
      <table className="table">
        <thead>
          <th>sent</th>
          <th>received</th>
          <th>swap</th>
          <th>link</th>
        </thead>
        <tbody>
          {history.map(v => 
            <tr>
              <th>{v.amountSent}</th>
              <th>{v.amountExpectedTo}</th>
              <th>{`${v.networkFrom} -> ${v.networkTo}`}</th>
              <th><a href={v.tracking} target="_blank">details</a></th>
            </tr>
          )}
        </tbody>
      </table>
      {errors}
    </div>
  )
}