import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import NewsSection from '../components/blog/NewsSection';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  author: {
    email: string;
  };
  categories: {
    name: string;
    slug: string;
  }[];
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            id,
            title,
            slug,
            excerpt,
            published_at,
            author:author_id(email),
            categories:blog_post_categories(
              category:blog_categories(name, slug)
            )
          `)
          .eq('published', true)
          .order('published_at', { ascending: false });

        if (error) throw error;

        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Latest Updates & Insights
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Stay up to date with the latest news, updates, and insights from PaySurity.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="grid gap-8 md:grid-cols-2">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      {post.categories?.map(({ category }) => (
                        <Link
                          key={category.slug}
                          to={`/blog/category/${category.slug}`}
                          className="text-xs font-medium text-primary-600 hover:text-primary-500 bg-primary-50 px-2 py-1 rounded-full"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{post.author.email}</span>
                      <time dateTime={post.published_at}>
                        {format(new Date(post.published_at), 'MMM d, yyyy')}
                      </time>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <NewsSection />
          </div>
        </div>
      </div>
    </div>
  );
}