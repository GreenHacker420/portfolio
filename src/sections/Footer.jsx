import React from "react";
import { Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full py-10 text-center text-neutral-500 text-sm bg-black relative z-10">
            <p>&copy; {new Date().getFullYear()} Harsh. All rights reserved.</p>
            <p className="mt-2 text-xs text-neutral-600">Built with <Heart className="inline text-red-500" /> by Harsh</p>
        </footer>
    );
}
