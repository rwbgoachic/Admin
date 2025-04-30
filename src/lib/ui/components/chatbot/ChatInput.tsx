import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../button';
import { Input } from '../input';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(message);
    setMessage('');
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
      <div className="flex space-x-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your question..."
          disabled={disabled}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={disabled || !message.trim()}
          className="inline-flex items-center"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}