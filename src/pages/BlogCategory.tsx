import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  author: {
    email: string;
  };
}

interface Category {
  name: string;
  slug: string;
}

export default function BlogCategory() {
  const { slug } = useParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryAndPosts() {
      try {
        // Fetch category details
        const { data: categoryData, error: categoryError } = await supabase
          .from('blog_categories')
          .select('name, slug')
          .eq('slug', slug)
          .single();

        if (categoryError) throw categoryError;
        setCategory(categoryData);

        // Fetch posts in this category
        const { data: postsData, error: postsError } = await supabase
          .from('blog_posts')
          .select(`
            id,
            title,
            slug,
            excerpt,
            published_at,
            author:author_id(email)
          `)
          .eq('published', true)
          .in('id', 
            supabase
              .from('blog_post_categories')
              .select('post_id')
              .eq('category_id', categoryData.id)
          )
          .order('published_at', { ascending: false });

        if (postsError) throw postsError;
        setPosts(postsData || []);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryAndPosts();
  }, [slug]);

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

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Category Not Found</h1>
            <p className="mt-2 text-gray-600">The category you're looking for doesn't exist.</p>
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/blog"
            className="text-primary-600 hover:text-primary-500"
          >
            ← Back to Blog
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {category.name}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Showing {posts.length} post{posts.length !== 1 ? 's' : ''} in this category
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
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

        {posts.length === 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-600">No posts found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}