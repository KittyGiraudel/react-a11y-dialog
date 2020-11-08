import React from 'react'
import Dialog from './'
import { render, configure, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

configure({ testIdAttribute: 'id' })

// See: https://github.com/facebook/react/issues/11565#issuecomment-368877149
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: node => node,
}))

const Test = props => {
  const BASE_PROPS = {
    id: 'test',
    title: 'Test',
    appRoot: '#root',
    dialogRoot: '#dialog-root',
    classNames: {
      base: 'base',
      overlay: 'overlay',
      element: 'element',
      document: 'document',
      title: 'title',
      closeButton: 'closeButton',
    },
  }

  const dialog = React.useRef(null)

  return (
    <>
      <Dialog
        {...BASE_PROPS}
        {...props}
        dialogRef={instance => (dialog.current = instance)}
      />
      <button
        type='button'
        onClick={() => dialog.current && dialog.current.show()}
        id='opener'
      >
        Open dialog
      </button>
    </>
  )
}

const openDialog = () => {
  // Open the dialog
  fireEvent.click(screen.getByTestId('opener'))

  // Ensure it has been open
  expect(screen.getByTestId('test')).not.toHaveAttribute('aria-hidden')
}

describe('The A11yDialog component', () => {
  it('should render the container', () => {
    render(<Test />)

    const container = screen.getByTestId('test')

    expect(container).toHaveAttribute('id', 'test')
    expect(container).toHaveAttribute('class', 'base')
  })

  it('should render the overlay', () => {
    render(<Test />)

    const container = screen.getByTestId('test')
    const overlay = container.firstChild

    expect(overlay).toHaveAttribute('tabindex', '-1')
    expect(overlay).toHaveAttribute('class', 'overlay')

    // Open the dialog, close it by clicking the overlay, and ensure it has been
    // properly closed
    openDialog()
    fireEvent.click(overlay)
    expect(container).toHaveAttribute('aria-hidden', 'true')
  })

  it('should make the overlay cosmetic for modals', () => {
    render(<Test role='alertdialog' useDialog={false} />)

    const container = screen.getByTestId('test')
    const overlay = container.firstChild

    expect(overlay).toHaveAttribute('tabindex', '-1')
    expect(overlay).toHaveAttribute('class', 'overlay')

    // Open the dialog, try clicking the overlay, and ensure it is still open
    openDialog()
    fireEvent.click(overlay)
    expect(container).not.toHaveAttribute('aria-hidden')
  })

  it('should render the dialog', () => {
    render(<Test useDialog={false} />)

    const dialog = screen.getByRole('dialog', { hidden: true })

    expect(dialog).toHaveAttribute('aria-labelledby', 'test-title')
    expect(dialog).toHaveAttribute('class', 'element')
  })

  it('should render <dialog> element if instructed so', () => {
    render(<Test useDialog />)

    const container = screen.getByTestId('test')
    const dialog = container.querySelector('dialog')

    expect(dialog).toHaveAttribute('role', 'dialog')
    expect(dialog).toHaveAttribute('aria-labelledby', 'test-title')
    expect(dialog).toHaveAttribute('class', 'element')
  })

  it('should render inner container', () => {
    render(<Test useDialog={false} />)

    const dialog = screen.getByRole('dialog', { hidden: true })
    const inner = dialog.firstChild

    expect(inner).toHaveAttribute('role', 'document')
    expect(inner).toHaveAttribute('class', 'document')
  })

  it('should skip role from inner container when <dialog> is used', () => {
    render(<Test useDialog />)

    const dialog = screen.getByRole('dialog', { hidden: true })
    const inner = dialog.firstChild

    expect(inner).not.toHaveAttribute('role')
  })

  it('should render the title', () => {
    render(<Test />)

    const title = screen.getByText('Test')

    expect(title).toHaveAttribute('role', 'heading')
    expect(title).toHaveAttribute('aria-level', '1')
    expect(title).toHaveAttribute('id', 'test-title')
    expect(title).toHaveAttribute('class', 'title')
  })

  it('should render the close button', () => {
    render(<Test closeButtonContent='×' closeButtonLabel='Close the dialog' />)

    const container = screen.getByTestId('test')
    const button = screen.getByText('×')

    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('aria-label', 'Close the dialog')
    expect(button).toHaveAttribute('class', 'closeButton')

    // Open the dialog, close it by clicking the close button, and ensure it has
    // been properly closed
    openDialog()
    fireEvent.click(button)
    expect(container).toHaveAttribute('aria-hidden', 'true')
  })
})
