import React from 'react'
import { 
  BrowserRouter, 
  Switch, 
  Route
} from 'react-router-dom'
import { Provider } from 'react-redux'
import { ScrollToTop } from './logic/helpers'
import { Page, Main } from './containers'
import { store } from './store'

export default class Routes extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ScrollToTop>
            <Switch>
              <Route path="/login" component={Page} />
              <Route path="/" component={Main} />
            </Switch>
          </ScrollToTop>
        </BrowserRouter>
      </Provider>
    )
  }
}

