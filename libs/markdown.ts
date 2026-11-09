import path from "path";
import { remark } from "remark";
import html from "remark-html";
import fs from "fs";
import remarkGfm from "remark-gfm";

export async function parseMarkdown(markdownString: string) {
  const processedContent = await remark()
    .use(remarkGfm)
    .use(html)
    .process(markdownString);

  return processedContent.toString();
}

export async function getPostData(slug: string, title: string = "Wireflow App") {
  const text = await fs.readFileSync(
    path.join(process.cwd(), "documents", `${slug}.md`),
    "utf8"
  );

  return {
    title,
    content: text ?? "",
  };
}
