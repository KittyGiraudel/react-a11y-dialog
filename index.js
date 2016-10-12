var A11yDialog = require('a11y-dialog')

var Dialog = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    exposeDialog: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return { isOpen: false }
  },

  componentDidMount: function () {
    if (typeof window.A11yDialog === 'undefined') {
      return
    }

    this.initDialog()
    this.props.exposeDialog(this.dialog)
  },

  initDialog: function () {
    const node = ReactDOM.findDOMNode(this)
    node.parentNode.removeChild(node)
    document.body.appendChild(node)

    this.dialog = new window.A11yDialog(node)
  },

  close: function () {
    this.dialog.hide()
  },

  render: function () {
    const { children, id, title } = this.props
    const titleId = id + '-title'

    return (
      <div id={id} aria-hidden={true}>
        <div tabIndex="-1" onClick={this.close} />

        <div role="dialog" aria-labelledby={titleId}>
          <div role="document">
            <h1 id={titleId} tabIndex="0">
              {title}
            </h1>

            {children}

            <button type="button"
                    aria-label="Close this dialog window"
                    onClick={this.close}>
              &times;
            </button>
          </div>
        </div>
      </div>
    )
  }
})
