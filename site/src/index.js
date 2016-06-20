import React from 'react';
import { render } from 'react-dom';

import SimpleExample from './components/SimpleExample';

import './site.scss';
import 'react-taco-table/style/taco-table.scss';

// add in performance tooling in dev
if (process.env.NODE_ENV !== 'production') {
  window.Perf = require('react-addons-perf');
}

render(<SimpleExample />, document.getElementById('react-root'));
