var React = require('react')
var A11yDialog = require('a11y-dialog')

var Dialog = React.createClass({
  propTypes: {
    // The HTML `id` attribute of the dialog element, internally used by
    // a11y-dialog to manipulate the dialog.
    id: React.PropTypes.string.isRequired,

    // The title of the dialog, mandatory in the document to provide context to
    // assistive technology. Could be hidden (while remaining accessible) with
    // CSS though.
    title: React.PropTypes.string.isRequired,

    // A function called when the component has mounted, receiving the instance
    // of A11yDialog so that it can be programmatically accessed later on.
    // E.g.: dialogRef={(dialog) => (this.dialog = dialog)}
    dialogRef: React.PropTypes.func.isRequired,

    // The HTML `id` attribute of the dialog’s title element, used by assistive
    // technologies to provide context and meaning to the dialog window. Falls
    // back to the `${this.props.id}-title` if not provided.
    titleId: React.PropTypes.string,

    // The HTML `aria-label` attribute of the close button, used by assistive
    // technologies to provide extra meaning to the usual cross-mark. Defaults
    // to a generic English explanation.
    closeButtonLabel: React.PropTypes.string,

    // a11y-dialog relies on the fact that the application main container has
    // its HTML `id` attribute set to `main`. This assumption can be defied by
    // passing a selector used to access the main container.
    rootSelector: React.PropTypes.string,

    // When rendering the component for the first time, the dialog has not been
    // initialised yet and there is no way to figure whether the dialog should
    // be open or closed on load. This sets the initial value for the
    // `aria-hidden` attribute and defaults to `true` when omitted.
    initiallyHidden: React.PropTypes.bool,

    // Object of classes for each HTML element of the dialog element. Keys are:
    // - base
    // - overlay
    // - element
    // - title
    // - closeButton
    // See for reference: https://github.com/edenspiekermann/a11y-dialog#html
    classNames: React.PropTypes.objectOf(React.PropTypes.string)
  },

  getDefaultProps: function () {
    return {
      closeButtonLabel: 'Close this dialog window',
      rootSelector: '#main',
      initiallyHidden: true,
      classNames: {}
      // Default properties cannot be based on other properties, so the default
      // value for the `titleId` prop is defined in the `render(..)` method.
    }
  },

  componentDidMount: function () {
    this.dialog = this.dialog || this.initDialog()
    this.props.dialogRef(this.dialog)
  },

  componentWillUnmount: function () {
    this.dialog.destroy()
    this.moveNodeBack()
    this.props.dialogRef(undefined)
  },

  moveNodeBack: function () {
    if (this.mainContainer) {
      this.mainContainer.parentNode.removeChild(this.node)
      this.ancestor.appendChild(this.node)
    }
  },

  moveNode: function () {
    // The dialog element should not live in the application main container but
    // next to it so that the focus can be correctly toggled between these two.
    // Because of the componentised approach in React, it is quite unpractical
    // to render a root next to the top level element. Thus we move the dialog
    // with the DOM API once the component has been successfully mounted.
    if (this.mainContainer) {
      this.ancestor.removeChild(this.node)
      this.mainContainer.parentNode.appendChild(this.node)
    }
  },

  initDialog: function () {
    this.mainContainer = document.querySelector(this.props.rootSelector)
    this.ancestor = this.node.parentNode

    this.moveNode()

    return new A11yDialog(this.node, this.mainContainer)
  },

  close: function () {
    this.dialog.hide()
  },

  isDialogShown: function () {
    return this.dialog ? this.dialog.shown : !this.props.initiallyHidden
  },

  handleRef: function (node) {
    this.node = node
  },

  render: function () {
    const id = this.props.id
    const classNames = this.props.classNames
    const titleId = this.props.titleId || (id + '-title')

    return (
      <div
        id={id}
        className={classNames.base}
        aria-hidden={!this.isDialogShown()}
        ref={this.handleRef}>

        <div
          tabIndex='-1'
          className={classNames.overlay}
          onClick={this.close} />

        <div
          role='dialog'
          className={classNames.element}
          aria-labelledby={titleId}>

          <div role='document'>

            <h1
              id={titleId}
              tabIndex='0'
              className={classNames.title}>
              {this.props.title}
            </h1>

            {this.props.children}

            <button
              type='button'
              aria-label={this.props.closeButtonLabel}
              onClick={this.close}
              className={classNames.closeButton}>
              &times;
            </button>

          </div>

        </div>

      </div>
    )
  }
})

module.exports = Dialog
