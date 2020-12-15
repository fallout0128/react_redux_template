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
    onSuccess: h => {
      setHistory(h)
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