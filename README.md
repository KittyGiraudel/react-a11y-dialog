# React A11yDialog

react-a11y-dialog is a React component for [a11y-dialog](https://github.com/edenspiekermann/a11y-dialog) meant to ease the use of accessible dialog windows in React applications.

*Note: for React versions **before** 16, use `react-a11y-dialog@2.0.0`. For React 16+, `react-a11y-dialog@latest` can be used.*

## Install

```
npm install --save react-a11y-dialog
```

## Example

There are 4 required properties for the dialog component:

- `dialogContainer`: the selector for a valid existing DOM node in which to render the React portal for the dialog.
- `id`: the `id` attribute used internally by a11y-dialog to control the element.
- `title`: the text content for the title of the dialog.
- `dialogRef`: a function that receive the [A11yDialog instance](https://github.com/edenspiekermann/a11y-dialog#toggling-the-dialog-window) so it can be interacted with.

```jsx
const Dialog = require('react-a11y-dialog')

const MyComponent = React.createClass({
  handleClick: function () {
    this.dialog.show()
  },

  render: function () {
    return (
      <div>
        <button type="button" onClick={this.handleClick}>
          Open the dialog
        </button>

        <Dialog id="my-accessible-dialog"
                dialogContainer="#dialog-root"
                dialogRef={(dialog) => (this.dialog = dialog)}
                title="The dialog title">
          <p>Some content for the dialog.</p>
        </Dialog>
      </div>
    )
  }
})

ReactDOM.render(
  <MyComponent />,
  document.getElementById('main')
)
```

## Notes

Note that the actual dialog element will be moved on `componentDidMount` so it lives outside of your application main container. For more information about why this is necessary, refer to [a11y-dialog documentation](http://edenspiekermann.github.io/a11y-dialog/#expected-dom-structure).
