import React from 'react';
import './code-example.scss';

const propTypes = {
  language: React.PropTypes.string,
  code: React.PropTypes.string,
};

const defaultPropTypes = {
  language: 'javascript',
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
    if (this.refs.pre) {
      window.hljs.highlightBlock(this.refs.pre);
    }
  }

  render() {
    const { language, code } = this.props;
    const { expanded } = this.state;

    if (!expanded) {
      return (
        <div className="code-example collapsed" onClick={this.handleExpand}>
          Show Code
        </div>
      );
    }

    return (
      <div className="code-example expanded">
        <h4 onClick={this.handleCollapse}>Code</h4>
        <pre ref="pre"><code className={language}>{code}</code></pre>
      </div>
    );
  }
}

CodeExample.propTypes = propTypes;
CodeExample.defaultPropTypes = defaultPropTypes;


export default CodeExample;
