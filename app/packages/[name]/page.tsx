// app/posts/[slug]/page.tsx
import { getPostData, parseMarkdown } from '@/libs/markdown';

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const post = await getPostData("packages/" + (name ?? ''));
  
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
