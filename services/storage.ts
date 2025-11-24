import { UserProgress, QuizResult } from '../types';
import { INITIAL_PROGRESS } from '../constants';

const STORAGE_KEY = '100x_study_mentor_progress';

export const getProgress = (): UserProgress => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return INITIAL_PROGRESS;
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_PROGRESS;
  }
};

export const saveProgress = (progress: UserProgress) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

export const saveQuizResult = (result: QuizResult) => {
  const progress = getProgress();
  
  // Update best score
  const currentBest = progress.quizScores[result.topicId] || 0;
  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  
  if (percentage > currentBest) {
    progress.quizScores[result.topicId] = percentage;
  }

  // Add to activity
  progress.recentActivity.unshift({
    type: 'quiz',
    topicId: result.topicId,
    timestamp: Date.now(),
    details: `Scored ${percentage}% on topic`
  });

  // Cap activity log
  if (progress.recentActivity.length > 20) {
    progress.recentActivity.pop();
  }

  saveProgress(progress);
};

export const markTopicRead = (topicId: string) => {
  const progress = getProgress();
  if (!progress.completedTopics.includes(topicId)) {
    progress.completedTopics.push(topicId);
    progress.recentActivity.unshift({
      type: 'study',
      topicId,
      timestamp: Date.now(),
      details: 'Completed study session'
    });
    saveProgress(progress);
  }
};
