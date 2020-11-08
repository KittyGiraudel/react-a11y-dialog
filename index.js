const React = require('react')
const ReactDOM = require('react-dom')
const A11yDialog = require('a11y-dialog')
const PropTypes = require('prop-types')

const useIsMounted = () => {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => setIsMounted(true), [])

  return isMounted
}

const useDialogInstance = ({ dialogRef, appRoot }) => {
  const instance = React.useRef(null)
  const container = React.useCallback(
    node => {
      if (node !== null) {
        instance.current = new A11yDialog(node, appRoot)
        dialogRef(instance.current)
      }
    },
    [dialogRef, appRoot]
  )

  return { container, instance }
}

const CloseButton = props => {
  return (
    <button
      type='button'
      aria-label={props.closeButtonLabel}
      onClick={props.onClose}
      className={props.classNames.closeButton}
    >
      {props.closeButtonContent}
    </button>
  )
}

const Heading = props => {
  /**
   * Using a paragraph with accessibility mapping to work around SEO
   * concerns of having multiple <h1> per page.
   * See: https://twitter.com/goetsu/status/1261253532315004930
   */
  return (
    <p
      id={props.titleId}
      className={props.classNames.title}
      role='heading'
      aria-level='1'
    >
      {props.title}
    </p>
  )
}

const Dialog = props => {
  const isMounted = useIsMounted()
  const { dialogRef } = props
  const { container, instance } = useDialogInstance(props)

  React.useEffect(() => {
    const dialogInstance = instance.current

    return () => {
      if (dialogInstance) dialogInstance.destroy()
      dialogRef(undefined)
    }
  }, [dialogRef, instance])

  const close = React.useCallback(() => instance.current.hide(), [instance])

  if (!isMounted) return null

  const { id, classNames } = props
  const titleId = props.titleId || id + '-title'
  const Element = props.useDialog ? 'dialog' : 'div'
  const getChildOrder = () => {
    if (props.closeButtonPosition === 'first') {
      return (
        <React.Fragment>
          <CloseButton onClose={close} {...props} />
          <Heading titleId={titleId} {...props} />
          {props.children}
        </React.Fragment>
      )
    } else if (props.closeButtonPosition === 'last') {
      return (
        <React.Fragment>
          <Heading titleId={titleId} {...props} />
          {props.children}
          <CloseButton onClose={close} {...props} />
        </React.Fragment>
      )
    } else if (props.closeButtonPosition === 'none') {
      return (
        <React.Fragment>
          <Heading titleId={titleId} {...props} />
          {props.children}
        </React.Fragment>
      )
    }
  }

  return ReactDOM.createPortal(
    <div id={id} className={classNames.base} ref={container}>
      <div
        tabIndex='-1'
        className={classNames.overlay}
        onClick={props.role === 'alertdialog' ? undefined : close}
      />

      <Element
        role={props.role}
        className={classNames.element}
        aria-labelledby={titleId}
      >
        <div
          role={props.useDialogElement ? undefined : 'document'}
          className={classNames.document}
        >
          {getChildOrder()}
        </div>
      </Element>
    </div>,
    document.querySelector(props.dialogRoot)
  )
}

Dialog.defaultProps = {
  role: 'dialog',
  closeButtonLabel: 'Close this dialog window',
  closeButtonContent: '\u00D7',
  closeButtonPosition: 'first',
  classNames: {},
  dialogRef: () => void 0,
  useDialogElement: false,
  // Default properties cannot be based on other properties, so the default
  // value for the `titleId` prop is defined in the `render(..)` method.
}

Dialog.propTypes = {
  // The `role` attribute of the dialog element, either `dialog` (default) or
  // `alertdialog` to make it a modal (preventing closing on click outside of
  // ESC key).
  role: PropTypes.oneOf(['dialog', 'alertdialog']),

  // The HTML `id` attribute of the dialog element, internally used by
  // a11y-dialog to manipulate the dialog.
  id: PropTypes.string.isRequired,

  // The title of the dialog, mandatory in the document to provide context to
  // assistive technology. Could be hidden (while remaining accessible) with
  // CSS though.
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,

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
  closeButtonContent: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),

  // Whether the close button should be rendered as first/last children or not at all.
  closeButtonPosition: PropTypes.oneOf(['first', 'last', 'none']),

  // a11y-dialog needs one or more “targets” to disable when the dialog is open.
  // This prop can be one or more selector which will be passed to a11y-dialog
  // constructor.
  appRoot: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,

  // React 16 requires a container for the portal’s content to be rendered
  // into; this is required and needs to be an existing valid DOM node,
  // adjacent to the React root container of the application.
  dialogRoot: PropTypes.string.isRequired,

  // Object of classes for each HTML element of the dialog element. Keys are:
  // - base
  // - overlay
  // - element
  // - document
  // - title
  // - closeButton
  // See for reference: http://edenspiekermann.github.io/a11y-dialog/#expected-dom-structure
  classNames: PropTypes.objectOf(PropTypes.string),

  // Whether to render a `<dialog>` element or a `<div>` element.
  useDialogElement: PropTypes.bool,

  // Dialog content.
  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  children: PropTypes.node,
}

module.exports = Dialog
