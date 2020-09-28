import React from 'react'
import { 
  BrowserRouter, 
  Switch, 
  Route, 
  withRouter 
} from 'react-router-dom'
import { ScrollToTop } from './logic/helpers'
import { Page, App } from './containers'

export default class Routes extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <ScrollToTop>
          <Switch>
            <Route path="/login" component={Page} />
            <Route path="/" component={App} />
          </Switch>
        </ScrollToTop>
      </BrowserRouter>
    )
  }
}

