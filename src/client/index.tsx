import 'core-js/stable'

import * as React from 'react'
import * as ReactDOMClient from 'react-dom/client'
import './styles/stylesheet.css'

import App from './app'

const container = document.getElementById('root') as Element



// Create a root.
const root = ReactDOMClient.createRoot(container)


root.render(<App />)
