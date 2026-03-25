"use client";
import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

class SectionErrorFallback extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error(`Error loading section ${this.props.section || 'Unknown'}:`, error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8 text-neutral-400 bg-neutral-900/50 rounded-3xl border border-white/5 backdrop-blur-sm">
                    <div className="p-4 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6">
                        <AlertTriangle className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">System Malfunction</h3>
                    <p className="text-sm text-center max-w-md mb-8 text-neutral-500 leading-relaxed">
                        The module <span className="text-neon-green font-mono">{this.props.section}</span> failed to initialize. 
                        A temporary breach has been detected in the rendering pipeline.
                    </p>
                    <Button 
                        variant="outline" 
                        className="border-white/10 text-white hover:bg-white/5 flex items-center gap-2"
                        onClick={() => this.setState({ hasError: false })}
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Attempt Re-sync
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default SectionErrorFallback;
