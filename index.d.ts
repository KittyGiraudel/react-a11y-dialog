import React from 'react'
import A11yDialogInstance from 'a11y-dialog'

type A11yDialogClassNames =
  | 'container'
  | 'overlay'
  | 'dialog'
  | 'title'
  | 'closeButton'

export interface A11yDialogProps {
  role?: 'dialog' | 'alertdialog'
  id: string
  title: React.ReactNode
  dialogRef?: (instance: A11yDialogInstance) => void
  titleId?: string
  closeButtonLabel?: string
  closeButtonContent?: React.ReactNode
  closeButtonPosition?: 'first' | 'last' | 'none'
  dialogRoot?: string
  classNames?: Partial<Record<A11yDialogClassNames, string>>
}

interface A11yDialogConfig {
  container: {
    id: string
    ref: (node: HTMLDivElement) => void
    role: string
    'aria-modal': boolean
    'aria-hidden': boolean
    'aria-labelledby': string
  }
  overlay: {
    onClick?: () => void
  }
  dialog: {
    role: 'document'
  }
  closeButton: {
    type: 'button'
    onClick: () => void
  }
  title: {
    role: 'heading'
    'aria-level': number
    id: string
  }
}

export function useA11yDialog(
  props: A11yDialogProps
): [A11yDialogInstance, A11yDialogConfig]

export class A11yDialog extends React.Component<
  React.PropsWithChildren<A11yDialogProps>,
  any
> {}
