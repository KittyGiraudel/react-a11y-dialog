"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.A11yDialog = exports.useA11yDialog = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _a11yDialog = _interopRequireDefault(require("a11y-dialog"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useIsMounted = function useIsMounted() {
  var _React$useState = _react["default"].useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isMounted = _React$useState2[0],
      setIsMounted = _React$useState2[1];

  _react["default"].useEffect(function () {
    return setIsMounted(true);
  }, []);

  return isMounted;
};

var useA11yDialogInstance = function useA11yDialogInstance(appRoot) {
  var instance = _react["default"].useRef(null);

  var container = _react["default"].useCallback(function (node) {
    if (node === null) return;
    if (instance.current) instance.current.destroy();
    instance.current = new _a11yDialog["default"](node, appRoot);
  }, [appRoot]);

  return [instance, container];
};

var useA11yDialog = function useA11yDialog(props) {
  var _useA11yDialogInstanc = useA11yDialogInstance(props.appRoot),
      _useA11yDialogInstanc2 = _slicedToArray(_useA11yDialogInstanc, 2),
      instance = _useA11yDialogInstanc2[0],
      ref = _useA11yDialogInstanc2[1];

  var close = _react["default"].useCallback(function () {
    return instance.current.hide();
  }, [instance]);

  var role = props.role || 'dialog';
  var isModal = role === 'alertdialog';
  var titleId = props.titleId || props.id + '-title';

  _react["default"].useEffect(function () {
    var dialogInstance = instance.current;
    return function () {
      return dialogInstance && dialogInstance.destroy();
    };
  }, [instance]); // Destroy the `a11y-dialog` instance when unmounting the component.


  _react["default"].useEffect(function () {
    return function () {
      return instance.current.destroy();
    };
  }, []);

  return [instance, {
    container: {
      id: props.id,
      ref: ref,
      'aria-hidden': true
    },
    overlay: {
      tabIndex: -1,
      onClick: isModal ? undefined : close
    },
    dialog: {
      role: role,
      'aria-labelledby': titleId
    },
    inner: {
      role: isModal ? undefined : 'document'
    },
    closeButton: {
      type: 'button',
      onClick: close
    },
    // Using a paragraph with accessibility mapping can be useful to work
    // around SEO concerns of having multiple <h1> per page.
    // See: https://twitter.com/goetsu/status/1261253532315004930
    title: {
      role: 'heading',
      'aria-level': 1,
      id: titleId
    }
  }];
};

exports.useA11yDialog = useA11yDialog;

var A11yDialog = function A11yDialog(props) {
  var isMounted = useIsMounted();

  var _useA11yDialog = useA11yDialog(props),
      _useA11yDialog2 = _slicedToArray(_useA11yDialog, 2),
      instance = _useA11yDialog2[0],
      attributes = _useA11yDialog2[1];

  var dialogRef = props.dialogRef;

  _react["default"].useEffect(function () {
    if (instance.current) dialogRef(instance.current);
    return function () {
      return dialogRef(undefined);
    };
  }, [dialogRef, instance]);

  if (!isMounted) return null;
  var Element = props.useDialogElement ? 'dialog' : 'div';

  var title = /*#__PURE__*/_react["default"].createElement("p", _extends({}, attributes.title, {
    className: props.classNames.title,
    key: "title"
  }), props.title);

  var button = /*#__PURE__*/_react["default"].createElement("button", _extends({}, attributes.closeButton, {
    className: props.classNames.closeButton,
    "aria-label": props.closeButtonLabel,
    key: "button"
  }), props.closeButtonContent);

  var children = [props.closeButtonPosition === 'first' && button, title, props.children, props.closeButtonPosition === 'last' && button].filter(Boolean);
  return /*#__PURE__*/_reactDom["default"].createPortal( /*#__PURE__*/_react["default"].createElement("div", _extends({}, attributes.container, {
    className: props.classNames.container
  }), /*#__PURE__*/_react["default"].createElement("div", _extends({}, attributes.overlay, {
    className: props.classNames.overlay
  })), /*#__PURE__*/_react["default"].createElement(Element, _extends({}, attributes.dialog, {
    className: props.classNames.dialog
  }), /*#__PURE__*/_react["default"].createElement("div", _extends({}, attributes.inner, {
    className: props.classNames.inner
  }), children))), document.querySelector(props.dialogRoot));
};

exports.A11yDialog = A11yDialog;
A11yDialog.defaultProps = {
  role: 'dialog',
  closeButtonLabel: 'Close this dialog window',
  closeButtonContent: "\xD7",
  closeButtonPosition: 'first',
  classNames: {},
  dialogRef: function dialogRef() {
    return void 0;
  },
  useDialogElement: false // Default properties cannot be based on other properties, so the default
  // value for the `titleId` prop is defined in the `render(..)` method.

};
A11yDialog.propTypes = {
  // The `role` attribute of the dialog element, either `dialog` (default) or
  // `alertdialog` to make it a modal (preventing closing on click outside of
  // ESC key).
  role: _propTypes["default"].oneOf(['dialog', 'alertdialog']),
  // The HTML `id` attribute of the dialog element, internally used by
  // a11y-dialog to manipulate the dialog.
  id: _propTypes["default"].string.isRequired,
  // The title of the dialog, mandatory in the document to provide context to
  // assistive technology. Could be hidden (while remaining accessible) with
  // CSS though.
  title: _propTypes["default"].node.isRequired,
  // A function called when the component has mounted, receiving the instance
  // of A11yDialog so that it can be programmatically accessed later on.
  // E.g.: dialogRef={(dialog) => (this.dialog = dialog)}
  dialogRef: _propTypes["default"].func,
  // The HTML `id` attribute of the dialog’s title element, used by assistive
  // technologies to provide context and meaning to the dialog window. Falls
  // back to the `${this.props.id}-title` if not provided.
  titleId: _propTypes["default"].string,
  // The HTML `aria-label` attribute of the close button, used by assistive
  // technologies to provide extra meaning to the usual cross-mark. Defaults
  // to a generic English explanation.
  closeButtonLabel: _propTypes["default"].string,
  // The string that is the innerHTML of the close button.
  closeButtonContent: _propTypes["default"].node,
  // Whether the close button should be rendered as first/last children or not at all.
  closeButtonPosition: _propTypes["default"].oneOf(['first', 'last', 'none']),
  // a11y-dialog needs one or more “targets” to disable when the dialog is open.
  // This prop can be one or more selector which will be passed to a11y-dialog
  // constructor.
  appRoot: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].arrayOf(_propTypes["default"].string)]).isRequired,
  // React 16 requires a container for the portal’s content to be rendered
  // into; this is required and needs to be an existing valid DOM node,
  // adjacent to the React root container of the application.
  dialogRoot: _propTypes["default"].string.isRequired,
  // Object of classes for each HTML element of the dialog element.
  // See: http://edenspiekermann.github.io/a11y-dialog/#expected-dom-structure
  classNames: _propTypes["default"].exact({
    container: _propTypes["default"].string,
    overlay: _propTypes["default"].string,
    dialog: _propTypes["default"].string,
    inner: _propTypes["default"].string,
    title: _propTypes["default"].string,
    closeButton: _propTypes["default"].string
  }),
  // Whether to render a `<dialog>` element or a `<div>` element.
  useDialogElement: _propTypes["default"].bool,
  // Dialog content.
  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  children: _propTypes["default"].node
};
