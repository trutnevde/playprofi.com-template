import { useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { $getRoot } from "lexical";

import { SegmentBlockNode } from "./SegmentBlock";
import { registerCustomNodes } from "./registerCustomNodes";
import "./editor.css";

// Загрузка контента как блоки
function PreloadedContent({ text }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const root = $getRoot();
      root.clear();

      const segments = text.split("\n\n").filter(Boolean);

      for (const segment of segments) {
        const node = new SegmentBlockNode(segment.trim());
        root.append(node);
      }
    });
  }, [editor, text]);

  return null;
}

function VoiceTextEditor({ initialText = "" }) {
  const config = {
    namespace: "VoiceTextEditor",
    theme: {
      paragraph: "editor-paragraph",
    },
    onError(error) {
      throw error;
    },
    editorState: null,
    nodes: registerCustomNodes(), // кастомные узлы, включая SegmentBlockNode
  };

  return (
    <LexicalComposer initialConfig={config}>
      <PreloadedContent text={initialText} />
      <RichTextPlugin
  contentEditable={
    <ContentEditable className="w-full h-full p-4 text-white outline-none rounded-2xl bg-dark-graphite overflow-y-auto" />
  }
  placeholder={<div className="text-supporting p-4">Введите текст...</div>}
  ErrorBoundary={LexicalErrorBoundary}
/>
      <HistoryPlugin />
    </LexicalComposer>
  );
}

export default VoiceTextEditor;