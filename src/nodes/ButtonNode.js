import {
  $getNodeByKey,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DecoratorNode
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";

import { useEffect, useRef } from "react";

const ButtonComponent = ({ inputIsActive, nodeKey }) => {
  const ref = useRef(null);
  const [editor] = useLexicalComposerContext();
  const [, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  useEffect(() => {
    editor.registerCommand(
      CLICK_COMMAND,
      (payload) => {
        const event = payload;
        if (
          ref.current !== null &&
          (event.target === ref.current || ref.current.contains(event.target))
        ) {
          if (!event.shiftKey) {
            clearSelection();
          }
          setSelected(true);
          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, clearSelection, setSelected]);
  console.log(inputIsActive);
  return (
    <div
      ref={ref}
      style={{
        width: 200,
        height: 50,
        backgroundColor: "black",
        position: "relative",
        border: "2px solid white"
      }}
    >
      <span
        onClick={() =>
          editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if ($isButtonNode(node)) node.setInputIsActive(true);
          })
        }
        style={{ color: "white" }}
      >
        Click Me
      </span>
      {inputIsActive && (
        <input
          style={{
            backgroundColor: "white",
            width: 150,
            height: 40,
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 10
          }}
          autoFocus
          onBlur={() =>
            editor.update(() => {
              const node = $getNodeByKey(nodeKey);
              if ($isButtonNode(node)) node.setInputIsActive(false);
            })
          }
        />
      )}
    </div>
  );
};

export class ButtonNode extends DecoratorNode {
  __inputIsActive;

  static getType() {
    return "button";
  }

  static clone(node) {
    return new ButtonNode(node.__inputIsActive, node.__key);
  }

  static importJSON() {
    const node = $createButtonNode();
    return node;
  }

  constructor(inputIsActive, key) {
    super(key);
    this.__inputIsActive = inputIsActive || false;
  }

  exportJSON() {
    return {
      type: "button",
      version: 1
    };
  }

  setInputIsActive(isActive) {
    console.log("setInputIsActive");
    try {
      const writable = this.getWritable();
      writable.__inputIsActive = isActive;
    } catch (err) {
      console.log(err);
    }
  }

  createDOM(config) {
    const div = document.createElement("div");
    const theme = config.theme;
    const className = theme.button;
    if (className !== undefined) {
      div.className = className;
    }
    return div;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return (
      <ButtonComponent
        inputIsActive={this.__inputIsActive}
        nodeKey={this.__key}
      />
    );
  }

  isTopLevel() {
    return true;
  }
}

export function $createButtonNode() {
  return new ButtonNode();
}

export function $isButtonNode(node) {
  return node instanceof ButtonNode;
}
