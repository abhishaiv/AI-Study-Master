import React, { useEffect, useState } from 'react';
import { View, Topic, UserProgress } from '../types';
import { TOPICS } from '../constants';
import { getProgress } from '../services/storage';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PlayCircle, CheckCircle, Clock, Award, ArrowRight } from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: View, topicId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  if (!progress) return <div>Loading...</div>;

  const getScore = (topicId: string) => progress.quizScores[topicId] || 0;

  const chartData = TOPICS.map(topic => ({
    name: topic.title.split(':')[0].replace('Week ', 'W'), // Converts "Week 1: Title" to "W1"
    score: getScore(topic.id),
    fullTitle: topic.title
  }));

  // Fix: Explicitly type the values from the record to ensure reduce works correctly with arithmetic operations
  const quizScores = Object.values(progress.quizScores) as number[];
  const totalScore = quizScores.reduce((a, b) => a + b, 0);
  const overallMastery = Math.round(totalScore / (TOPICS.length || 1));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, Abhishai 👋</h1>
          <p className="text-gray-500 mt-1">You have completed {progress.completedTopics.length} of {TOPICS.length} topics.</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Overall Mastery</p>
            <p className="text-2xl font-bold text-gray-900">{overallMastery}%</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Topics List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <PlayCircle size={20} className="text-indigo-600"/> 
            Course Modules
          </h2>
          <div className="grid gap-4">
            {TOPICS.map((topic) => {
              const score = getScore(topic.id);
              const isCompleted = progress.completedTopics.includes(topic.id);
              return (
                <div key={topic.id} className="bg-white p-5 rounded-xl border hover:border-blue-300 transition-all shadow-sm group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            topic.category === 'RAG' ? 'bg-purple-100 text-purple-700' :
                            topic.category === 'Agents' ? 'bg-amber-100 text-amber-700' :
                            topic.category === 'Deployment' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                          {topic.category}
                        </span>
                        {isCompleted && <span className="flex items-center gap-1 text-xs text-green-600 font-medium"><CheckCircle size={12} /> Read</span>}
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{topic.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{topic.description}</p>
                    </div>
                    <div className="text-right">
                       <div className="text-2xl font-bold text-gray-900">{score}%</div>
                       <div className="text-xs text-gray-400">Mastery</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t flex gap-3">
                    <button 
                        onClick={() => onNavigate('topic', topic.id)}
                        className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Study Lesson
                    </button>
                    <button 
                        onClick={() => onNavigate('quiz', topic.id)}
                        className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Take Quiz
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Stats & Recent */}
        <div className="space-y-8">
            {/* Chart */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="font-bold text-gray-800 mb-6">Performance Trend</h3>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{ fill: '#f3f4f6' }}
                            />
                            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#22c55e' : entry.score > 50 ? '#3b82f6' : '#9ca3af'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-gray-500"/>
                    Recent Activity
                </h3>
                <div className="space-y-4">
                    {progress.recentActivity.length === 0 && <p className="text-sm text-gray-400">No recent activity.</p>}
                    {progress.recentActivity.slice(0, 5).map((activity, idx) => (
                        <div key={idx} className="flex gap-3 items-start pb-3 border-b last:border-0 last:pb-0">
                            <div className={`mt-1 w-2 h-2 rounded-full ${
                                activity.type === 'quiz' ? 'bg-green-500' : 'bg-blue-500'
                            }`} />
                            <div>
                                <p className="text-sm font-medium text-gray-800">{activity.details}</p>
                                <p className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-xl shadow-lg text-white">
                <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                <p className="text-blue-100 text-sm mb-4">Ask your AI mentor to clarify doubts or review your assignment.</p>
                <button 
                    onClick={() => onNavigate('chat')}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
                >
                    Start Chat <ArrowRight size={16} />
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};