import React, { useState } from 'react';
import { Sparkles, Loader2, X } from 'lucide-react';
import { generateFormData } from '../services/geminiService';
import { FormData } from '../types';

interface Props {
  onDataGenerated: (data: Partial<FormData>) => void;
}

const AiAssistant: React.FC<Props> = ({ onDataGenerated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await generateFormData(prompt);
      onDataGenerated(data);
      setIsOpen(false);
      setPrompt('');
    } catch (err) {
      setError("Failed to generate data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 z-50 no-print"
      >
        <Sparkles size={20} />
        <span className="font-medium">Auto-fill with AI</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center text-white">
          <h3 className="font-bold flex items-center gap-2">
            <Sparkles size={18} /> AI Assistant
          </h3>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 text-sm mb-4">
            Describe what you need to order, and Gemini will fill out the form for you.
          </p>
          
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[100px] resize-none"
            placeholder="e.g., I need 5 boxes of A4 paper, 10 black markers, and a whiteboard cleaner for the HR department."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          {error && (
            <div className="text-red-500 text-xs mt-2 bg-red-50 p-2 rounded border border-red-100">
              {error}
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              {loading ? 'Thinking...' : 'Generate Form'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;