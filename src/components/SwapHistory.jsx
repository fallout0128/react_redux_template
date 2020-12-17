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
      <table  className="table table-responsive-sm">
        <thead>
          <th>swap</th>
          <th>sent</th>
          <th>received</th>
          <th>link</th>
        </thead>
        <tbody >
          {history.map(v => 
            <tr >
              <th>
                
                <div className="d-flex align-items-center">
                  {
                    v.fixedRate && 
                      <span class="material-icons icon mr-1 mb-1">
                        lock_open
                      </span>
                  }
                  
                  <small>{v.fromSymbol.toUpperCase()}</small>
                  <span class="material-icons icon open">
                    swap_vert
                  </span> 
                  <small>{v.toSymbol.toUpperCase()}</small>
                  
                </div>
              </th>
              <th style={{ fontWeight: '400'}}>{format.btc(v.amountSent, 6, '')}</th>
              <th style={{ fontWeight: '400'}}>{format.btc(v.amountExpectedTo, 6, '')}</th>
              
              <th style={{ fontWeight: '400'}}><a href={v.tracking} target="_blank">{v.changellyID.slice(0, 3)}...{v.changellyID.slice(-3)}</a></th>
            </tr>
          )}
        </tbody>
      </table>
      {errors}
    </div>
  )
}