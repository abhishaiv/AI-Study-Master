import React, { useState } from 'react';
import { View } from '../types';
import { LayoutDashboard, BookOpen, PenTool, MessageSquare, Menu, X, BrainCircuit } from 'lucide-react';
import { APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onNavigate: (view: View) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button
      onClick={() => {
        onNavigate(view);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        currentView === view
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-white border-b z-20 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 font-bold text-gray-800">
           <BrainCircuit className="text-blue-600" />
           {APP_NAME}
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-10 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block ${
          isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3 border-b">
            <div className="bg-blue-100 p-2 rounded-lg">
                <BrainCircuit className="text-blue-600 w-6 h-6" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-gray-900">100x Mentor</h1>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem view="chat" icon={MessageSquare} label="Doubt Chat" />
            <NavItem view="assignment" icon={PenTool} label="Assignment Helper" />
            
            <div className="pt-6 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Study Modes
            </div>
            {/* Quick access simulated via changing view state logic in parent, keeping generic here */}
            <button 
                onClick={() => onNavigate('dashboard')} 
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
                <BookOpen size={20} />
                <span>Browse Topics</span>
            </button>
          </nav>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Abhishai</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0 p-4 lg:p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
};
