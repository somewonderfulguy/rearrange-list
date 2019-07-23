import React from 'react'
import ReactDOM from 'react-dom'
import {DndProvider} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import App from './components/App'
import * as serviceWorker from './services/serviceWorker'
import './index.css'

const Node = () => (
  <DndProvider backend={HTML5Backend}>
  	<App />
  </DndProvider>
)

ReactDOM.render(<Node />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()