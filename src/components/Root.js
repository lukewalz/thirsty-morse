import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from '../App'
import Dashboard from '../Dashboard'
import Auth from '../Auth'

const Root = ({ store }) => (
    <Provider store={store}>
        <Router>
            <Route path='/' component={Auth} />
            <Route path='/sports' component={Dashboard} />
            <Route path='/games/:sport/:week?' component={App} />
        </Router>
    </Provider>
)

Root.propTypes = {
    store: PropTypes.object.isRequired
}

export default Root