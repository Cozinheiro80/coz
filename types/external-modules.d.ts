declare module "react-markdown" {
  import type { FC, ReactNode } from "react";

  export interface ReactMarkdownProps {
    children?: ReactNode;
    components?: Record<string, (props: Record<string, unknown>) => ReactNode>;
  }

  const ReactMarkdown: FC<ReactMarkdownProps>;
  export default ReactMarkdown;
}
