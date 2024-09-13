"use client";

import React, { useEffect, useRef, useState } from "react";
import type { JSONEditorOptions } from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

interface JsonEditorProps {
  value: object;
  onChange: (updatedJson: object) => void;
  options?: Partial<JSONEditorOptions>;
}

const JsonEditor: React.FC<JsonEditorProps> = React.memo(
  ({ value, onChange, options }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const jsonEditorInstance = useRef<any>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      if (editorRef.current && isClient) {
        import("jsoneditor").then(({ default: JSONEditor }) => {
          const editor = new JSONEditor(editorRef.current!, {
            mode: "tree",
            modes: ["text", "tree", "view"],
            onChange: () => {
              if (jsonEditorInstance.current) {
                try {
                  const updatedJson = jsonEditorInstance.current.get();
                  onChange(updatedJson);
                } catch (error) {
                  console.error("Error parsing JSON:", error);
                }
              }
            },
            ...options,
          });
          jsonEditorInstance.current = editor;
          jsonEditorInstance.current.set(value);
        });
      }
    }, [isClient, onChange, options, value]);

    useEffect(() => {
      if (isClient && jsonEditorInstance.current) {
        const currentJson = jsonEditorInstance.current.get();
        if (JSON.stringify(currentJson) !== JSON.stringify(value)) {
          jsonEditorInstance.current.update(value);
        }
      }
    }, [value, isClient]);

    return isClient ? (
      <div
        ref={editorRef}
        style={{
          width: "100%",
          height: "100%",
        }}
        className="jsoneditor"
      />
    ) : null;
  },
  (prevProps, nextProps) => {
    return (
      JSON.stringify(prevProps.value) === JSON.stringify(nextProps.value) &&
      prevProps.options === nextProps.options
    );
  }
);

export default JsonEditor;
