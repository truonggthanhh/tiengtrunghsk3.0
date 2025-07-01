import React from 'react';
import { cn } from '@/lib/utils';
import { Bot, User, AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export interface Message {
  role: 'user' | 'model' | 'error';
  parts: { text: string }[];
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isError = message.role === 'error';

  return (
    <div
      className={cn(
        'flex items-start gap-3 my-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className={cn(isError && 'bg-destructive/20')}>
            {isError ? <AlertTriangle className="text-destructive" /> : <Bot />}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'p-3 rounded-lg max-w-sm md:max-w-md lg:max-w-lg whitespace-pre-wrap break-words',
          isUser
            ? 'bg-primary text-primary-foreground'
            : isError
            ? 'bg-destructive/10 text-destructive'
            : 'bg-muted'
        )}
      >
        {message.parts[0].text}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;