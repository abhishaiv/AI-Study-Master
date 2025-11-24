import React, { useState } from 'react';
import { Key } from 'lucide-react';
import { APP_NAME } from '../constants';

interface APIKeySelectorProps {
  onSelect: (key: string) => void;
}

export const APIKeySelector: React.FC<APIKeySelectorProps> = ({ onSelect }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSelect(key.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to {APP_NAME}</h1>
            <p className="text-gray-500">Please enter your Gemini API Key to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google AI Studio Key</label>
                <input 
                    type="password" 
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="AIzaSy..."
                    required
                />
            </div>
            <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
                Start Learning
            </button>
        </form>
        
        <p className="text-xs text-center text-gray-400">
            Your key is used locally for this session and connects directly to Google AI Studio.
        </p>
      </div>
    </div>
  );
};
