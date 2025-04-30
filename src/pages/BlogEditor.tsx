import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import slugify from 'slugify';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  categories: {
    category_id: string;
  }[];
}

export default function BlogEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: '',
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      excerpt: '',
      published: false,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      excerpt: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      if (!editor) return;
      
      try {
        setIsSaving(true);
        const postSlug = slug || slugify(values.title, { lower: true, strict: true });
        const content = editor.getHTML();

        const postData = {
          title: values.title,
          slug: postSlug,
          content,
          excerpt: values.excerpt,
          published: values.published,
          author_id: user?.id,
          published_at: values.published ? new Date().toISOString() : null,
        };

        if (slug) {
          // Update existing post
          const { error: updateError } = await supabase
            .from('blog_posts')
            .update(postData)
            .eq('slug', slug);

          if (updateError) throw updateError;

          // Update categories
          const { error: deleteCategoriesError } = await supabase
            .from('blog_post_categories')
            .delete()
            .eq('post_id', slug);

          if (deleteCategoriesError) throw deleteCategoriesError;
        } else {
          // Create new post
          const { error: insertError } = await supabase
            .from('blog_posts')
            .insert([postData]);

          if (insertError) throw insertError;
        }

        // Add categories
        if (selectedCategories.length > 0) {
          const categoryLinks = selectedCategories.map((categoryId) => ({
            post_id: postSlug,
            category_id: categoryId,
          }));

          const { error: categoriesError } = await supabase
            .from('blog_post_categories')
            .insert(categoryLinks);

          if (categoriesError) throw categoriesError;
        }

        showSuccess('Post saved successfully!');
        navigate(`/blog/${postSlug}`);
      } catch (error) {
        console.error('Error saving post:', error);
        showError('Failed to save post');
      } finally {
        setIsSaving(false);
      }
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('blog_categories')
          .select('*')
          .order('name');

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData);

        if (slug) {
          // Fetch existing post
          const { data: post, error: postError } = await supabase
            .from('blog_posts')
            .select(`
              *,
              categories:blog_post_categories(category_id)
            `)
            .eq('slug', slug)
            .single();

          if (postError) throw postError;

          formik.setValues({
            title: post.title,
            excerpt: post.excerpt || '',
            published: post.published,
          });

          if (editor) {
            editor.commands.setContent(post.content);
          }

          setSelectedCategories(post.categories.map((c: any) => c.category_id));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        showError('Failed to load post data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug, editor]);

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <form onSubmit={formik.handleSubmit} className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              {...formik.getFieldProps('title')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.title}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              rows={3}
              {...formik.getFieldProps('excerpt')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
            {formik.touched.excerpt && formik.errors.excerpt && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.excerpt}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories([...selectedCategories, category.id]);
                      } else {
                        setSelectedCategories(
                          selectedCategories.filter((id) => id !== category.id)
                        );
                      }
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto">
              <EditorContent editor={editor} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...formik.getFieldProps('published')}
                checked={formik.values.published}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Publish now</span>
            </label>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Post'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}