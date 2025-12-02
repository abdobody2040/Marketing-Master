
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { storageService } from '../services/storageService';
import { generateDefinition } from '../services/geminiService';
import { Book, Template, UserProfile, MarketingModule } from '../types';
import jsPDF from 'jspdf';

interface LibraryProps {
    onBack: () => void;
    user?: UserProfile | null;
    modules?: MarketingModule[];
}

interface Flashcard {
    id: string;
    front: string; // Topic Name
    backContext: string; // Module Name / Context
    backDefinition?: string; // Loaded from AI
}

export const Library: React.FC<LibraryProps> = ({ onBack, user, modules = [] }) => {
    const [activeTab, setActiveTab] = useState<'BOOKS' | 'TEMPLATES' | 'FLASHCARDS'>('BOOKS');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Data State
    const [books, setBooks] = useState<Book[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);

    // Book State
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    // Flashcard State
    const [deck, setDeck] = useState<Flashcard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loadingDefinition, setLoadingDefinition] = useState(false);

    useEffect(() => {
        setBooks(storageService.getBooks());
        setTemplates(storageService.getTemplates());
    }, []);

    // Initialize Deck when tab changes
    useEffect(() => {
        if (activeTab === 'FLASHCARDS' && user && modules) {
            initializeDeck();
        }
    }, [activeTab, user, modules]);

    const initializeDeck = () => {
        if (!user || !modules) return;
        
        // 1. Get learned topics
        let topicsToPractice: { topic: string; module: MarketingModule }[] = [];

        if (user.completedTopics && user.completedTopics.length > 0) {
            user.completedTopics.forEach(ct => {
                // Robust split that handles potential extra colons in content
                const firstColon = ct.indexOf(':');
                if (firstColon > -1) {
                    const modId = ct.substring(0, firstColon);
                    const topicName = ct.substring(firstColon + 1);
                    
                    const mod = modules.find(m => m.id === modId);
                    if (mod && topicName) {
                        topicsToPractice.push({ topic: topicName, module: mod });
                    }
                }
            });
        }
        
        // Fallback: If no topics learned (or very few), grab random ones from Phase 1 to demo
        if (topicsToPractice.length < 3) {
            const p1 = modules.filter(m => m.phase === 1);
            p1.forEach(m => {
                m.topics.forEach(t => topicsToPractice.push({ topic: t, module: m }));
            });
        }

        // 2. Shuffle
        topicsToPractice = topicsToPractice.sort(() => Math.random() - 0.5);

        // 3. Create Cards (Limit to 20 to keep it manageable)
        const newDeck: Flashcard[] = topicsToPractice.slice(0, 20).map((item, idx) => ({
            id: `card-${idx}`,
            front: item.topic,
            backContext: item.module.title,
            backDefinition: undefined // Will load on flip
        }));

        setDeck(newDeck);
        setCurrentCardIndex(0);
        setIsFlipped(false);
    };

    const handleFlip = async () => {
        if (!isFlipped) {
            // Reveal Back
            setIsFlipped(true);
            
            // Load definition if missing
            const card = deck[currentCardIndex];
            if (!card.backDefinition) {
                setLoadingDefinition(true);
                const def = await generateDefinition(card.front, card.backContext);
                
                // Update deck with new definition to cache it
                setDeck(prevDeck => {
                    const newDeck = [...prevDeck];
                    newDeck[currentCardIndex] = { ...newDeck[currentCardIndex], backDefinition: def };
                    return newDeck;
                });
                setLoadingDefinition(false);
            }
        } else {
            setIsFlipped(false);
        }
    };

    const handleNextCard = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentCardIndex((prev) => (prev + 1) % deck.length);
        }, 300); // Wait for flip back animation
    };

    const handlePrevCard = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentCardIndex((prev) => (prev - 1 + deck.length) % deck.length);
        }, 300);
    };

    // Filter Books
    const filteredBooks = books.filter(b => 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleBookClick = (book: Book) => setSelectedBook(book);

    // --- DOWNLOAD LOGIC ---
    const downloadPDF = (template: Template) => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text(template.title, 20, 20);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        const contentStr = typeof template.content === 'string' ? template.content : JSON.stringify(template.content);
        const cleanContent = contentStr.replace(/#/g, ''); 
        const splitText = doc.splitTextToSize(cleanContent, 170);
        doc.text(splitText, 20, 40);
        doc.save(`${template.title.replace(/\s/g, '_')}.pdf`);
    };

    const downloadExcel = (template: Template) => {
        if (!Array.isArray(template.content)) return;
        const csvContent = "data:text/csv;charset=utf-8," + template.content.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${template.title.replace(/\s/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadWord = (template: Template) => {
        if (typeof template.content !== 'string') return;
        const htmlContent = `<html><body><h1>${template.title}</h1><pre>${template.content}</pre></body></html>`;
        const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${template.title.replace(/\s/g, '_')}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownload = (template: Template) => {
        if (typeof template.content === 'string' && template.content.startsWith('data:')) {
            const link = document.createElement("a");
            link.href = template.content;
            let ext: string = template.format;
            if(ext === 'excel') ext = 'xlsx';
            if(ext === 'doc') ext = 'docx';
            link.download = `${template.title.replace(/\s/g, '_')}.${ext}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        }
        switch(template.format) {
            case 'pdf': return downloadPDF(template);
            case 'excel': return downloadExcel(template);
            case 'doc': return downloadWord(template);
        }
    };
    
    const getFileIcon = (format: string) => {
        switch(format) {
            case 'excel': return { icon: 'fa-file-csv', color: 'text-green-600', bg: 'bg-green-100' };
            case 'doc': return { icon: 'fa-file-word', color: 'text-blue-600', bg: 'bg-blue-100' };
            case 'pdf': return { icon: 'fa-file-pdf', color: 'text-red-600', bg: 'bg-red-100' };
            default: return { icon: 'fa-file', color: 'text-slate-600', bg: 'bg-slate-100' };
        }
    };

    return (
        <div className="max-w-6xl mx-auto animate-fade-in pb-20">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Knowledge Library</h1>
                    <p className="text-slate-500 dark:text-slate-400">Curated resources & practice tools.</p>
                </div>
                
                <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                    <button 
                        onClick={() => setActiveTab('BOOKS')}
                        className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'BOOKS' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        <i className="fa-solid fa-book mr-2"></i> Books
                    </button>
                    <button 
                        onClick={() => setActiveTab('TEMPLATES')}
                        className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'TEMPLATES' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        <i className="fa-solid fa-folder-open mr-2"></i> Templates
                    </button>
                    <button 
                        onClick={() => setActiveTab('FLASHCARDS')}
                        className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'FLASHCARDS' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        <i className="fa-solid fa-layer-group mr-2"></i> Flashcards
                    </button>
                </div>
            </div>

            {/* --- BOOKS TAB --- */}
            {activeTab === 'BOOKS' && (
                <div className="space-y-6">
                    <div className="relative w-full max-w-md">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                        <input 
                            type="text" 
                            placeholder="Search title, author, or category..." 
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBooks.map((book) => (
                            <div 
                                key={book.id}
                                onClick={() => handleBookClick(book)}
                                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-indigo-400 transition-all cursor-pointer group overflow-hidden"
                            >
                                <div className="h-48 bg-slate-200 dark:bg-slate-700 relative">
                                    <img src={book.thumbnail} alt={book.title} className="w-full h-full object-cover" />
                                    <span className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider shadow-sm">
                                        {book.category}
                                    </span>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">{book.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{book.author}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {selectedBook && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedBook(null)}>
                            <div className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl relative" onClick={e => e.stopPropagation()}>
                                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedBook.title}</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{selectedBook.author}</p>
                                    </div>
                                    <button onClick={() => setSelectedBook(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                        <i className="fa-solid fa-xmark text-xl"></i>
                                    </button>
                                </div>
                                <div className="p-8">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="w-full md:w-1/3 shrink-0">
                                            <img src={selectedBook.thumbnail} alt={selectedBook.title} className="w-full rounded-lg shadow-lg mb-4" />
                                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                                                <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2 text-sm">Key Takeaways</h4>
                                                <ul className="list-disc list-inside space-y-1 text-sm text-indigo-800 dark:text-indigo-200">
                                                    {selectedBook.keyTakeaways.map((k, i) => <li key={i}>{k}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-2/3 prose prose-slate dark:prose-invert max-w-none">
                                            <ReactMarkdown>{selectedBook.summary}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- TEMPLATES TAB --- */}
            {activeTab === 'TEMPLATES' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => {
                        const style = getFileIcon(template.format);
                        return (
                            <div key={template.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col hover:shadow-lg transition-all">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className={`w-12 h-12 rounded-lg ${style.bg} dark:bg-opacity-20 flex items-center justify-center ${style.color}`}>
                                        <i className={`fa-solid ${style.icon} text-2xl`}></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1" title={template.title}>{template.title}</h3>
                                        <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded font-bold uppercase">{template.format}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">{template.description}</p>
                                <button onClick={() => handleDownload(template)} className="w-full bg-slate-900 dark:bg-slate-700 text-white font-bold py-3 rounded-lg hover:bg-indigo-600 dark:hover:bg-indigo-600 transition-colors text-sm flex items-center justify-center shadow-sm">
                                    <i className="fa-solid fa-download mr-2"></i> Download
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* --- FLASHCARDS TAB --- */}
            {activeTab === 'FLASHCARDS' && (
                <div className="flex flex-col items-center">
                    {deck.length === 0 ? (
                        <div className="text-center py-20">
                            <i className="fa-solid fa-box-open text-4xl text-slate-300 mb-4"></i>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">No Flashcards Yet</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Complete some lessons in the Quest Map to build your deck.</p>
                        </div>
                    ) : (
                        <div className="w-full max-w-2xl">
                            {/* Card Container */}
                            <div className="relative w-full h-80 perspective-1000 group cursor-pointer" onClick={handleFlip}>
                                <div className={`relative w-full h-full text-center transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                                    
                                    {/* FRONT */}
                                    <div className="absolute w-full h-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 backface-hidden">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Term</span>
                                        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white leading-tight">{deck[currentCardIndex].front}</h2>
                                        <p className="mt-8 text-sm text-slate-400 animate-pulse">Click to Flip</p>
                                    </div>

                                    {/* BACK */}
                                    <div className="absolute w-full h-full bg-indigo-600 text-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 backface-hidden rotate-y-180">
                                        <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-4">{deck[currentCardIndex].backContext}</span>
                                        
                                        {loadingDefinition ? (
                                            <div className="flex flex-col items-center">
                                                <i className="fa-solid fa-circle-notch fa-spin text-2xl mb-2"></i>
                                                <p className="text-sm text-indigo-100">Consulting AI...</p>
                                            </div>
                                        ) : (
                                            <p className="text-xl font-medium leading-relaxed max-w-lg">
                                                {deck[currentCardIndex].backDefinition || "Definition loaded."}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-between mt-8">
                                <button onClick={handlePrevCard} className="p-4 rounded-full bg-white dark:bg-slate-800 shadow hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors">
                                    <i className="fa-solid fa-arrow-left"></i>
                                </button>
                                
                                <div className="text-center">
                                    <p className="font-bold text-slate-800 dark:text-white">Card {currentCardIndex + 1} of {deck.length}</p>
                                    <button onClick={initializeDeck} className="text-xs text-indigo-500 font-bold hover:underline mt-1">Shuffle Deck</button>
                                </div>

                                <button onClick={handleNextCard} className="p-4 rounded-full bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 text-white transition-transform hover:-translate-y-1">
                                    <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
