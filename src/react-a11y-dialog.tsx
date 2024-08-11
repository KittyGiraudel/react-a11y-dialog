import A11yDialogLib from 'a11y-dialog'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

// Re-export the `A11yDialogInstance` type for convenient typing of
// useRef/dialogRef.
export type { A11yDialogInstance } from 'a11y-dialog'

const useIsMounted = () => {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => setIsMounted(true), [])

  return isMounted
}

export type ReactA11yDialogProps = {
  /**
   * The `role` attribute of the dialog element, either `dialog` (default) or
   * `alertdialog` to make it a modal (preventing closing on click outside of
   * ESC key).
   */
  role?: 'dialog' | 'alertdialog'
  /**
   * The HTML `id` attribute of the dialog element, internally used by
   * a11y-dialog to manipulate the dialog.
   */
  id: string
  /**
   * The title of the dialog, mandatory in the document to provide context to
   * assistive technology. Could be hidden (while remaining accessible) with
   * CSS though.
   */
  title: React.ReactNode
  /**
   * A ref callback called when the component has mounted, receiving the instance
   * of A11yDialog so that it can be programmatically accessed later on.
   *
   * @example
   * const dialogRef = React.useRef();
   * // ...
   * dialogRef={(instance) => (dialogRef.current = instance)}
   */
  dialogRef?: (instance?: A11yDialogLib) => unknown
  /**
   * Container for the portal's content to be rendered into;
   * this needs to be an existing valid DOM node and default sto the body element.
   */
  dialogRoot?: string
  /**
   * The HTML `id` attribute of the dialog’s title element, used by assistive
   * technologies to provide context and meaning to the dialog window.
   *
   * Falls back to the `${props.id}-title` if not provided.
   */
  titleId?: string
  /**
   * The HTML `aria-label` attribute of the close button, used by assistive
   * technologies to provide extra meaning to the usual cross-mark.
   *
   * Defaults to a generic English explanation.
   */
  closeButtonLabel?: string
  /**
   * The string that is the innerHTML of the close button.
   */
  closeButtonContent?: React.ReactNode
  /**
   * Whether the close button should be rendered as first/last children or not at all.
   */
  closeButtonPosition?: 'first' | 'last' | 'none'
  /**
   * Object of classes for each HTML element of the dialog element.
   *
   * @see https://a11y-dialog.netlify.app/usage/markup
   */
  classNames?: {
    container?: string
    overlay?: string
    dialog?: string
    title?: string
    closeButton?: string
  }
  /**
   * Dialog content.
   *
   * Anything that can be rendered: numbers, strings, elements or an array
   * (or fragment) containing these types.
   */
  children: React.ReactNode
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
    React.LegacyRef<HTMLDivElement>,
  ]
}

type UseA11yDialogProps = Pick<ReactA11yDialogProps, 'role' | 'id' | 'titleId'>

export const useA11yDialog = (props: UseA11yDialogProps) => {
  const { role = 'dialog', id, titleId = `${id}-title` } = props

  const [instance, ref] = useA11yDialogInstance()
  const close = React.useCallback(() => instance?.hide(), [instance])
  const isAlertDialog = role === 'alertdialog'

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
        id,
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

export const A11yDialog: React.FC<ReactA11yDialogProps> = props => {
  const {
    role = 'dialog',
    id,
    titleId = `${id}-title`,
    closeButtonLabel = 'Close this dialog window',
    closeButtonContent = '\u00D7',
    closeButtonPosition = 'first',
    classNames = {},
    dialogRef = () => {},
    dialogRoot,
    title,
    children,
  } = props

  const isMounted = useIsMounted()
  const [instance, attributes] = useA11yDialog({ role, id, titleId })

  React.useEffect(() => {
    if (instance) dialogRef(instance)
    return () => {
      dialogRef(undefined)
    }
  }, [dialogRef, instance])

  if (!isMounted) return null

  const root = dialogRoot ? document.querySelector(dialogRoot) : document.body

  const button = (
    <button
      {...attributes.closeButton}
      className={classNames.closeButton}
      aria-label={closeButtonLabel}
      key='button'
    >
      {closeButtonContent}
    </button>
  )

  return ReactDOM.createPortal(
    <div {...attributes.container} className={classNames.container}>
      <div {...attributes.overlay} className={classNames.overlay} />
      <div {...attributes.dialog} className={classNames.dialog}>
        {closeButtonPosition === 'first' && button}
        <p {...attributes.title} className={classNames.title} key='title'>
          {title}
        </p>
        {children}
        {closeButtonPosition === 'last' && button}
      </div>
    </div>,
    root as HTMLElement
  )
}
