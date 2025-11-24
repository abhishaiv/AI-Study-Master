import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TopicViewer } from './components/TopicViewer';
import { QuizRunner } from './components/QuizRunner';
import { ChatInterface } from './components/ChatInterface';
import { AssignmentHelper } from './components/AssignmentHelper';
import { View } from './types';
import { TOPICS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const handleNavigate = (view: View, topicId?: string) => {
    setCurrentView(view);
    if (topicId) {
      setSelectedTopicId(topicId);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'topic':
        const topic = TOPICS.find(t => t.id === selectedTopicId);
        return topic ? <TopicViewer topic={topic} /> : <div className="p-8">Topic not found</div>;
      case 'quiz':
        const quizTopic = TOPICS.find(t => t.id === selectedTopicId);
        return quizTopic ? <QuizRunner topic={quizTopic} onComplete={() => handleNavigate('dashboard')} /> : <div className="p-8">Topic not found for quiz</div>;
      case 'chat':
        return <ChatInterface />;
      case 'assignment':
        return <AssignmentHelper />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={handleNavigate}>
      {renderContent()}
    </Layout>
  );
};

export default App;