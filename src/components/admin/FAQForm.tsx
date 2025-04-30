import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { TouchFriendlyButton } from '../shared/TouchFriendlyButton';
import { TouchFriendlyInput } from '../shared/TouchFriendlyInput';
import { supabase } from '../../lib/supabase';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  service: string;
}

interface FAQFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  initialData?: FAQ | null;
}

export function FAQForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: FAQFormProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [service, setService] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setQuestion(initialData.question);
      setAnswer(initialData.answer);
      setCategory(initialData.category);
      setService(initialData.service);
    } else {
      setQuestion('');
      setAnswer('');
      setCategory('');
      setService('');
    }
    setErrors({});
  }, [initialData]);

  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (!question.trim()) {
      newErrors.question = 'Question is required';
    }
    if (!answer.trim()) {
      newErrors.answer = 'Answer is required';
    }
    if (!category.trim()) {
      newErrors.category = 'Category is required';
    }
    if (!service.trim()) {
      newErrors.service = 'Service is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const data = {
        question,
        answer,
        category,
        service,
      };

      if (initialData) {
        const { error } = await supabase
          .from('faqs')
          .update(data)
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success('FAQ updated successfully');
      } else {
        const { error } = await supabase
          .from('faqs')
          .insert([data]);

        if (error) throw error;
        toast.success('FAQ created successfully');
      }

      onSubmit();
    } catch (error) {
      toast.error(
        initialData
          ? 'Failed to update FAQ'
          : 'Failed to create FAQ'
      );
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex justify-between items-center mb-4"
                >
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {initialData ? 'Edit' : 'Add'} FAQ
                  </h3>
                  <TouchFriendlyButton
                    variant="secondary"
                    size="sm"
                    onClick={onClose}
                  >
                    <X className="h-4 w-4" />
                  </TouchFriendlyButton>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <TouchFriendlyInput
                    label="Question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    error={errors.question}
                    required
                  />

                  <TouchFriendlyInput
                    label="Answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    error={errors.answer}
                    multiline
                    required
                  />

                  <TouchFriendlyInput
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    error={errors.category}
                    required
                  />

                  <TouchFriendlyInput
                    label="Service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    error={errors.service}
                    required
                  />

                  <div className="flex justify-end space-x-2 mt-6">
                    <TouchFriendlyButton
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                    >
                      Cancel
                    </TouchFriendlyButton>
                    <TouchFriendlyButton
                      type="submit"
                      disabled={submitting}
                    >
                      {submitting ? 'Saving...' : 'Save'}
                    </TouchFriendlyButton>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}