export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getPostData, parseMarkdown } from '@/libs/markdown';

export default async function Page() {
  const post = await getPostData("README");
  
  // Transform the markdown into static HTML on the server
  const htmlContent = await parseMarkdown(post.content);

  return (
    <main className="max-w-2xl mx-auto p-4">
      <article 
        className="prose skip:dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </main>
  );
}
