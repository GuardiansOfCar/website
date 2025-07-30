"use client";

import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import "tui-color-picker/dist/tui-color-picker.css";

import { ForwardedRef, forwardRef } from "react";

// Editor 컴포넌트를 props와 ref 타입과 함께 forwardRef로 감싸줍니다.
const TuiEditor = forwardRef(
  (props: any, ref: ForwardedRef<Editor | null>) => {
    return (
      <Editor
        {...props}
        ref={ref}
        initialValue=" " // placeholder와 initialValue 동시 사용을 위한 트릭
        placeholder="내용을 입력해주세요."
        previewStyle="vertical"
        height="600px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        language="ko-KR"
        plugins={[colorSyntax]} // 글자색 변경 플러그인 추가
        toolbarItems={[
          // 모든 툴바 기능 포함
          ["heading", "bold", "italic", "strike"],
          ["hr", "quote"],
          ["ul", "ol", "task", "indent", "outdent"],
          ["table", "image", "link"],
          ["code", "codeblock"],
          ["scrollSync"],
        ]}
      />
    );
  }
);

TuiEditor.displayName = "TuiEditor";

export default TuiEditor;