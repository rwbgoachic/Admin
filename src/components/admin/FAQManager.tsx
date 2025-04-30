import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { TouchFriendlyButton } from '../shared/TouchFriendlyButton';
import { TouchFriendlyInput } from '../shared/TouchFriendlyInput';
import { FAQForm } from './FAQForm';
import { supabase } from '../../lib/supabase';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  service: string;
}

export function FAQManager() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFAQs();
  }, []);

  async function loadFAQs() {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setFaqs(data);
    } catch (error) {
      toast.error('Failed to load FAQs');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('FAQ deleted successfully');
      setFaqs(faqs.filter(faq => faq.id !== id));
    } catch (error) {
      toast.error('Failed to delete FAQ');
      console.error('Error:', error);
    }
  }

  function handleEdit(faq: FAQ) {
    setSelectedFAQ(faq);
    setIsFormOpen(true);
  }

  function handleFormClose() {
    setSelectedFAQ(null);
    setIsFormOpen(false);
  }

  function handleFormSubmit() {
    loadFAQs();
    handleFormClose();
  }

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">FAQ Manager</h2>
        <TouchFriendlyButton
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add FAQ
        </TouchFriendlyButton>
      </div>

      <TouchFriendlyInput
        label="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        icon={<Search className="h-4 w-4 text-gray-400" />}
        placeholder="Search FAQs..."
      />

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="divide-y divide-gray-200">
          {filteredFAQs.map((faq) => (
            <div key={faq.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                  <p className="mt-2 text-sm text-gray-500">{faq.answer}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {faq.category}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {faq.service}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <TouchFriendlyButton
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(faq)}
                  >
                    <Pencil className="h-4 w-4" />
                  </TouchFriendlyButton>
                  <TouchFriendlyButton
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(faq.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </TouchFriendlyButton>
                </div>
              </div>
            </div>
          ))}
          {filteredFAQs.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-500">
              No FAQs found
            </div>
          )}
        </div>
      </div>

      <FAQForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={selectedFAQ}
      />
    </div>
  );
}