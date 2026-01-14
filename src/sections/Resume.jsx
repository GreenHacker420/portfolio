"use client";
import React from "react";
import { Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Resume() {
    return (
        <section className="py-20 bg-neutral-950/50 relative z-10 border-t border-white/5" id="resume">
            <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to work properly?</h2>
                <p className="text-neutral-400 max-w-2xl mx-auto mb-10 text-lg">
                    Grab my resume to learn more about my experience, skills, and the value I can bring to your team.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        size="lg"
                        className="bg-neon-green text-black hover:bg-neon-green/90 font-bold px-8 h-14 text-lg"
                        onClick={() => window.open('/resume.pdf', '_blank')}
                    >
                        <Download className="mr-2 h-5 w-5" />
                        Download CV
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        className="border-white/10 text-white hover:bg-white/5 px-8 h-14 text-lg"
                        onClick={() => window.open('/resume-preview', '_blank')}
                    >
                        <Eye className="mr-2 h-5 w-5" />
                        Preview
                    </Button>
                </div>
            </div>
        </section>
    );
}
