import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  published_at: string;
  author: {
    email: string;
  };
  categories: {
    category: {
      name: string;
      slug: string;
    };
  }[];
}

export default function BlogPost() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            id,
            title,
            content,
            published_at,
            author:author_id(email),
            categories:blog_post_categories(
              category:blog_categories(name, slug)
            )
          `)
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (err) {
        setError('Failed to load blog post');
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Post Not Found</h1>
            <p className="mt-2 text-gray-600">The blog post you're looking for doesn't exist.</p>
            <Link
              to="/blog"
              className="mt-4 inline-block text-primary-600 hover:text-primary-500"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="inline-block mb-8 text-primary-600 hover:text-primary-500"
        >
          ← Back to Blog
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {post.categories?.map(({ category }) => (
              <Link
                key={category.slug}
                to={`/blog/category/${category.slug}`}
                className="text-sm font-medium text-primary-600 hover:text-primary-500 bg-primary-50 px-3 py-1 rounded-full"
              >
                {category.name}
              </Link>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>By {post.author.email}</span>
            <time dateTime={post.published_at}>
              {format(new Date(post.published_at), 'MMMM d, yyyy')}
            </time>
          </div>
        </header>

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {user && user.id === post.author.id && (
          <div className="mt-8 flex justify-end">
            <Link
              to={`/blog/edit/${slug}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Edit Post
            </Link>
          </div>
        )}
      </article>
    </div>
  );
}