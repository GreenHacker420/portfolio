'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Terminal } from 'lucide-react';

// Dynamically import the Chatbot component with SSR disabled
const DynamicChatbot = dynamic(() => import('./Chatbot'), {
  ssr: false,
  loading: () => (
    <div className="fixed bottom-8 right-8 bg-neon-green text-black h-12 w-12 rounded-full flex items-center justify-center shadow-lg z-50">
      <Terminal size={20} />
    </div>
  )
});

const ChatbotWrapper = () => {
  return (
    <Suspense fallback={
      <div className="fixed bottom-8 right-8 bg-neon-green text-black h-12 w-12 rounded-full flex items-center justify-center shadow-lg z-50">
        <Terminal size={20} />
      </div>
    }>
      <DynamicChatbot />
    </Suspense>
  );
};

export default ChatbotWrapper;
