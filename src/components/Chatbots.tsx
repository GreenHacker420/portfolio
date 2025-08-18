'use client';
import dynamic from 'next/dynamic';

const CLIChatbot = dynamic(() => import('@/components/sections/CLIChatbot'), {
  ssr: false,
  loading: () => null,
});

const EnhancedChatbot = dynamic(() => import('@/components/sections/EnhancedChatbot'), {
  ssr: false,
  loading: () => null,
});

export default function Chatbots() {
  return (
    <>
      <CLIChatbot />
      <EnhancedChatbot />
    </>
  );
}

