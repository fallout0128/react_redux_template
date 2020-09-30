import actions from './actions'
import { server } from '../logic/api'

function fetchData() {
  return async function(dispatch) {
    try {
      dispatch(actions.fetchData())     
      const data = await server.fetchData()
      dispatch(actions.setData(data))
    }
    catch (exc) {
      console.log(exc.toSring())
      dispatch(actions.setData(undefined))
    }
  }
}

export default {
  fetchData
}