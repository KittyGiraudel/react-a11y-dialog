import * as React from 'react'
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import A11yDialogLib from 'a11y-dialog'

const useIsMounted = () => {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => setIsMounted(true), [])

  return isMounted
}

export type ReactA11yDialogProps = {
  role?: 'dialog' | 'alertdialog'
  id: string
  title: React.ReactNode
  dialogRef?: (instance?: A11yDialogLib) => unknown
  dialogRoot?: string
  titleId?: string
  closeButtonLabel?: string
  closeButtonContent?: React.ReactNode
  closeButtonPosition?: 'first' | 'last' | 'none'
  classNames?: {
    container?: string
    overlay?: string
    dialog?: string
    title?: string
    closeButton?: string
  }
}
type Attributes = {
  container: React.HTMLAttributes<HTMLDivElement> & {
    ref: React.LegacyRef<HTMLDivElement>
  }
  overlay: React.HTMLAttributes<HTMLDivElement>
  dialog: React.HTMLAttributes<HTMLDivElement>
  closeButton: React.ButtonHTMLAttributes<HTMLButtonElement>
  title: React.HTMLAttributes<HTMLElement>
}

const useA11yDialogInstance = () => {
  const [instance, setInstance] = React.useState<A11yDialogLib | null>(null)
  const container = React.useCallback((node: HTMLElement) => {
    if (node !== null) setInstance(new A11yDialogLib(node))
  }, [])

  return [instance, container] as [
    A11yDialogLib | null,
    React.LegacyRef<HTMLDivElement>
  ]
}

export const useA11yDialog = (props: ReactA11yDialogProps) => {
  const [instance, ref] = useA11yDialogInstance()
  const close = React.useCallback(() => instance && instance.hide(), [instance])
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
      container: {
        id: props.id,
        ref,
        role,
        tabIndex: -1,
        'aria-modal': true,
        'aria-hidden': true,
        'aria-labelledby': titleId,
      },
      overlay: { onClick: isAlertDialog ? undefined : close },
      dialog: { role: 'document' },
      closeButton: { type: 'button', onClick: close },
      // Using a paragraph with accessibility mapping can be useful to work
      // around SEO concerns of having multiple <h1> per page.
      // See: https://twitter.com/goetsu/status/1261253532315004930
      title: { role: 'heading', 'aria-level': 1, id: titleId },
    },
  ] as [A11yDialogLib | null, Attributes]
}

export const A11yDialog: React.FC<
  React.PropsWithChildren<ReactA11yDialogProps>
> = props => {
  if (!props.classNames) props.classNames = {}
  if (!props.dialogRef) props.dialogRef = () => []
  const isMounted = useIsMounted()
  const [instance, attributes] = useA11yDialog(props)
  const { dialogRef } = props

  React.useEffect(() => {
    if (instance) dialogRef(instance)
    return () => {
      dialogRef(undefined)
    }
  }, [dialogRef, instance])

  if (!isMounted) return null

  const root = props.dialogRoot
    ? document.querySelector(props.dialogRoot)
    : document.body
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
      <div {...attributes.dialog} className={props.classNames.dialog}>
        {children}
      </div>
    </div>,
    root as HTMLElement
  )
}

A11yDialog.defaultProps = {
  role: 'dialog',
  closeButtonLabel: 'Close this dialog window',
  closeButtonContent: '\u00D7',
  closeButtonPosition: 'first',
  classNames: {},
  dialogRef: () => void 0,
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

  // React 16 requires a container for the portal’s content to be rendered
  // into; this needs to be an existing valid DOM node and defaults to the body
  // element.
  dialogRoot: PropTypes.string,

  // Object of classes for each HTML element of the dialog element.
  // See: https://a11y-dialog.netlify.app/usage/markup
  classNames: PropTypes.shape({
    container: PropTypes.string.isRequired,
    overlay: PropTypes.string.isRequired,
    dialog: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    closeButton: PropTypes.string.isRequired,
  }),

  // Dialog content.
  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  children: PropTypes.node,
}
