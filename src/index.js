import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import configureStore from './redux/configureStore'
import 'bootstrap/dist/css/bootstrap.css';
import Account from './Account';
import Root from './components/Root'
import { Auth0Provider } from "@auth0/auth0-react";


const store = configureStore()

render(
  <Auth0Provider
    domain="dev-jfq2-p9y.us.auth0.com"
    clientId="24lGQxVcOu2BnzeGkaSMgOeDTzhjh4QM"
    redirectUri={window.location.origin}
    audience="https://dev-jfq2-p9y.us.auth0.com/api/v2/"
    scope="read:current_user update:current_user_metadata"
  >
    <Root store={store} />
  </Auth0Provider>
  ,
  document.getElementById('root')
)
