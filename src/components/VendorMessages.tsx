import { useState } from 'react';
import { Message } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ArrowLeft, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface VendorMessagesProps {
  messages: Message[];
  onSendReply?: (messageId: string, reply: string) => void;
}

export function VendorMessages({ messages, onSendReply }: VendorMessagesProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [reply, setReply] = useState('');

  const handleSendReply = () => {
    if (!reply.trim() || !selectedMessage) return;

    if (onSendReply) {
      onSendReply(selectedMessage.id, reply);
    }
    toast.success('Reply sent successfully!');
    setReply('');
    setSelectedMessage(null);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (selectedMessage) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => setSelectedMessage(null)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to messages
        </Button>

        <Card className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-purple-100 text-purple-600">
                {selectedMessage.senderName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm">{selectedMessage.senderName}</p>
              <p className="text-xs text-gray-500">{formatTimestamp(selectedMessage.timestamp)}</p>
            </div>
          </div>
          <p className="text-sm bg-gray-50 p-3 rounded-lg">
            {selectedMessage.message}
          </p>
        </Card>

        <div>
          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your reply..."
            rows={4}
            className="mb-3"
          />
          <Button onClick={handleSendReply} className="w-full" disabled={!reply.trim()}>
            <Send className="w-4 h-4 mr-2" />
            Send Reply
          </Button>
        </div>

        <Card className="p-4 bg-purple-50 border-purple-200">
          <p className="text-sm">
            💡 <strong>Pro tip:</strong> Quick responses improve your response time rating and increase booking chances!
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2>Messages</h2>
        <p className="text-sm text-gray-600">
          {messages.filter(m => !m.read).length} unread message{messages.filter(m => !m.read).length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-2">
        {messages.length > 0 ? (
          messages.map((message) => (
            <Card
              key={message.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                !message.read ? 'border-l-4 border-l-purple-600' : ''
              }`}
              onClick={() => setSelectedMessage(message)}
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    {message.senderName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm">{message.senderName}</p>
                    {!message.read && (
                      <Badge variant="secondary" className="shrink-0 text-xs px-2">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {message.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              💬
            </div>
            <p>No messages yet</p>
            <p className="text-sm mt-2">Messages from clients will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
