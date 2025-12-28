
import React, { useState } from 'react';
import { UserData, Goal } from '../types';
import { GOALS } from '../constants';
import { LoaderIcon } from './icons';

interface OnboardingFormProps {
  onSubmit: (data: UserData) => void;
  isLoading: boolean;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserData>({
    name: '',
    age: 25,
    weight: 70,
    height: 175,
    goal: Goal.HYPERTROPHY,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'name' || name === 'goal' ? value : Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = "w-full bg-gray-700 text-white p-3 rounded-lg border border-dark-border focus:outline-none focus:ring-2 focus:ring-neon-green transition-all";
  const labelClasses = "block mb-2 text-sm font-semibold text-gray-300";

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 bg-dark-card rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome to GymGenie</h2>
      <p className="text-center text-gray-400 mb-8">Tell us about yourself to generate a personalized plan.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className={labelClasses}>Name</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={inputClasses} placeholder="e.g. Alex" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="age" className={labelClasses}>Age</label>
            <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} required className={inputClasses} min="1" />
          </div>
          <div>
            <label htmlFor="weight" className={labelClasses}>Weight (kg)</label>
            <input type="number" name="weight" id="weight" value={formData.weight} onChange={handleChange} required className={inputClasses} min="1" />
          </div>
          <div>
            <label htmlFor="height" className={labelClasses}>Height (cm)</label>
            <input type="number" name="height" id="height" value={formData.height} onChange={handleChange} required className={inputClasses} min="1" />
          </div>
        </div>

        <div>
          <label htmlFor="goal" className={labelClasses}>Primary Goal</label>
          <select name="goal" id="goal" value={formData.goal} onChange={handleChange} required className={`${inputClasses} appearance-none`}>
            {GOALS.map(goal => (
              <option key={goal} value={goal}>{goal}</option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          disabled={isLoading} 
          className="w-full flex justify-center items-center bg-neon-green text-dark-bg font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {isLoading ? <><LoaderIcon className="w-6 h-6 animate-spin mr-2" /> Generating...</> : 'Create My Plan'}
        </button>
      </form>
    </div>
  );
};

export default OnboardingForm;
   