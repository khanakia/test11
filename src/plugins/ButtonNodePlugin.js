import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useEffect } from "react";
import { $createButtonNode } from "../nodes/ButtonNode";

const ButtonNodePlugin = () => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editor.update(() => {
      $getRoot().append($createButtonNode());
    });
  }, [editor]);
  return null;
};
export default ButtonNodePlugin;
