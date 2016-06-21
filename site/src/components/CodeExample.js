import React from 'react';
import classNames from 'classnames';

import './code-example.scss';

const propTypes = {
  language: React.PropTypes.string,
  code: React.PropTypes.string,
  previewStart: React.PropTypes.number,
  previewLength: React.PropTypes.number,
};

const defaultProps = {
  language: 'javascript',
  previewStart: 8,
  previewLength: 8,
};

class CodeExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };

    this.handleExpand = this.handleExpand.bind(this);
    this.handleCollapse = this.handleCollapse.bind(this);
  }

  componentDidMount() {
    this.syntaxHighlight();
  }

  componentDidUpdate() {
    this.syntaxHighlight();
  }

  handleExpand() {
    this.setState({
      expanded: true,
    });
  }

  handleCollapse() {
    this.setState({
      expanded: false,
    });
  }

  // assumes hljs is in the window
  syntaxHighlight() {
    if (this.refs.prePreview) {
      window.hljs.highlightBlock(this.refs.prePreview);
    }
    if (this.refs.preFull) {
      window.hljs.highlightBlock(this.refs.preFull);
    }
  }

  renderCollapsed() {
    const { language, code, previewStart, previewLength } = this.props;

    const codeLines = code.split('\n');
    let previewCode;

    if (codeLines.length > previewLength) {
      previewCode = codeLines
        .slice(previewStart, previewStart + previewLength)
        .concat(['...'])
        .join('\n');
    } else {
      previewCode = code;
    }

    return (
      <div className="preview-block">
        <pre className="preview-code" ref="prePreview">
          <code className={language}>{previewCode}</code>
        </pre>
        <div className="code-toggle-control" onClick={this.handleExpand}>Show All Code</div>
      </div>
    );
  }

  renderExpanded() {
    const { language, code } = this.props;
    return (
      <div className="expanded-block">
        <pre className="expanded-code" ref="preFull">
          <code className={language}>{code}</code>
        </pre>
        <div className="code-toggle-control" onClick={this.handleCollapse}>Hide Code</div>
      </div>
    );
  }

  render() {
    const { expanded } = this.state;

    // note need to render both to get highlighting to work with hljs, but only show one
    // (both = collapsed and expanded)

    return (
      <div className={classNames('code-example', { expanded, collapsed: !expanded })}>
        <h4>Code</h4>
        {this.renderCollapsed()}
        {this.renderExpanded()}
      </div>
    );
  }
}

CodeExample.propTypes = propTypes;
CodeExample.defaultProps = defaultProps;


export default CodeExample;
