import { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Button } from '../button';
import { searchFAQs } from '../../../lib/faq';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSend(message: string) {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const faqs = await searchFAQs(message);
      let response = "I couldn't find a relevant answer. Please try rephrasing your question.";

      if (faqs.length > 0) {
        // Use the most relevant FAQ
        response = faqs[0].answer;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error. Please try again later.",
        isUser: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full p-4 shadow-lg"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-medium">Paysurity Assistant</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            isUser={message.isUser}
          />
        ))}
        {loading && (
          <ChatMessage message="Thinking..." />
        )}
      </div>

      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
}