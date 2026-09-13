import { esc } from "@/lib/utils";

/**
 * 极简 Markdown → HTML 渲染器（自 design.html 移植）。
 * 服务端运行；渲染前全部转义，代码块/行内代码先 stash 再还原，XSS 安全。
 * 后端阶段可替换为 react-markdown + remark-gfm。
 */

const slugify = (s: string) =>
  String(s)
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
    .replace(/^-|-$/g, "");

function inlineMd(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

export function mdToHtml(md: string): string {
  let src = String(md).replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  const stash: string[] = [];
  const keep = (html: string) => `\u0000${stash.push(html) - 1}\u0000`;

  src = src.replace(/```(\w*)\r?\n([\s\S]*?)```/g, (_m, _lang, code) =>
    keep(`<pre class="md-pre"><code>${esc(String(code).replace(/\n$/, ""))}</code></pre>`),
  );
  src = src.replace(/`([^`\n]+)`/g, (_m, c) => keep(`<code class="md-code">${esc(c)}</code>`));
  src = esc(src);

  const out: string[] = [];
  let listType: "ul" | "ol" | null = null;
  const para: string[] = [];
  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${inlineMd(para.join(" "))}</p>`);
      para.length = 0;
    }
  };
  const closeList = () => {
    if (listType) {
      out.push(listType === "ul" ? "</ul>" : "</ol>");
      listType = null;
    }
  };

  for (const raw of src.split(/\r?\n/)) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushPara();
      closeList();
      continue;
    }
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^(#{1,6})\s+(.*)$/))) {
      flushPara();
      closeList();
      const lvl = m[1].length;
      out.push(`<h${lvl} id="${slugify(m[2])}">${inlineMd(m[2])}</h${lvl}>`);
    } else if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      flushPara();
      closeList();
      out.push("<hr>");
    } else if ((m = line.match(/^&gt;\s?(.*)$/)) || (m = line.match(/^>\s?(.*)$/))) {
      flushPara();
      closeList();
      out.push(`<blockquote><p>${inlineMd(m[1]!)}</p></blockquote>`);
    } else if ((m = line.match(/^[-*+]\s+(.*)$/))) {
      flushPara();
      if (listType !== "ul") {
        closeList();
        out.push("<ul>");
        listType = "ul";
      }
      out.push(`<li>${inlineMd(m[1]!)}</li>`);
    } else if ((m = line.match(/^\d+\.\s+(.*)$/))) {
      flushPara();
      if (listType !== "ol") {
        closeList();
        out.push("<ol>");
        listType = "ol";
      }
      out.push(`<li>${inlineMd(m[1]!)}</li>`);
    } else {
      para.push(line.trim());
    }
  }
  flushPara();
  closeList();
  return out
    .join("\n")
    .replace(/\u0000(\d+)\u0000/g, (_m, i) => stash[Number(i)] ?? "");
}

export interface TocItem {
  level: number;
  text: string;
  id: string;
}

/** 提取 h2/h3 作为目录 */
export function extractToc(md: string): TocItem[] {
  const toc: TocItem[] = [];
  String(md)
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "")
    .split(/\r?\n/)
    .forEach((line) => {
      const m = line.match(/^(#{2,3})\s+(.*)$/);
      if (m) {
        toc.push({
          level: m[1]!.length,
          text: m[2]!.replace(/[*`]/g, ""),
          id: slugify(m[2]!),
        });
      }
    });
  return toc;
}
