var React = require('react')
var A11yDialog = require('a11y-dialog')

var Dialog = React.createClass({displayName: "Dialog",
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
    this.dialog = this.initDialog()
    this.props.dialogRef(this.dialog)
  },

  componentWillUnmount: function () {
    this.dialog.destroy()
    this.props.dialogRef()
  },

  initDialog: function () {
    const node = this.node
    const root = document.querySelector(this.props.rootSelector)

    // The dialog element should not live in the application main container but
    // next to it so that the focus can be correctly toggled between these two.
    // Because of the componentised approach in React, it is quite unpractical
    // to render a root next to the top level element. Thus we move the dialog
    // with the DOM API once the component has been successfully mounted.
    if (root) {
      node.parentNode.removeChild(node)
      root.parentNode.appendChild(node)
    }

    return new A11yDialog(node, root)
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
    const { children, classNames, closeButtonLabel, id, title } = this.props
    const titleId = this.props.titleId || (id + '-title')

    return (
      React.createElement("div", {
        id: id, 
        className: classNames.base, 
        "aria-hidden": !this.isDialogShown(), 
        ref: this.handleRef}, 

        React.createElement("div", {
          tabIndex: "-1", 
          className: classNames.overlay, 
          onClick: this.close}), 

        React.createElement("div", {
          role: "dialog", 
          className: classNames.element, 
          "aria-labelledby": titleId}, 

          React.createElement("div", {role: "document"}, 

            React.createElement("h1", {
              id: titleId, 
              tabIndex: "0", 
              className: classNames.title}, 
              title
            ), 

            children, 

            React.createElement("button", {
              type: "button", 
              "aria-label": closeButtonLabel, 
              onClick: this.close, 
              className: classNames.closeButton}, 
              "×"
            )

          )

        )

      )
    )
  }
})

module.exports = Dialog
