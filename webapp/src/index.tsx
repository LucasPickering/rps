import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faHandRock,
  faHandPaper,
  faHandScissors,
  faHandLizard,
  faHandSpock,
} from '@fortawesome/free-solid-svg-icons';

import './index.css';
import * as serviceWorker from './serviceWorker';

// axios setup to cooperate with Django's CSRF policy
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';

library.add(faHandRock, faHandPaper, faHandScissors, faHandLizard, faHandSpock);

// if (process.env.NODE_ENV !== 'production') {
//   const whyDidYouRender = require('@welldone-software/why-did-you-render');
//   whyDidYouRender(React);
// }

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
