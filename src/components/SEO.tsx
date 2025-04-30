import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
}

export default function SEO({
  title = 'PaySurity - Secure Payment Processing for Modern Businesses',
  description = 'PaySurity provides secure, reliable payment processing solutions for businesses of all sizes. Accept payments anywhere, anytime with our comprehensive merchant services.',
  keywords = ['payment processing', 'merchant services', 'online payments', 'payment gateway'],
  image = 'https://paysurity.com/og-image.jpg',
  url = 'https://paysurity.com',
}: SEOProps) {
  const siteTitle = title.includes('PaySurity') ? title : `${title} | PaySurity`;

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="PaySurity" />
    </Helmet>
  );
}