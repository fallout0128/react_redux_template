import {
  FETCH_DATA,
  SET_DATA
} from './types'

function fetchData() {
  return {
    type: FETCH_DATA
  }
}

function setData(data) {
  return {
    type: SET_DATA,
    data
  }
}

export default {
  fetchData,
  setData
}