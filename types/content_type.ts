export type ApiColor = "default" | "gray" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "red" | "gray_background" | "brown_background" | "orange_background" | "yellow_background" | "green_background" | "blue_background" | "purple_background" | "pink_background" | "red_background"
export type LanguageRequest = "abap" | "arduino" | "bash" | "basic" | "c" | "clojure" | "coffeescript" | "c++" | "c#" | "css" | "dart" | "diff" | "docker" | "elixir" | "elm" | "erlang" | "flow" | "fortran" | "f#" | "gherkin" | "glsl" | "go" | "graphql" | "groovy" | "haskell" | "html" | "java" | "javascript" | "json" | "julia" | "kotlin" | "latex" | "less" | "lisp" | "livescript" | "lua" | "makefile" | "markdown" | "markup" | "matlab" | "mermaid" | "nix" | "objective-c" | "ocaml" | "pascal" | "perl" | "php" | "plain text" | "powershell" | "prolog" | "protobuf" | "python" | "r" | "reason" | "ruby" | "rust" | "sass" | "scala" | "scheme" | "scss" | "shell" | "solidity" | "sql" | "swift" | "typescript" | "vb.net" | "verilog" | "vhdl" | "visual basic" | "webassembly" | "xml" | "yaml" | "java/c/c++/c#";

type AnnotationResponse = {
  bold: boolean
  italic: boolean
  strikethrough: boolean
  underline: boolean
  code: boolean
  color:
    | "default"
    | "gray"
    | "brown"
    | "orange"
    | "yellow"
    | "green"
    | "blue"
    | "purple"
    | "pink"
    | "red"
    | "gray_background"
    | "brown_background"
    | "orange_background"
    | "yellow_background"
    | "green_background"
    | "blue_background"
    | "purple_background"
    | "pink_background"
    | "red_background"
}

export type ParagraphBase = {
  value: string
  style: AnnotationResponse
  link: string | null
  isEq: boolean
}

export type Paragraph = ParagraphBase[]

export type List = {
  value: (Paragraph | List)[]
  color: ApiColor
}

export type Content =
  | {
      type: "h1" | "h2" | "h3"
      value: Paragraph
      color: ApiColor
    }
  | {
      // トグル型ヘッダー
      type: "th1" | "th2" | "th3"
      value: Paragraph
      color: ApiColor
    }
  | {
      type: "p"
      // <p><span>value</span>...<span>value</span></p>
      values: Paragraph
      color: ApiColor
      children: Content[]
    }
  | {
      type: "quote"
      values: Paragraph
      color: ApiColor
      children: Content[]
    }
  | {
      type: "n_list"
      // <ol><li>value</li>...<li>value</li></ol>
      values: List
    }
  | {
      type: "b_list"
      // <ul><li>value</li>...<li>value</li></ul>
      values: List
    }
  | {
      type: "divider"
    }
  | {
      type: "eq"
      // value is KaTeX format
      value: string
    }
  | {
      type: "code"
      caption: Paragraph
      language: LanguageRequest
      values: Paragraph
    }
