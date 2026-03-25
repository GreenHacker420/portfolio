"use client";
import React from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Code2, Star, Users, GitFork } from "lucide-react";
import { AnimatedNumber } from "./AnimatedNumber";

export const ProfileCard = ({ profile, publicRepos, followers, following, totalStars }) => {
    if (!profile) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-neutral-900/80 to-neutral-950/90 border border-white/5 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group hover:border-neon-green/20 transition-all duration-500 h-full"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-green/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="flex items-center gap-4 mb-5 relative z-10">
                <div className="relative flex-shrink-0">
                    <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-16 h-16 rounded-2xl border-2 border-neon-green/20 group-hover:border-neon-green/50 transition-colors"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-neon-green rounded-full border-2 border-neutral-900 flex items-center justify-center">
                        <div className="w-2 h-2 bg-neutral-900 rounded-full" />
                    </div>
                </div>
                <div className="min-w-0">
                    <h3 className="text-xl font-bold text-white truncate">{profile.name}</h3>
                    {profile.location && (
                        <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 flex-shrink-0" /> {profile.location}
                        </p>
                    )}
                    {profile.memberSince && (
                        <p className="text-xs text-neutral-600 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 flex-shrink-0" /> Member since {profile.memberSince}
                        </p>
                    )}
                </div>
            </div>

            {profile.bio && (
                <p className="text-sm text-neutral-400 mb-5 leading-relaxed relative z-10 line-clamp-2">{profile.bio}</p>
            )}

            <div className="grid grid-cols-4 gap-2 relative z-10">
                {[
                    { label: 'Repos', value: publicRepos, icon: Code2 },
                    { label: 'Stars', value: totalStars, icon: Star },
                    { label: 'Followers', value: followers, icon: Users },
                    { label: 'Contrib To', value: profile.contributedTo, icon: GitFork },
                ].map(item => (
                    <div key={item.label} className="text-center py-2.5 px-1 rounded-xl bg-white/[3%] hover:bg-white/[6%] transition-colors">
                        <item.icon className="w-3.5 h-3.5 mx-auto mb-1 text-neutral-500" />
                        <p className="text-lg font-bold text-white leading-none">
                            <AnimatedNumber value={item.value || 0} duration={1.2} />
                        </p>
                        <p className="text-[9px] text-neutral-600 mt-0.5 uppercase tracking-wider">{item.label}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
