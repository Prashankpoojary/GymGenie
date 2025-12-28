
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UserData, ChatMessage } from '../types';
import { createNutritionChat, getNutritionistResponse } from '../services/geminiService';
import { CloseIcon, SendIcon } from './icons';
import type { Chat } from '@google/genai';


interface NutritionChatProps {
    isOpen: boolean;
    onClose: () => void;
    userData: UserData;
}

const NutritionChat: React.FC<NutritionChatProps> = ({ isOpen, onClose, userData }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            chatRef.current = createNutritionChat(userData);
            setMessages([]);
        }
    }, [isOpen, userData]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    const handleSend = useCallback(async () => {
        if (input.trim() === '' || !chatRef.current) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const responseText = await getNutritionistResponse(chatRef.current, messages, input);
            const modelMessage: ChatMessage = { role: 'model', text: responseText };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error('Nutritionist chat error:', error);
            const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, I am having trouble responding right now.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    }, [input, messages]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
            <div className="fixed bottom-0 right-0 top-0 sm:top-auto sm:bottom-6 sm:right-6 w-full sm:w-[400px] h-full sm:h-[600px] bg-dark-card shadow-2xl rounded-lg flex flex-col transform transition-transform duration-300">
                <header className="p-4 bg-gray-800 flex justify-between items-center rounded-t-lg">
                    <h3 className="text-lg font-bold text-white">Nutritionist Chat</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>
                
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-neon-green text-dark-bg' : 'bg-gray-700 text-white'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                           <div className="flex justify-start">
                             <div className="bg-gray-700 text-white p-3 rounded-lg">
                               <div className="flex items-center space-x-1">
                                 <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                 <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                 <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                               </div>
                             </div>
                           </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <footer className="p-4 border-t border-dark-border">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSend()}
                            placeholder="Ask about your diet..."
                            className="flex-1 bg-gray-700 text-white p-3 rounded-lg border border-dark-border focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
                            disabled={isTyping}
                        />
                        <button onClick={handleSend} disabled={isTyping || !input.trim()} className="p-3 bg-neon-green text-dark-bg rounded-lg disabled:opacity-50 hover:opacity-90">
                            <SendIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default NutritionChat;
   