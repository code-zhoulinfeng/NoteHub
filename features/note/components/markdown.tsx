import { mdToHtml } from "@/lib/markdown";

interface MarkdownProps {
  content: string;
  className?: string;
}

/**
 * Markdown 正文渲染（服务端）。
 * mdToHtml 内部先全部转义再还原受控节点，无原始 HTML 注入风险。
 */
export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div
      className={className ? `${className} md` : "md"}
      dangerouslySetInnerHTML={{ __html: mdToHtml(content) }}
    />
  );
}
