import { ButtonNode } from "./nodes/ButtonNode";
import ExampleTheme from "./themes/ExampleTheme";

const editorConfig = {
  theme: ExampleTheme,
  onError(error) {
    throw error;
  },
  nodes: [ButtonNode]
};

export default editorConfig;
