import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from '../App'
import Dashboard from '../pages/HomePage'
import Auth from '../pages/Login'
import AuthRoute from './AuthRoute'
import NavBar from './Nav'

const Root = ({ store }) => (
    <Provider store={store}>
        <NavBar />
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