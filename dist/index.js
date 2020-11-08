"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var React = require('react');

var ReactDOM = require('react-dom');

var A11yDialog = require('a11y-dialog');

var PropTypes = require('prop-types');

var useIsMounted = function useIsMounted() {
  var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isMounted = _React$useState2[0],
      setIsMounted = _React$useState2[1];

  React.useEffect(function () {
    return setIsMounted(true);
  }, []);
  return isMounted;
};

var useDialogInstance = function useDialogInstance(_ref) {
  var dialogRef = _ref.dialogRef,
      appRoot = _ref.appRoot;
  var instance = React.useRef(null);
  var container = React.useCallback(function (node) {
    if (node !== null) {
      instance.current = new A11yDialog(node, appRoot);
      dialogRef(instance.current);
    }
  }, [dialogRef, appRoot]);
  return {
    container: container,
    instance: instance
  };
};

var Dialog = function Dialog(props) {
  var isMounted = useIsMounted();
  var dialogRef = props.dialogRef;

  var _useDialogInstance = useDialogInstance(props),
      container = _useDialogInstance.container,
      instance = _useDialogInstance.instance;

  React.useEffect(function () {
    var dialogInstance = instance.current;
    return function () {
      if (dialogInstance) dialogInstance.destroy();
      dialogRef(undefined);
    };
  }, [dialogRef, instance]);
  var close = React.useCallback(function () {
    return instance.current.hide();
  }, [instance]);
  if (!isMounted) return null;
  var id = props.id,
      classNames = props.classNames;
  var titleId = props.titleId || id + '-title';
  var Element = props.useDialogElement ? 'dialog' : 'div';
  return ReactDOM.createPortal( /*#__PURE__*/React.createElement("div", {
    id: id,
    className: classNames.base,
    ref: container
  }, /*#__PURE__*/React.createElement("div", {
    tabIndex: "-1",
    className: classNames.overlay,
    onClick: props.role === 'alertdialog' ? undefined : close
  }), /*#__PURE__*/React.createElement(Element, {
    role: props.role,
    className: classNames.element,
    "aria-labelledby": titleId
  }, /*#__PURE__*/React.createElement("div", {
    role: props.useDialogElement ? undefined : 'document',
    className: classNames.document
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": props.closeButtonLabel,
    onClick: close,
    className: classNames.closeButton
  }, props.closeButtonContent), /*#__PURE__*/React.createElement("p", {
    id: titleId,
    className: classNames.title,
    role: "heading",
    "aria-level": "1"
  }, props.title), props.children))), document.querySelector(props.dialogRoot));
};

Dialog.defaultProps = {
  role: 'dialog',
  closeButtonLabel: 'Close this dialog window',
  closeButtonContent: "\xD7",
  classNames: {},
  dialogRef: function dialogRef() {
    return void 0;
  },
  useDialogElement: false // Default properties cannot be based on other properties, so the default
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
  useDialogElement: PropTypes.bool,
  // Dialog content.
  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  children: PropTypes.node
};
module.exports = Dialog;
