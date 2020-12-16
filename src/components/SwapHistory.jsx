import React, { useState, useEffect } from 'react'
import { useRequest } from '../hooks'
import { format } from '../logic/utils'

const protectedToken = "98rBy8MS2Y/c6z1AeBix4mREMYewbmtXphnjMVrj4/KslOnwcu5h3umL6aZXaDzKQ74VbX9zspI7/1iHaGiGt62uLDKiSfYDV4fB4CfALRdYwcs3feJLHubnd9ubeWr/qZBVfHcVUEvKCtaBC/1RzaclexvOiSoUlh7Esk+b6xY="

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
      console.log(h)
      setHistory(h.reverse())
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
              <th>{`${v.fromSymbol} -> ${v.toSymbol}`}</th>
              <th><a href={v.tracking} target="_blank">details</a></th>
            </tr>
          )}
        </tbody>
      </table>
      {errors}
    </div>
  )
}