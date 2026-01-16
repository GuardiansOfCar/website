"use client";

import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor-only.css";
// color-syntax 플러그인은 locale 에러를 일으키므로 제거
// import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
// import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
// tui-color-picker CSS는 구식 문법으로 인해 파싱 에러가 발생하므로 제거

import { ForwardedRef, forwardRef } from "react";

// Editor 컴포넌트를 props와 ref 타입과 함께 forwardRef로 감싸줍니다.
const TuiEditor = forwardRef(
  (props: any, ref: ForwardedRef<Editor | null>) => {
    return (
      <Editor
        {...props}
        ref={ref}
        initialValue={props.initialValue || " "} // placeholder와 initialValue 동시 사용을 위한 트릭
        placeholder={props.placeholder || "내용을 입력해주세요."}
        previewStyle="vertical"
        height="600px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        language="ko-KR"
        // plugins={[colorSyntax]} // color-syntax 플러그인 제거
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