import React from 'react'
import ReactDOM from 'react-dom'
import A11yDialogLib from 'a11y-dialog'
import PropTypes from 'prop-types'

const useIsMounted = () => {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => setIsMounted(true), [])

  return isMounted
}

const useA11yDialogInstance = appRoot => {
  const [instance, setInstance] = React.useState(null)
  const container = React.useCallback(
    node => {
      if (node !== null) setInstance(new A11yDialogLib(node, appRoot))
    },
    [appRoot]
  )

  return [instance, container]
}

export const useA11yDialog = props => {
  const [instance, ref] = useA11yDialogInstance(props.appRoot)
  const close = React.useCallback(() => instance.hide(), [instance])
  const role = props.role || 'dialog'
  const isAlertDialog = role === 'alertdialog'
  const titleId = props.titleId || props.id + '-title'

  // Destroy the `a11y-dialog` instance when unmounting the component.
  React.useEffect(() => {
    return () => {
      if (instance) instance.destroy()
    }
  }, [instance])

  return [
    instance,
    {
      container: { id: props.id, ref, 'aria-hidden': true },
      overlay: { tabIndex: -1, onClick: isAlertDialog ? undefined : close },
      dialog: { role, 'aria-labelledby': titleId },
      inner: { role: isAlertDialog ? undefined : 'document' },
      closeButton: { type: 'button', onClick: close },
      // Using a paragraph with accessibility mapping can be useful to work
      // around SEO concerns of having multiple <h1> per page.
      // See: https://twitter.com/goetsu/status/1261253532315004930
      title: { role: 'heading', 'aria-level': 1, id: titleId },
    },
  ]
}

export const A11yDialog = props => {
  const isMounted = useIsMounted()
  const [instance, attributes] = useA11yDialog(props)
  const { dialogRef } = props

  React.useEffect(() => {
    if (instance) dialogRef(instance)
    return () => dialogRef(undefined)
  }, [dialogRef, instance])

  if (!isMounted) return null

  const Element = props.useDialogElement ? 'dialog' : 'div'
  const title = (
    <p {...attributes.title} className={props.classNames.title} key='title'>
      {props.title}
    </p>
  )
  const button = (
    <button
      {...attributes.closeButton}
      className={props.classNames.closeButton}
      aria-label={props.closeButtonLabel}
      key='button'
    >
      {props.closeButtonContent}
    </button>
  )
  const children = [
    props.closeButtonPosition === 'first' && button,
    title,
    props.children,
    props.closeButtonPosition === 'last' && button,
  ].filter(Boolean)

  return ReactDOM.createPortal(
    <div {...attributes.container} className={props.classNames.container}>
      <div {...attributes.overlay} className={props.classNames.overlay} />
      <Element {...attributes.dialog} className={props.classNames.dialog}>
        <div {...attributes.inner} className={props.classNames.inner}>
          {children}
        </div>
      </Element>
    </div>,
    document.querySelector(props.dialogRoot)
  )
}

A11yDialog.defaultProps = {
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

A11yDialog.propTypes = {
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
  title: PropTypes.node.isRequired,

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
  closeButtonContent: PropTypes.node,

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

  // Object of classes for each HTML element of the dialog element.
  // See: http://edenspiekermann.github.io/a11y-dialog/#expected-dom-structure
  classNames: PropTypes.exact({
    container: PropTypes.string,
    overlay: PropTypes.string,
    dialog: PropTypes.string,
    inner: PropTypes.string,
    title: PropTypes.string,
    closeButton: PropTypes.string,
  }),

  // Whether to render a `<dialog>` element or a `<div>` element.
  useDialogElement: function (props, propName, componentName) {
    if (props[propName] && props.role === 'alertdialog') {
      return new Error(
        "Invalid props combination `useDialogElement={true}` and `role='alertdialog'`. The native <dialog> HTML element is not compatible with the modal behaviour implied by the `alertdialog` role. If you want a modal, turn off `useDialogElement`. If you insist on using the native <dialog> HTML element, use a regular dialog (with `role='alert'`)."
      )
    }

    PropTypes.checkPropTypes(
      { [propName]: PropTypes.bool },
      { [propName]: props[propName] },
      propName,
      componentName
    )
  },

  // Dialog content.
  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  children: PropTypes.node,
}
