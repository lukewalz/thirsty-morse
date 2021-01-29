import { applyMiddleware, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'
import { composeWithDevTools } from 'redux-devtools-extension';
import * as Sentry from "@sentry/react";


const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  // Optionally pass options
});

export default function configureStore(preloadedState) {
  const middlewares = [thunkMiddleware]
  const middlewareEnhancer = composeWithDevTools(applyMiddleware(...middlewares), sentryReduxEnhancer)

  const enhancers = [middlewareEnhancer]
  const composedEnhancers = compose(...enhancers)

  const store = createStore(rootReducer, preloadedState, composedEnhancers)

  return store
}