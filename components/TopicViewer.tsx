import React, { useEffect, useState } from 'react';
import { Topic, LessonContent } from '../types';
import { generateLessonContent } from '../services/gemini';
import { markTopicRead } from '../services/storage';
import { BookOpen, CheckCircle, AlertTriangle, Code, List } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Actually, let's not introduce a new dependency if we can avoid it, but simple rendering is fine. I'll stick to basic JSX mapping for the JSON structure.

interface TopicViewerProps {
  topic: Topic;
}

export const TopicViewer: React.FC<TopicViewerProps> = ({ topic }) => {
  const [content, setContent] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        // In a real app we might cache this response
        const data = await generateLessonContent(topic.title, topic.contextData);
        setContent(data);
        markTopicRead(topic.id);
      } catch (error) {
        console.error("Failed to generate lesson", error);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [topic]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Generating lesson content with Gemini...</p>
      </div>
    );
  }

  if (!content) return <div>Error loading content.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <div className="border-b pb-6">
        <span className="text-blue-600 font-semibold tracking-wide text-sm uppercase">{topic.category}</span>
        <h1 className="text-4xl font-bold text-gray-900 mt-2">{topic.title}</h1>
        <p className="text-xl text-gray-600 mt-4 leading-relaxed">{content.overview}</p>
      </div>

      {/* Key Concepts */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="text-blue-600" /> Key Concepts
        </h2>
        <div className="grid gap-6">
          {content.keyConcepts.map((concept, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{concept.title}</h3>
              <p className="text-gray-700 leading-relaxed">{concept.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Code Example */}
      {content.codeExample && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Code className="text-purple-600" /> Example
          </h2>
          <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto">
            <pre className="text-gray-100 font-mono text-sm whitespace-pre-wrap">{content.codeExample}</pre>
          </div>
        </section>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Pitfalls */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" /> Common Pitfalls
          </h2>
          <ul className="space-y-3">
            {content.pitfalls.map((pitfall, idx) => (
              <li key={idx} className="flex gap-3 text-gray-700 bg-amber-50 p-4 rounded-lg border border-amber-100">
                <span className="text-amber-500 font-bold">•</span>
                {pitfall}
              </li>
            ))}
          </ul>
        </section>

        {/* Checklist */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <List className="text-green-600" /> Mastery Checklist
          </h2>
          <ul className="space-y-3">
            {content.checklist.map((item, idx) => (
              <li key={idx} className="flex gap-3 text-gray-700 bg-green-50 p-4 rounded-lg border border-green-100">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

    </div>
  );
};
