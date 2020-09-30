import {
  FETCH_DATA,
  SET_DATA
} from './types'

const DATA_DEFAULT = {
  loading: false
}

function data(state = DATA_DEFAULT, action) {
  switch (action.type) {
    case FETCH_DATA:
      return {
        ...state,
        loading: true
      }
    case SET_DATA:
      return {
        ...state,
        loading: false,
        data: action.data
      }
    default:
      return state
  }
}

export default {
  data
}