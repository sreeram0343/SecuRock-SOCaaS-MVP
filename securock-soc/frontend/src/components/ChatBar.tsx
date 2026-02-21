'use client';

import { useState } from 'react';
import { Send, Bot } from 'lucide-react';

export default function ChatBar() {
    const [query, setQuery] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        alert(`AI Analyst Query: ${query}`);
        setQuery('');
    };

    return (
        <form onSubmit={handleSend} className="relative w-full max-w-3xl mx-auto mt-8">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Bot className="w-5 h-5" />
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask the AI Analyst about alerts or hosts..."
                className="w-full bg-card border border-border rounded-full py-4 pl-12 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-lg"
            />
            <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
                <Send className="w-4 h-4" />
            </button>
        </form>
    );
}
