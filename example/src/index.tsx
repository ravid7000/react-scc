import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from './Provider';

ReactDOM.render(
  <React.StrictMode>
    <Provider value={{ counter: 0 }}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

