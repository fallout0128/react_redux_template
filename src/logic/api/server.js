import axios from 'axios'

function fetchData() {
  return new Promise(
    (res, rej) => setTimeout(
      function() { res('Redux works fine') }, 2000)
  )  
}

export default {
  fetchData
}