'use client';

import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import type { CertificationItem } from '@/types/experience.d';
import { formatDate } from './utils';

interface CertificationsTabProps {
  certifications: CertificationItem[];
  swipeDirection: 'left' | 'right' | null;
}

export function CertificationsTab({
  certifications,
  swipeDirection,
}: CertificationsTabProps) {
  return (
    <motion.div
      key="certifications"
      initial={{ opacity: 0, x: swipeDirection === 'left' ? 50 : swipeDirection === 'right' ? -50 : 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: swipeDirection === 'left' ? -50 : 50 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <SectionHeader title="Certifications" color="neon-blue" />

      {certifications.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certifications yet"
          description="Certifications will appear here once added."
          color="neon-blue"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {certifications.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(31, 111, 235, 0.2)' }}
              className="bg-github-light rounded-lg p-4 sm:p-6 border border-github-border hover:border-neon-blue/50 transition-all"
            >
              <h4 className="font-semibold text-white text-base sm:text-lg leading-tight">
                {cert.name}
              </h4>
              <p className="text-neon-blue text-sm sm:text-base mt-1">{cert.issuer}</p>
              <div className="mt-3 text-github-text text-xs sm:text-sm flex flex-wrap gap-2 items-center">
                <span className="bg-github-dark/50 px-2 py-1 rounded-full">
                  Issued {formatDate(cert.issueDate)}
                </span>
                {cert.credentialId && (
                  <span className="bg-github-dark px-2 py-1 rounded-full truncate max-w-[150px]">
                    ID: {cert.credentialId}
                  </span>
                )}
              </div>
              {cert.credentialUrl && (
                <div className="mt-4">
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-white px-3 py-1.5 border border-neon-blue/50 rounded-lg hover:bg-neon-blue/10 transition-colors"
                  >
                    View credential
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default CertificationsTab;
