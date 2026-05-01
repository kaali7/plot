import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { StoryProvider } from './context/StoryContext';
import { WritingProvider } from './context/WritingContext';
import { UIStateProvider } from './context/UIStateContext';
import { UnifiedStoryDashboard } from './components/dashboard/UnifiedStoryDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <nav className="bg-[#1a001f] border-b border-purple-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-xl font-bold text-white hover:text-purple-300 transition-colors">
                    Plot Dashboard
                  </Link>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <Link 
                      to="/stories/1" 
                      className="px-3 py-2 rounded-md text-sm font-medium text-purple-300 hover:bg-purple-900/20 hover:text-purple-200"
                    >
                      Story Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center text-white mb-8">Plot - Unified Story Dashboard</h1>
          <div className="text-center text-purple-400">
            <p>This is a demonstration of the Unified Story Dashboard implementation</p>
            <p className="mt-4">
              <Link 
                to="/stories/demo-story-id" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Launch Dashboard Demo
              </Link>
            </p>
          </div>
        </div>
        
        <Routes>
          <Route 
            path="/stories/:storyId" 
            element={
              <StoryProvider storyId={useParams<{storyId: string}>().storyId || 'demo-story-id'}>
                <WritingProvider>
                  <UIStateProvider>
                    <UnifiedStoryDashboard />
                  </UIStateProvider>
                </WritingProvider>
              </StoryProvider>
            } 
          />
          <Route 
            path="*" 
            element={
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-white">Welcome to Plot</h2>
                <p className="text-purple-300 mt-4">Your unified story development environment</p>
                <Link 
                  to="/stories/demo-story-id" 
                  className="mt-6 inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;