import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  published_at: string;
  source_url: string;
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, excerpt, published_at, source_url')
          .eq('published', true)
          .order('published_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setNews(data || []);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 p-4 rounded-lg">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Latest Industry News</h2>
      <div className="space-y-6">
        {news.map((article) => (
          <article key={article.id} className="border-b border-gray-200 pb-6 last:border-0">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-600"
              >
                {article.title}
              </a>
            </h3>
            <p className="text-gray-600 text-sm mb-2">{article.excerpt}</p>
            <time className="text-xs text-gray-500">
              {format(new Date(article.published_at), 'MMM d, yyyy')}
            </time>
          </article>
        ))}
      </div>
    </div>
  );
}