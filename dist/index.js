'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');
var A11yDialog = require('a11y-dialog');
var PropTypes = require('prop-types');

var Dialog = function (_React$Component) {
  _inherits(Dialog, _React$Component);

  function Dialog(props) {
    _classCallCheck(this, Dialog);

    var _this = _possibleConstructorReturn(this, (Dialog.__proto__ || Object.getPrototypeOf(Dialog)).call(this, props));

    _this.state = {
      isMounted: false,
      node: null
    };

    _this.initDialog = _this.initDialog.bind(_this);
    _this.close = _this.close.bind(_this);
    _this.handleRef = _this.handleRef.bind(_this);
    return _this;
  }

  _createClass(Dialog, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setState({ isMounted: true });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevState.node !== this.state.node && this.state.node) {
        this.dialog = this.dialog || this.initDialog();
        this.props.dialogRef(this.dialog);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.dialog.destroy();
      this.props.dialogRef(undefined);
    }
  }, {
    key: 'initDialog',
    value: function initDialog() {
      return new A11yDialog(this.state.node, this.props.appRoot);
    }
  }, {
    key: 'close',
    value: function close() {
      this.dialog.hide();
    }
  }, {
    key: 'handleRef',
    value: function handleRef(node) {
      this.setState({ node: node });
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.state.isMounted) {
        return null;
      }

      var _props = this.props,
          id = _props.id,
          classNames = _props.classNames;

      var titleId = this.props.titleId || id + '-title';

      return ReactDOM.createPortal(React.createElement(
        'div',
        {
          id: id,
          className: classNames.base,
          ref: this.handleRef },
        React.createElement('div', {
          tabIndex: '-1',
          className: classNames.overlay,
          onClick: this.close }),
        React.createElement(
          'div',
          {
            role: 'dialog',
            className: classNames.element,
            'aria-labelledby': titleId },
          React.createElement(
            'div',
            {
              role: 'document',
              className: classNames.document },
            React.createElement(
              'button',
              {
                type: 'button',
                'aria-label': this.props.closeButtonLabel,
                onClick: this.close,
                className: classNames.closeButton },
              this.props.closeButtonContent
            ),
            React.createElement(
              'h1',
              {
                id: titleId,
                className: classNames.title },
              this.props.title
            ),
            this.props.children
          )
        )
      ), document.querySelector(this.props.dialogRoot));
    }
  }]);

  return Dialog;
}(React.Component);

Dialog.defaultProps = {
  closeButtonLabel: 'Close this dialog window',
  closeButtonContent: '\xD7',
  classNames: {},
  dialogRef: function dialogRef() {
    return void 0;
  }
  // Default properties cannot be based on other properties, so the default
  // value for the `titleId` prop is defined in the `render(..)` method.
};

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
  appRoot: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,

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
  classNames: PropTypes.objectOf(PropTypes.string)
};

module.exports = Dialog;
