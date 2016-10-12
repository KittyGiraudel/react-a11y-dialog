var React = require('react')
var ReactDOM = require('react-dom')
var A11yDialog = require('a11y-dialog')

var Dialog = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    exposeDialog: React.PropTypes.func.isRequired,
    titleId: React.PropTypes.string,
    closeButtonLabel: React.PropTypes.string,
    rootSelector: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      closeButtonLabel: 'Close this dialog window',
      rootSelector: '#main'
      // Default properties cannot be based on other properties, so the default
      // value for the `titleId` prop is defined in the `render(..)` method.
    };
  },

  componentDidMount: function () {
    this.dialog = this.initDialog()
    this.props.exposeDialog(this.dialog)
  },

  componentWillUnmount: function () {
    this.dialog.destroy()
    this.props.exposeDialog()
  },

  initDialog: function () {
    const node = ReactDOM.findDOMNode(this)
    const root = document.querySelector(this.props.rootSelector)

    // The dialog element should not live in the application main container but
    // next to it so that the focus can be correctly toggled between these two.
    // Because of the componentised approach in React, it is quite unpractical
    // to render a root next to the top level element. Thus we move the dialog
    // with the DOM API once the component has been successfully mounted.
    node.parentNode.removeChild(node)
    root.parentNode.appendChild(node)

    return new A11yDialog(node, root)
  },

  close: function () {
    this.dialog.hide()
  },

  render: function () {
    const { children, closeButtonLabel, id, title } = this.props
    const titleId = this.props.titleId || (id + '-title')

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
