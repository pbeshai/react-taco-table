import React from 'react';
import { render } from 'react-dom';
import Example1 from '../components/Example1';

import '../site.scss';
import 'react-taco-table/style/taco-table.scss';

// add in performance tooling in dev
if (process.env.NODE_ENV !== 'production') {
  window.Perf = require('react-addons-perf');
}

class Main extends React.Component {
  render() {
    return (
      <div>
        <h3>Example 1</h3>
        <Example1 />
      </div>
    );
  }
}

render(<Main />, document.getElementById('react-root'));
