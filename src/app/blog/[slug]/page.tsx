
import { blogPosts, type BlogPost } from '@/lib/blog-posts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-3xl">
        <Card>
          <CardHeader className="text-center border-b pb-8">
            <CardDescription>{post.date}</CardDescription>
            <CardTitle className="text-4xl font-bold font-headline leading-tight">
              {post.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="py-8">
            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground space-y-4">
              {post.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('**')) {
                    const content = paragraph.replace(/\*\*/g, '');
                    return <h3 key={index} className="text-xl font-semibold text-card-foreground !mt-6 !mb-2">{content}</h3>
                }
                return <p key={index}>{paragraph}</p>
              })}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Link href="/blog" passHref>
            <Button variant="default">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
