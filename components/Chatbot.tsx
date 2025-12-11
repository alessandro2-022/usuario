import React, { useState, useRef, useEffect } from 'react';
import type { Message, UserLocation } from '../types';
import { getGeminiResponse, GeminiMode } from '../services/geminiService';
import { CloseIcon, SendIcon } from '../constants';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation: UserLocation | null;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, userLocation }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Olá! Sou o assistente Goly. Como posso ajudar você hoje?", sender: 'bot' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const [geminiMode, setGeminiMode] = useState<GeminiMode>('chat');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: userInput, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    const currentMode = isThinkingMode ? 'thinking' : geminiMode;
    const response = await getGeminiResponse(userInput, currentMode, userLocation);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text,
      sender: 'bot',
      sources: response.sources
    };
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };
  
  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGeminiMode(e.target.value as GeminiMode);
  };

  return (
    <div className={`fixed bottom-0 right-0 z-30 w-full h-full md:w-96 md:h-4/5 md:max-h-[700px] md:bottom-5 md:right-5 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="bg-white h-full w-full rounded-t-lg md:rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <header className="bg-goly-blue text-white p-4 flex justify-between items-center rounded-t-lg md:rounded-t-lg">
          <h3 className="text-xl font-bold">Goly Assistente</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-goly-blue-dark">
            <CloseIcon className="h-6 w-6" />
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-xl px-4 py-2 max-w-xs ${msg.sender === 'user' ? 'bg-goly-blue text-white' : 'bg-gray-200 text-goly-dark'}`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-300">
                    <h4 className="text-xs font-bold mb-1">Fontes:</h4>
                    <ul className="list-disc list-inside text-xs">
                      {msg.sources.map((source, index) => (
                        <li key={index}>
                          <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-goly-blue hover:underline">
                            {source.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
                <div className="rounded-xl px-4 py-2 max-w-xs bg-gray-200 text-goly-dark animate-pulse">
                    Digitando...
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
            <div className="flex items-center space-x-2 mb-2">
                <select value={geminiMode} onChange={handleModeChange} disabled={isThinkingMode} className="text-sm p-1 border rounded bg-gray-50 disabled:bg-gray-200">
                    <option value="chat">Chat</option>
                    <option value="search">Busca Web</option>
                    <option value="maps">Busca Mapas</option>
                </select>
                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="thinking-mode" checked={isThinkingMode} onChange={(e) => setIsThinkingMode(e.target.checked)} />
                    <label htmlFor="thinking-mode" className="text-sm font-medium">Modo Avançado</label>
                </div>
            </div>
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Pergunte algo..."
                    className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-goly-blue"
                />
                <button type="submit" disabled={isLoading} className="bg-goly-yellow text-goly-dark p-3 rounded-full hover:bg-goly-yellow-dark disabled:bg-gray-300">
                    <SendIcon className="h-6 w-6" />
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;