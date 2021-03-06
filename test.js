import React from 'react'
import { A11yDialog } from './'
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
    dialogRoot: '#dialog-root',
    classNames: {
      container: 'container',
      overlay: 'overlay',
      dialog: 'dialog',
      title: 'title',
      closeButton: 'closeButton',
    },
  }

  const dialog = React.useRef(null)

  return (
    <>
      <A11yDialog
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

    const container = screen.getByRole('dialog', { hidden: true })

    expect(container).toHaveAttribute('aria-labelledby', 'test-title')
    expect(container).toHaveAttribute('aria-modal', 'true')
    expect(container).toHaveAttribute('id', 'test')
    expect(container).toHaveAttribute('class', 'container')
  })

  it('should render the overlay', () => {
    render(<Test />)

    const container = screen.getByTestId('test')
    const overlay = container.firstChild

    expect(overlay).toHaveAttribute('class', 'overlay')

    // Open the dialog, close it by clicking the overlay, and ensure it has been
    // properly closed
    openDialog()
    fireEvent.click(overlay)
    expect(container).toHaveAttribute('aria-hidden', 'true')
  })

  it('should make the overlay cosmetic for modals', () => {
    render(<Test role='alertdialog' />)

    const container = screen.getByTestId('test')
    const overlay = container.firstChild

    expect(overlay).toHaveAttribute('class', 'overlay')

    // Open the dialog, try clicking the overlay, and ensure it is still open
    openDialog()
    fireEvent.click(overlay)
    expect(container).not.toHaveAttribute('aria-hidden')
  })

  it('should render the dialog', () => {
    render(<Test />)

    const dialog = screen.getByRole('document', { hidden: true })

    expect(dialog).toHaveAttribute('class', 'dialog')
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

  it('should render close button as first element by default', () => {
    render(<Test closeButtonContent='×' closeButtonLabel='Close the dialog' />)

    const dialog = screen.getByRole('document', { hidden: true })
    const button = screen.getByText('×')

    expect(dialog.firstElementChild).toEqual(button)
  })

  it('should render close button as last element if instructed so', () => {
    render(
      <Test
        closeButtonContent='×'
        closeButtonLabel='Close the dialog'
        closeButtonPosition='last'
      />
    )

    const dialog = screen.getByRole('document', { hidden: true })
    const button = screen.getByText('×')
    const title = screen.getByText('Test')

    expect(dialog.firstElementChild).toEqual(title)
    expect(dialog.firstElementChild).not.toEqual(button)
  })

  it('should not render close button if instructed so', () => {
    render(<Test closeButtonPosition='none' />)

    const button = screen.queryByText('×')
    expect(button).not.toBeInTheDocument()
  })
})
