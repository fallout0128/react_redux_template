
import { combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { reducers } from './redux'

const rootReducer = combineReducers({
  form: formReducer,
  data: reducers.data
})

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
const REDUX_DEBUG_EXTENSION = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

const store = process.env.NODE_ENV === 'production'? 
  createStoreWithMiddleware(rootReducer) : createStoreWithMiddleware(rootReducer, REDUX_DEBUG_EXTENSION)

export {
  store
}