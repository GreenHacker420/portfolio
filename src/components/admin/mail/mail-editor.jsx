"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Bold, Italic, Underline, Strikethrough,
    AlignLeft, AlignCenter, AlignRight,
    List, ListOrdered, Link as LinkIcon, Image as ImageIcon,
    Smile, Paperclip, MoreHorizontal, Wand2, ChevronDown
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const SIGNATURE = "<br><br>Best regards,<br><b>Green Hacker</b><br>Full Stack Developer";

const TEMPLATES = [
    {
        label: "Meeting Request",
        subject: "Meeting Request: [Topic]",
        body: `Hi [Name],<br><br>I would like to request a brief meeting to discuss [Topic].<br><br>Are you available on [Date/Time]?${SIGNATURE}`
    },
    {
        label: "Follow Up",
        subject: "Follow Up: Previous discussion",
        body: `Hi [Name],<br><br>I just wanted to follow up on our previous conversation regarding [Topic].<br><br>Is there any update?${SIGNATURE}`
    },
    {
        label: "Thank You",
        subject: "Thank you for your time",
        body: `Hi [Name],<br><br>Thank you for taking the time to meet with me today. I really appreciate your insights.${SIGNATURE}`
    },
    {
        label: "Project Update",
        subject: "Project Update: [Project Name]",
        body: `Hi Team,<br><br>Here is the latest update on [Project Name]:<br><br><ul><li>Status: On Track</li><li>Next Steps: [Steps]</li></ul>${SIGNATURE}`
    }
];

export function MailEditor({ value, onChange, placeholder, onTemplateSelect, className, minHeight = "200px" }) {
    const textareaRef = useRef(null);

    const insertTag = (tag) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        // Basic tag insertion
        let newText;
        if (tag === 'ul') {
            newText = text.substring(0, start) + "\n<ul>\n  <li></li>\n</ul>\n" + text.substring(end);
        } else if (tag === 'ol') {
            newText = text.substring(0, start) + "\n<ol>\n  <li></li>\n</ol>\n" + text.substring(end);
        } else {
            newText = text.substring(0, start) + `<${tag}>` + text.substring(start, end) + `</${tag}>` + text.substring(end);
        }

        const event = { target: { value: newText } };
        onChange(event);

        // Restore focus
        setTimeout(() => textarea.focus(), 0);
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertTag('b')}>
                        <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertTag('i')}>
                        <Italic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => insertTag('ul')}>
                        <List className="h-4 w-4" />
                    </Button>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-2 bg-zinc-900 border-zinc-800">
                            <Wand2 className="h-3 w-3" />
                            Templates
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800 text-zinc-100">
                        {TEMPLATES.map((t) => (
                            <DropdownMenuItem
                                key={t.label}
                                className="focus:bg-zinc-900"
                                onClick={() => onTemplateSelect && onTemplateSelect(t)}
                            >
                                {t.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Textarea
                ref={textareaRef}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="min-h-[200px] w-full resize-none border-0 bg-transparent p-0 focus-visible:ring-0 text-base leading-relaxed"
                style={{ minHeight }}
            />
        </div>
    );
}