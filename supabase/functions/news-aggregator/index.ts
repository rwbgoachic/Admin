import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import slugify from 'npm:slugify@1.6.6';
import { load } from 'npm:cheerio@1.0.0-rc.12';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// News API endpoints
const NEWS_ENDPOINTS = [
  'https://newsapi.org/v2/everything?q=payment+processing+OR+merchant+services&language=en&sortBy=publishedAt',
  'https://api.marketaux.com/v1/news/all?keywords=payment-technology,merchant-services&language=en&sort=published_on',
];

async function fetchNews(apiKey: string, endpoint: string) {
  const response = await fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });
  return response.json();
}

async function generateBlogPost(article: any) {
  // Extract main content and clean it up
  const content = await fetch(article.url)
    .then(res => res.text())
    .then(html => {
      const $ = load(html);
      // Remove ads, social media widgets, etc.
      $('script, style, iframe, .ads, .social-media').remove();
      // Get the main content
      const mainContent = $('article, .article-content, .post-content, main').first().html() || '';
      return mainContent;
    })
    .catch(() => '');

  // Generate a blog post with proper attribution
  return {
    title: article.title,
    slug: slugify(article.title, { lower: true, strict: true }),
    content: `
      <div class="prose max-w-none">
        ${content}
        <hr>
        <p class="text-sm text-gray-500">
          This article was originally published on 
          <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-500">
            ${new URL(article.url).hostname}
          </a>
        </p>
      </div>
    `,
    excerpt: article.description || '',
    published: true,
    published_at: new Date().toISOString(),
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch news from multiple sources
    const newsPromises = NEWS_ENDPOINTS.map(endpoint =>
      fetchNews(Deno.env.get('NEWS_API_KEY') ?? '', endpoint)
    );
    const newsResults = await Promise.all(newsPromises);

    // Process and store articles
    for (const result of newsResults) {
      const articles = result.articles || [];
      
      for (const article of articles) {
        // Check if article already exists
        const { data: existingPost } = await supabase
          .from('blog_posts')
          .select('id')
          .eq('title', article.title)
          .single();

        if (!existingPost) {
          const blogPost = await generateBlogPost(article);
          
          // Insert new blog post
          const { error: postError } = await supabase
            .from('blog_posts')
            .insert([{
              ...blogPost,
              author_id: Deno.env.get('SYSTEM_AUTHOR_ID'), // System bot account
            }]);

          if (postError) throw postError;
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});