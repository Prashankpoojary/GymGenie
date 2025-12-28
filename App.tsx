
import React, { useState, useCallback } from 'react';
import { UserData, WorkoutPlan } from './types';
import { generateWorkoutPlan } from './services/geminiService';
import OnboardingForm from './components/OnboardingForm';
import CalendarView from './components/CalendarView';
import NutritionChat from './components/NutritionChat';
import { ChatIcon, DumbbellIcon, LoaderIcon } from './components/icons';

const App: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const handleOnboardingSubmit = useCallback(async (data: UserData) => {
    setIsLoading(true);
    setUserData(data);
    setError(null);
    try {
      const plan = await generateWorkoutPlan(data);
      setWorkoutPlan(plan);
    } catch (err) {
      console.error(err);
      setError('Failed to generate workout plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetApp = () => {
    setUserData(null);
    setWorkoutPlan(null);
    setError(null);
    setIsLoading(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-white h-full">
          <LoaderIcon className="w-16 h-16 animate-spin text-neon-green" />
          <p className="mt-4 text-xl">Generating your personalized plan...</p>
          <p className="text-gray-400">This might take a moment.</p>
        </div>
      );
    }

    if (error) {
       return (
        <div className="flex flex-col items-center justify-center text-center text-white h-full">
          <p className="text-red-500 text-xl">{error}</p>
          <button
            onClick={resetApp}
            className="mt-4 px-6 py-2 bg-neon-green text-dark-bg font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Start Over
          </button>
        </div>
       )
    }

    if (userData && workoutPlan) {
      return <CalendarView workoutPlan={workoutPlan} setWorkoutPlan={setWorkoutPlan} />;
    }

    return <OnboardingForm onSubmit={handleOnboardingSubmit} isLoading={isLoading} />;
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200 font-sans">
      <header className="bg-dark-card p-4 shadow-lg border-b border-dark-border">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
             <DumbbellIcon className="w-8 h-8 text-neon-green" />
            <h1 className="text-2xl font-bold text-white tracking-wider">GymGenie</h1>
          </div>
          {userData && (
             <button
              onClick={resetApp}
              className="px-4 py-2 text-sm bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
            >
              New Plan
            </button>
          )}
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-6 flex-grow">
        {renderContent()}
      </main>

      {userData && (
        <>
          <button 
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 bg-neon-green text-dark-bg p-4 rounded-full shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-neon-green"
            aria-label="Open Nutrition Chat"
          >
            <ChatIcon className="w-8 h-8"/>
          </button>
          <NutritionChat 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)}
            userData={userData}
          />
        </>
      )}
    </div>
  );
};

export default App;
   