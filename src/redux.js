import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from './store/reducers/rootReducer'

export const history = createBrowserHistory()

const store = createStore(
    createRootReducer(history), // root reducer with router state
    compose(
        applyMiddleware(
            routerMiddleware(history), // for dispatching history actions
            // ... other middlewares ...
        ),
    ),
)

export default store
