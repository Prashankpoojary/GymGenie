
import React, { useState, useEffect } from 'react';
import { DaySchedule, Exercise } from '../types';
import { CloseIcon } from './icons';

interface WorkoutModalProps {
  dayInfo: { dayIndex: number; schedule: DaySchedule };
  onClose: () => void;
  onSave: (dayIndex: number, updatedExercises: Exercise[]) => void;
}

const WorkoutModal: React.FC<WorkoutModalProps> = ({ dayInfo, onClose, onSave }) => {
  const [editableExercises, setEditableExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    setEditableExercises(JSON.parse(JSON.stringify(dayInfo.schedule.exercises))); // Deep copy
  }, [dayInfo]);
  
  const handleExerciseChange = (index: number, field: keyof Exercise, value: string) => {
    const newExercises = [...editableExercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setEditableExercises(newExercises);
  };
  
  const handleAddExercise = () => {
    setEditableExercises([...editableExercises, { name: '', sets: '', reps: '' }]);
  };
  
  const handleRemoveExercise = (index: number) => {
    setEditableExercises(editableExercises.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(dayInfo.dayIndex, editableExercises);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-dark-border flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white">{dayInfo.schedule.day_name}</h3>
            <p className="text-neon-green">{dayInfo.schedule.focus_area}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 rounded-full">
             <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-4">
          {editableExercises.map((ex, index) => (
             <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <input 
                  type="text" 
                  value={ex.name} 
                  onChange={(e) => handleExerciseChange(index, 'name', e.target.value)} 
                  placeholder="Exercise Name"
                  className="col-span-5 bg-gray-700 p-2 rounded border border-dark-border focus:ring-neon-green focus:outline-none"
                />
                <input 
                  type="text" 
                  value={ex.sets} 
                  onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)} 
                  placeholder="Sets"
                  className="col-span-2 bg-gray-700 p-2 rounded border border-dark-border focus:ring-neon-green focus:outline-none"
                />
                <input 
                  type="text" 
                  value={ex.reps} 
                  onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)} 
                  placeholder="Reps"
                  className="col-span-2 bg-gray-700 p-2 rounded border border-dark-border focus:ring-neon-green focus:outline-none"
                />
                <button onClick={() => handleRemoveExercise(index)} className="col-span-3 text-red-500 hover:text-red-400 text-sm">Remove</button>
             </div>
          ))}
          <button onClick={handleAddExercise} className="w-full text-center py-2 text-neon-green border-2 border-dashed border-gray-600 rounded-lg hover:bg-gray-700">
            + Add Exercise
          </button>
        </div>
        
        <div className="p-4 border-t border-dark-border mt-auto flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 bg-neon-green text-dark-bg font-bold rounded-lg hover:opacity-90">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutModal;
   