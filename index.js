var React = require('react')
var ReactDOM = require('react-dom')
var A11yDialog = require('a11y-dialog')

var Dialog = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    exposeDialog: React.PropTypes.func.isRequired,
    closeButtonLabel: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      closeButtonLabel: 'Close this dialog window'
    };
  },

  getInitialState: function () {
    return { isOpen: false }
  },

  componentDidMount: function () {
    this.dialog = this.initDialog()
    this.props.exposeDialog(this.dialog)
  },

  componentWillUnmount: function () {
    this.dialog.destroy()
  },

  initDialog: function () {
    const node = ReactDOM.findDOMNode(this)
    node.parentNode.removeChild(node)
    document.body.appendChild(node)

    return new A11yDialog(node)
  },

  close: function () {
    this.dialog.hide()
  },

  render: function () {
    const { children, closeButtonLabel, id, title } = this.props
    const titleId = id + '-title'

    return (
      <div id={id} aria-hidden>
        <div tabIndex='-1' onClick={this.close} />

        <div role='dialog' aria-labelledby={titleId}>
          <div role='document'>
            <h1 id={titleId} tabIndex='0'>
              {title}
            </h1>

            {children}

            <button
              type='button'
              aria-label={closeButtonLabel}
              onClick={this.close}>
              &times;
            </button>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = Dialog
