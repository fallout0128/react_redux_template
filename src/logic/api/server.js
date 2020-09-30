import axios from 'axios'
import { consts } from '../../config'

function fetchData() {
  return new Promise(
    (res, rej) => setTimeout(
      function() { res('Redux works fine') }, consts.DATA_FETCH_TIME_MSEC)
  )  
}

export default {
  fetchData
}