const React = require('react')
const ReactDOM = require('react-dom')
const A11yDialog = require('a11y-dialog')
const PropTypes = require('prop-types')

class Dialog extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isMounted: false,
      node: null
    }

    this.initDialog = this.initDialog.bind(this)
    this.close = this.close.bind(this)
    this.handleRef = this.handleRef.bind(this)
  }

  componentDidMount () {
    this.setState({ isMounted: true })
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.node !== this.state.node && this.state.node) {
      this.dialog = this.dialog || this.initDialog()
      this.props.dialogRef(this.dialog)
    }
  }

  componentWillUnmount () {
    this.dialog.destroy()
    this.props.dialogRef(undefined)
  }

  initDialog () {
    return new A11yDialog(this.state.node, this.props.appRoot)
  }

  close () {
    this.dialog.hide()
  }

  handleRef (node) {
    this.setState({ node: node })
  }

  render () {
    if (!this.state.isMounted) {
      return null
    }

    const { id, classNames } = this.props
    const titleId = this.props.titleId || (id + '-title')

    return ReactDOM.createPortal(
      <div
        id={id}
        className={classNames.base}
        ref={this.handleRef}>

        <div
          tabIndex='-1'
          className={classNames.overlay}
          onClick={this.close} />

        <div
          role='dialog'
          className={classNames.element}
          aria-labelledby={titleId}>

          <div
            role='document'
            className={classNames.document}>

            <button
              type='button'
              aria-label={this.props.closeButtonLabel}
              onClick={this.close}
              className={classNames.closeButton}>
              {this.props.closeButtonContent}
            </button>

            <h1
              id={titleId}
              className={classNames.title}>
              {this.props.title}
            </h1>

            {this.props.children}

          </div>

        </div>

      </div>,
      document.querySelector(this.props.dialogRoot)
    )
  }
}

Dialog.defaultProps = {
  closeButtonLabel: 'Close this dialog window',
  closeButtonContent: '\u00D7',
  initiallyHidden: true,
  classNames: {},
  dialogRef: () => void 0
  // Default properties cannot be based on other properties, so the default
  // value for the `titleId` prop is defined in the `render(..)` method.
}

Dialog.propTypes = {
  // The HTML `id` attribute of the dialog element, internally used by
  // a11y-dialog to manipulate the dialog.
  id: PropTypes.string.isRequired,

  // The title of the dialog, mandatory in the document to provide context to
  // assistive technology. Could be hidden (while remaining accessible) with
  // CSS though.
  title: PropTypes.string.isRequired,

  // A function called when the component has mounted, receiving the instance
  // of A11yDialog so that it can be programmatically accessed later on.
  // E.g.: dialogRef={(dialog) => (this.dialog = dialog)}
  dialogRef: PropTypes.func,

  // The HTML `id` attribute of the dialog’s title element, used by assistive
  // technologies to provide context and meaning to the dialog window. Falls
  // back to the `${this.props.id}-title` if not provided.
  titleId: PropTypes.string,

  // The HTML `aria-label` attribute of the close button, used by assistive
  // technologies to provide extra meaning to the usual cross-mark. Defaults
  // to a generic English explanation.
  closeButtonLabel: PropTypes.string,

  // The string that is the innerHTML of the close button.
  closeButtonContent: PropTypes.string,

  // a11y-dialog needs one or more “targets” to disable when the dialog is open.
  // This prop can be one or more selector which will be passed to a11y-dialog
  // constructor.
  appRoot: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired,

  // React 16 requires a container for the portal’s content to be rendered
  // into; this is required and needs to be an existing valid DOM node,
  // adjacent to the React root container of the application.
  dialogRoot: PropTypes.string.isRequired,

  // When rendering the component for the first time, the dialog has not been
  // initialised yet and there is no way to figure whether the dialog should
  // be open or closed on load. This sets the initial value for the
  // `aria-hidden` attribute and defaults to `true` when omitted.
  initiallyHidden: PropTypes.bool,

  // Object of classes for each HTML element of the dialog element. Keys are:
  // - base
  // - overlay
  // - element
  // - document
  // - title
  // - closeButton
  // See for reference: http://edenspiekermann.github.io/a11y-dialog/#expected-dom-structure
  classNames: PropTypes.objectOf(PropTypes.string)
}

module.exports = Dialog
