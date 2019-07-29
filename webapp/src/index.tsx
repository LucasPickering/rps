import axios from 'axios'; // tslint:disable-line match-default-export-name
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import './index.css';
import * as serviceWorker from './serviceWorker';

// axios setup to cooperate with Django's CSRF policy
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
