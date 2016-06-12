import './assets/scss/base.scss'
import './assets/scss/font-awesome/_font-awesome.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRedirect, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'

import List from './containers/List'
import Editor from './containers/Editor'
import createStore from './store'

const store = createStore()
const history = syncHistoryWithStore(hashHistory, store)

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/">
                <IndexRedirect to="list"/>
                <Route path="list" component={List}/>
                <Route path="edit">
                        <IndexRedirect to="new"/>
                        <Route path=":id" component={Editor}/>
                </Route>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
)
