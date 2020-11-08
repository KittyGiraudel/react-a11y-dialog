"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var React = require('react');

var ReactDOM = require('react-dom');

var A11yDialog = require('a11y-dialog');

var PropTypes = require('prop-types');

var Dialog = /*#__PURE__*/function (_React$Component) {
  _inherits(Dialog, _React$Component);

  var _super = _createSuper(Dialog);

  function Dialog(props) {
    var _this;

    _classCallCheck(this, Dialog);

    _this = _super.call(this, props);
    _this.state = {
      isMounted: false,
      container: null
    };
    _this.initDialog = _this.initDialog.bind(_assertThisInitialized(_this));
    _this.close = _this.close.bind(_assertThisInitialized(_this));
    _this.handleRef = _this.handleRef.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Dialog, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        isMounted: true
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevState.container !== this.state.container && this.state.container) {
        this.dialog = this.dialog || this.initDialog();
        this.props.dialogRef(this.dialog);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.dialog) {
        this.dialog.destroy();
      }

      this.props.dialogRef(undefined);
    }
  }, {
    key: "initDialog",
    value: function initDialog() {
      return new A11yDialog(this.state.container, this.props.appRoot);
    }
  }, {
    key: "close",
    value: function close() {
      this.dialog.hide();
    }
  }, {
    key: "handleRef",
    value: function handleRef(element) {
      this.setState({
        container: element
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.state.isMounted) {
        return null;
      }

      var _this$props = this.props,
          id = _this$props.id,
          classNames = _this$props.classNames;
      var titleId = this.props.titleId || id + '-title';
      var Element = this.props.useDialog ? 'dialog' : 'div';
      return ReactDOM.createPortal( /*#__PURE__*/React.createElement("div", {
        id: id,
        className: classNames.base,
        ref: this.handleRef
      }, /*#__PURE__*/React.createElement("div", {
        tabIndex: "-1",
        className: classNames.overlay,
        onClick: this.props.role === 'alertdialog' ? undefined : this.close
      }), /*#__PURE__*/React.createElement(Element, {
        role: this.props.role,
        className: classNames.element,
        "aria-labelledby": titleId
      }, /*#__PURE__*/React.createElement("div", {
        role: this.props.useDialog ? undefined : 'document',
        className: classNames.document
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        "aria-label": this.props.closeButtonLabel,
        onClick: this.close,
        className: classNames.closeButton
      }, this.props.closeButtonContent), /*#__PURE__*/React.createElement("p", {
        id: titleId,
        className: classNames.title,
        role: "heading",
        "aria-level": "1"
      }, this.props.title), this.props.children))), document.querySelector(this.props.dialogRoot));
    }
  }]);

  return Dialog;
}(React.Component);

Dialog.defaultProps = {
  role: 'dialog',
  closeButtonLabel: 'Close this dialog window',
  closeButtonContent: "\xD7",
  classNames: {},
  dialogRef: function dialogRef() {
    return void 0;
  },
  useDialog: true // Default properties cannot be based on other properties, so the default
  // value for the `titleId` prop is defined in the `render(..)` method.

};
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
  closeButtonContent: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
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
  classNames: PropTypes.objectOf(PropTypes.string),
  // Whether to render a `<dialog>` element or a `<div>` element.
  useDialog: PropTypes.bool,
  // Dialog content.
  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  children: PropTypes.node
};
module.exports = Dialog;
