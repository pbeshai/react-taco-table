import React from 'react';
import { render } from 'react-dom';
import CodeExample from '../components/CodeExample';

import ExampleFormatters from '../components/ExampleFormatters';
import exampleFormattersCode from '!raw!../components/ExampleFormatters';

import ExampleSortConfig from '../components/ExampleSortConfig';
import exampleSortConfigCode from '!raw!../components/ExampleSortConfig';

import ExampleRowClassName from '../components/ExampleRowClassName';
import exampleRowClassName from '!raw!../components/ExampleRowClassName';

import ExampleColumnGroups from '../components/ExampleColumnGroups';
import exampleColumnGroups from '!raw!../components/ExampleColumnGroups';


import '../site.scss';
import 'react-taco-table/style/taco-table.scss';

// add in performance tooling in dev
if (process.env.NODE_ENV !== 'production') {
  window.Perf = require('react-addons-perf');
}

/*
# Examples

- built in formatters
- initial sort column and direction, first sort
- row class names
- column groups, no headers
- column groups with headers

- class name by function and by string
- style by function and by object
- summarizer by function and by built-in
- heatmap via plugin
- heatmap highlight only via plugin
*/

const githubRoot = 'https://github.com/pbeshai/react-taco-table/blob/master/site/src/components/';

const examples = [
  {
    id: 'example-formatters',
    label: 'Using built-in formatters',
    description: `This example demonstrates a few of the built-in formatters
      that come with React Taco Table.`,
    component: ExampleFormatters,
    code: exampleFormattersCode,
    github: `${githubRoot}ExampleFormatters.js`,
    previewCodeStart: 8,
  },
  {
    id: 'example-sort',
    label: 'Sorting configuration',
    description: `This example shows how to configure initial sorts on the
      table and for the first time a column is sorted on click.`,
    component: ExampleSortConfig,
    code: exampleSortConfigCode,
    github: `${githubRoot}ExampleSortConfig.js`,
    previewCodeStart: 36,
  },
  {
    id: 'example-row-class-name',
    label: 'Row highlighting',
    description: `This example shows how to add class names to rows based on the data.
      Here all rows with MLL3 equal to MUT are colored.`,
    component: ExampleRowClassName,
    code: exampleRowClassName,
    github: `${githubRoot}ExampleRowClassName.js`,
    previewCodeStart: 48,
    previewCodeLength: 7,
  },
  {
    id: 'example-column-groups',
    label: 'Column groups',
    description: 'This example demonstrates how to use column groups with headers.',
    component: ExampleColumnGroups,
    code: exampleColumnGroups,
    github: `${githubRoot}ExampleColumnGroups.js`,
    previewCodeStart: 48,
    previewCodeLength: 4,
  },
];

class Main extends React.Component {
  renderExampleList() {
    return (
      <div>
        <h3>List of Examples</h3>
        <ul>
          {examples.map((example, i) => (
            <li key={i}>
              <a href={`#${example.id}`}>{example.label}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  renderExamples() {
    return (
      <div>
        {examples.map((example, i) => (
          <div className="example" key={i}>
            <a name={`${example.id}`} />
            <h3>
              {example.label}
            </h3>
            <p>
              {example.description}
              <a className="example-github-link" href={example.github}>
                Code on GitHub
              </a>
            </p>
            <example.component />
            <CodeExample
              language="javascript"
              code={example.code}
              previewStart={example.previewCodeStart}
              previewLength={example.previewCodeLength}
            />
          </div>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderExampleList()}
        {this.renderExamples()}
      </div>
    );
  }
}

render(<Main />, document.getElementById('react-root'));
