import React from 'react';
import { render } from 'react-dom';
import CodeExample from '../components/CodeExample';

import ExampleFormatters from '../components/ExampleFormatters';
import exampleFormattersCode from '!raw!../components/ExampleFormatters';

import ExampleSortConfig from '../components/ExampleSortConfig';
import exampleSortConfigCode from '!raw!../components/ExampleSortConfig';

import ExampleRowClassName from '../components/ExampleRowClassName';
import exampleRowClassNameCode from '!raw!../components/ExampleRowClassName';

import ExampleColumnGroups from '../components/ExampleColumnGroups';
import exampleColumnGroupsCode from '!raw!../components/ExampleColumnGroups';

import ExampleColumnGroupsNoHeader from '../components/ExampleColumnGroupsNoHeader';
import exampleColumnGroupsNoHeaderCode from '!raw!../components/ExampleColumnGroupsNoHeader';

import ExampleClassName from '../components/ExampleClassName';
import exampleClassNameCode from '!raw!../components/ExampleClassName';


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

const githubRoot = 'https://github.com/pbeshai/react-taco-table/blob/master/site/src/components';

const examples = [
  {
    id: 'example-formatters',
    label: 'Using built-in formatters',
    description: `This example demonstrates a few of the built-in formatters
      that come with React Taco Table.`,
    component: ExampleFormatters,
    code: exampleFormattersCode,
    github: `${githubRoot}/ExampleFormatters.js`,
    previewCodeStart: 8,
  },
  {
    id: 'example-sort',
    label: 'Sorting configuration',
    description: `This example shows how to configure initial sorts on the
      table and for the first time a column is sorted on click.`,
    component: ExampleSortConfig,
    code: exampleSortConfigCode,
    github: `${githubRoot}/ExampleSortConfig.js`,
    previewCodeStart: 36,
  },
  {
    id: 'example-row-class-name',
    label: 'Row class names',
    description: `This example shows how to add class names to rows based on the data.
      Here all rows with MLL3 equal to MUT are colored.`,
    component: ExampleRowClassName,
    code: exampleRowClassNameCode,
    github: `${githubRoot}/ExampleRowClassName.js`,
    previewCodeStart: 48,
    previewCodeLength: 7,
  },
  {
    id: 'example-column-groups',
    label: 'Column groups',
    description:
      <span>
        This example demonstrates how to use column groups with headers. The default styling
        adds in vertical lines between column groups. Here, the first group also gets the class
        <code>my-group</code> added to each <code>&lt;td&gt;</code> and <code>&lt;th&gt;</code>.
      </span>,
    component: ExampleColumnGroups,
    code: exampleColumnGroupsCode,
    github: `${githubRoot}/ExampleColumnGroups.js`,
    previewCodeStart: 48,
    previewCodeLength: 4,
  },
  {
    id: 'example-column-groups-no-header',
    label: 'Column groups without headers',
    description: `This example demonstrates how to use column groups without headers,
      which is an easy way to get vertical lines between groups of columns.`,
    component: ExampleColumnGroupsNoHeader,
    code: exampleColumnGroupsNoHeaderCode,
    github: `${githubRoot}/ExampleColumnGroupsNoHeader.js`,
    previewCodeStart: 46,
    previewCodeLength: 4,
  },
  {
    id: 'example-class-name',
    label: 'Cell class names',
    description: `This example shows how to configure class names for columns,
      as well as how to have them vary depending on the data in the cells.`,
    component: ExampleClassName,
    code: exampleClassNameCode,
    github: `${githubRoot}/ExampleClassName.js`,
    previewCodeStart: 27,
    previewCodeLength: 13,
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
