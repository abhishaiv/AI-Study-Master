import React, { useState } from 'react';
import { reviewAssignmentDraft } from '../services/gemini';
import { FileText, ArrowRight, CheckSquare, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const AssignmentHelper: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [draft, setDraft] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!prompt.trim() || !draft.trim()) return;
    
    setLoading(true);
    try {
        const result = await reviewAssignmentDraft(prompt, draft);
        setFeedback(result);
    } catch (e) {
        console.error(e);
        setFeedback("Error generating feedback.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-2xl text-white shadow-lg">
            <h1 className="text-3xl font-bold mb-2">Assignment Helper</h1>
            <p className="text-purple-100">Get instant feedback on your code or essays. Remember: I won't write it for you, but I'll make sure it's excellent.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Assignment Prompt</label>
                    <textarea 
                        className="w-full h-32 p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Paste the homework question here..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Draft / Code</label>
                    <textarea 
                        className="w-full h-64 p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                        placeholder="Paste your attempt here..."
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleReview}
                    disabled={loading || !prompt || !draft}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin"/> : <CheckSquare />} 
                    {loading ? 'Reviewing...' : 'Review My Work'}
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 min-h-[500px]">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText className="text-purple-600" />
                    AI Feedback
                </h3>
                {feedback ? (
                    <div className="prose prose-sm max-w-none text-gray-700">
                        <ReactMarkdown>{feedback}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-8">
                        <div className="bg-gray-50 p-6 rounded-full mb-4">
                            <ArrowRight size={32} className="opacity-20" />
                        </div>
                        <p>Fill out the forms on the left and hit review to see magic happen.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
