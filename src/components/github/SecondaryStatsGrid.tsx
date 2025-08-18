'use client';

import React from 'react';
import { Calendar, TrendingUp, Award, Clock } from 'lucide-react';
import StatCard from './StatCard';

type Props = {
  stats?: {
    yearOfCoding?: number;
    currentStreak?: number;
    contributedRepos?: number;
  } | null;
  profile?: { created_at: string } | null;
};

export default function SecondaryStatsGrid({ stats, profile }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={<Calendar className="text-orange-400" size={16} />} label="Years Coding" value={stats?.yearOfCoding || 0} suffix="+" />
      <StatCard icon={<TrendingUp className="text-green-400" size={16} />} label="Current Streak" value={stats?.currentStreak || 0} suffix=" days" />
      <StatCard icon={<Award className="text-cyan-400" size={16} />} label="Original Repos" value={stats?.contributedRepos || 0} />
      <StatCard icon={<Clock className="text-indigo-400" size={16} />} label="Member Since" value={profile ? new Date(profile.created_at).getFullYear() : 0} suffix="" compact={false} />
    </div>
  );
}

