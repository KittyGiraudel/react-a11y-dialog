# React A11yDialog

react-a11y-dialog is a React component for [a11y-dialog](https://github.com/edenspiekermann/a11y-dialog) meant to ease the use of accessible dialog windows in React applications.

## Install

```
npm install --save react-a11y-dialog
```

## Example

There are 3 required properties for the dialog component:

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
