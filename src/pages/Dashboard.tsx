import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-[#2a003f] text-white pt-16 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome to Plot Dashboard</h1>
        <p className="text-gray-400 mb-6">
          This is your workspace for creating and managing stories. 
          Here you can access your characters, scenes, and writing mode.
        </p>
        <div className="bg-[#1a001f] rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Your Stories</h2>
          <p className="text-gray-400">
            You haven't created any stories yet. Click the button below to start!
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-xl">
            Create New Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;