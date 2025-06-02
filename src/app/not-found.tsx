'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-github-dark text-github-text flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Animation */}
          <motion.div
            className="text-8xl font-bold text-neon-green mb-8"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.5, 
              type: "spring", 
              stiffness: 200 
            }}
          >
            404
          </motion.div>

          {/* Error Message */}
          <motion.h1
            className="text-3xl font-bold text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Page Not Found
          </motion.h1>

          <motion.p
            className="text-github-text mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Oops! The page you're looking for doesn't exist. 
            It might have been moved, deleted, or you entered the wrong URL.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button asChild className="bg-neon-green text-black hover:bg-neon-green/90">
              <Link href="/" className="flex items-center gap-2">
                <Home size={18} />
                Go Home
              </Link>
            </Button>

            <Button 
              variant="outline" 
              asChild 
              className="border-github-border text-github-text hover:bg-github-light"
            >
              <Link href="/#contact" className="flex items-center gap-2">
                <Search size={18} />
                Contact Support
              </Link>
            </Button>
          </motion.div>

          {/* Back Button */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-github-text hover:text-white flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Go Back
            </Button>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-neon-green rounded-full opacity-50"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <motion.div
            className="absolute top-1/3 right-1/4 w-1 h-1 bg-neon-blue rounded-full opacity-50"
            animate={{
              scale: [1, 2, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
