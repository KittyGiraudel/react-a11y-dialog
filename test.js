import React from "react";
import ReactDOM from "react-dom";
import Dialog from "./";
import TestRenderer from "react-test-renderer";

// See: https://github.com/facebook/react/issues/11565#issuecomment-368877149
jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  createPortal: (node) => node,
}));

const ROOT_PORTAL_IDS = ["dialog-root"];

const addPortalRoots = () => {
  for (const id of ROOT_PORTAL_IDS) {
    if (!global.document.querySelector("#" + id)) {
      const rootNode = global.document.createElement("div");
      rootNode.setAttribute("id", id);
      global.document.body.appendChild(rootNode);
    }
  }
};

const removePortalRoots = () => {
  for (const id of rootPortalIds) {
    global.document.querySelector("#" + id)?.remove();
  }
};

const getTree = (props) => {
  const { root: instance } = TestRenderer.create(
    <Dialog
      id="dialog-test"
      appRoot="#root"
      dialogRoot="#dialog-root"
      title="Test Dialog Title"
      {...props}
    />
  );
  const container = instance.children[0];

  return {
    container,
    overlay: container.children[0],
    dialog: container.children[1],
    inner: container.children[1].children[0],
    closeButton: container.children[1].children[0].children[0],
    title: container.children[1].children[0].children[1],
  };
};

describe("The `react-a11y-dialog` component", () => {
  beforeAll(() => addPortalRoots());
  afterAll(() => removePortalRoots());

  it("should render the container", () => {
    const { container } = getTree({ id: "dialog-test" });

    expect(container.props.id).toBe("dialog-test");
  });

  it("should render the overlay", () => {
    const { overlay: overlayA } = getTree({ role: "dialog" });
    const { overlay: overlayB } = getTree({ role: "alertdialog" });

    expect(overlayA.props.tabIndex).toBe("-1");
    expect(overlayA.props.onClick).toBeDefined();
    expect(overlayB.props.tabIndex).toBe("-1");
    expect(overlayB.props.onClick).toBeUndefined();
  });

  it("should render the dialog", () => {
    const { dialog: dialogA } = getTree({ id: "dialog-test", useDialog: true });
    const { dialog: dialogB } = getTree({
      id: "dialog-test",
      useDialog: false,
    });
    const { dialog: dialogC } = getTree({
      id: "dialog-test",
      useDialog: false,
      role: "alertdialog",
    });

    expect(dialogA.type).toBe("dialog");
    expect(dialogB.type).toBe("div");
    expect(dialogC.type).toBe("div");
    expect(dialogA.props.role).toBe("dialog");
    expect(dialogB.props.role).toBe("dialog");
    expect(dialogC.props.role).toBe("alertdialog");
    expect(dialogA.props["aria-labelledby"]).toBe("dialog-test-title");
    expect(dialogB.props["aria-labelledby"]).toBe("dialog-test-title");
    expect(dialogC.props["aria-labelledby"]).toBe("dialog-test-title");
  });

  it("should render the inner container", () => {
    const { inner: innerA } = getTree({ useDialog: true });
    const { inner: innerB } = getTree({ useDialog: false });

    expect(innerA.type).toBe("div");
    expect(innerA.props.role).toBeUndefined();
    expect(innerB.props.role).toBe("document");
  });

  it("should render the close button", () => {
    const { closeButton } = getTree({
      closeButtonLabel: "close button label",
      closeButtonContent: "close button content",
    });

    expect(closeButton.type).toBe("button");
    expect(closeButton.props.type).toBe("button");
    expect(closeButton.props["aria-label"]).toBe("close button label");
    expect(closeButton.props.onClick).toBeDefined();
    expect(closeButton.props.children).toBe("close button content");
  });

  it("should render the title", () => {
    const { title } = getTree({ title: "Hello" });

    expect(title.type).toBe("p");
    expect(title.props.role).toBe("heading");
    expect(title.props["aria-level"]).toBe("1");
    expect(title.props.children).toBe("Hello");
  });

  it("should render children", () => {
    const { inner } = getTree({ children: "Children!" });
    expect(inner.props.children[inner.props.children.length - 1]).toBe(
      "Children!"
    );
  });
});
