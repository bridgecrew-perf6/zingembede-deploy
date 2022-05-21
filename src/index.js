import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './containers/App';

import { Provider } from 'react-redux'
// import store from './redux'
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import userReducer from './store/reducers/userReducer'


let store = createStore(userReducer, applyMiddleware(thunk))

// let persistor = persistStore(storeRedux)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store} >
    <App />
  </Provider>
);


