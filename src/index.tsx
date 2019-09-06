import React from 'react'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducers from './reducers'
import Main from './components/Main'
// @ts-ignore
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler'
import checkErrorMiddleware from './utility/checkErrorMiddleware';

setJSExceptionHandler((error: Error, isFatal: boolean) => {
  // This is your custom global error handler
  // You do stuff like show an error dialog
  // or hit google analytics to track crashes
  // or hit a custom api to inform the dev team.
})
setNativeExceptionHandler((exceptionString: string) => {
  // This is your custom global error handler
  // You do stuff likehit google analytics to track crashes.
  // or hit a custom api to inform the dev team.
  //NOTE: alert or showing any UI change via JS
  //WILL NOT WORK in case of NATIVE ERRORS.
})

if (__DEV__) {
  var immutable = require('immutable')
  var installDevTools = require('immutable-devtools');
  installDevTools(immutable);
}

const loggerMiddleware = createLogger()

const middleware = applyMiddleware(thunkMiddleware, loggerMiddleware,checkErrorMiddleware)

const store = createStore(reducers, middleware)

class App extends React.PureComponent {
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    )
  }
}

export default App