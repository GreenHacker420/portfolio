"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus } from "lucide-react"

export function ArrayInput({ value = [], onChange, placeholder = "Add item..." }) {
    const [inputValue, setInputValue] = useState("")
    // Ensure value is always an array
    const items = Array.isArray(value) ? value : [];

    const addItem = () => {
        if (!inputValue.trim()) return
        onChange([...items, inputValue.trim()])
        setInputValue("")
    }

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index)
        onChange(newItems)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addItem()
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="bg-zinc-950 border-zinc-800 focus:ring-emerald-500/20"
                />
                <Button
                    type="button"
                    onClick={addItem}
                    variant="secondary"
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 rounded-md border border-zinc-800 bg-zinc-900/20">
                {items.length === 0 && (
                    <span className="text-zinc-500 text-sm italic p-1">No items added.</span>
                )}
                {items.map((item, index) => (
                    <Badge
                        key={index}
                        variant="secondary"
                        className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 flex items-center gap-1 pl-2 pr-1 py-1"
                    >
                        {item}
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="hover:text-red-400 transition-colors rounded-full p-0.5"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </Badge>
                ))}
            </div>
        </div>
    )
}
