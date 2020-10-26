import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from '../App'
import Account from '../Account'
import Dashboard from '../Dashboard'

const Root = ({ store }) => (
    <Provider store={store}>
        <Router>
            <Route path='/' component={Dashboard} />
            <Route path='/games/:sport/:week?' component={App} />
        </Router>
    </Provider>
)

Root.propTypes = {
    store: PropTypes.object.isRequired
}

export default Root