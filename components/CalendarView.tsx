
import React, { useState, useMemo } from 'react';
import { WorkoutPlan, DaySchedule, Exercise } from '../types';
import WorkoutModal from './WorkoutModal';

interface CalendarViewProps {
  workoutPlan: WorkoutPlan;
  setWorkoutPlan: React.Dispatch<React.SetStateAction<WorkoutPlan | null>>;
}

const CalendarView: React.FC<CalendarViewProps> = ({ workoutPlan, setWorkoutPlan }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<{ dayIndex: number; schedule: DaySchedule } | null>(null);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const { month, year, daysInMonth, firstDayOfMonth } = useMemo(() => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { month, year, daysInMonth, firstDayOfMonth };
  }, [currentDate]);
  
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
  
  const workoutStartDate = today;
  
  const getWorkoutForDate = (date: number) => {
    const calendarDate = new Date(year, month, date);
    if (calendarDate < workoutStartDate) return null;
    
    const diffTime = Math.abs(calendarDate.getTime() - workoutStartDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < workoutPlan.schedule.length) {
      return { dayIndex: diffDays, schedule: workoutPlan.schedule[diffDays] };
    }
    return null;
  };

  const handleDayClick = (date: number) => {
    const workout = getWorkoutForDate(date);
    if (workout && workout.schedule.exercises.length > 0) {
      setSelectedDay(workout);
    }
  };
  
  const handleSaveWorkout = (dayIndex: number, updatedExercises: Exercise[]) => {
      setWorkoutPlan(prevPlan => {
          if (!prevPlan) return null;
          const newSchedule = [...prevPlan.schedule];
          newSchedule[dayIndex] = { ...newSchedule[dayIndex], exercises: updatedExercises };
          return { ...prevPlan, schedule: newSchedule };
      });
      setSelectedDay(null);
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  return (
    <div className="bg-dark-card p-4 sm:p-6 rounded-lg shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-700">&lt;</button>
        <h2 className="text-xl font-bold text-white">
          {currentDate.toLocaleString('default', { month: 'long' })} {year}
        </h2>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-700">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-400">
        {daysOfWeek.map(day => <div key={day} className="py-2">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="h-24"></div>)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = i + 1;
          const workoutData = getWorkoutForDate(date);
          const isToday = date === todayDate && month === todayMonth && year === todayYear;
          const isWorkoutDay = workoutData && workoutData.schedule.exercises.length > 0;

          return (
            <div
              key={date}
              className={`h-24 p-2 border border-dark-border rounded-md transition-colors ${isWorkoutDay ? 'cursor-pointer hover:bg-gray-700' : 'text-gray-500'}`}
              onClick={() => handleDayClick(date)}
            >
              <div className={`flex justify-center items-center w-8 h-8 rounded-full text-sm ${isToday ? 'bg-neon-green text-dark-bg font-bold' : ''}`}>
                {date}
              </div>
              {isWorkoutDay && (
                <div className="mt-1 text-xs text-neon-green truncate" title={workoutData.schedule.focus_area}>
                  {workoutData.schedule.focus_area}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {selectedDay && (
        <WorkoutModal 
          dayInfo={selectedDay}
          onClose={() => setSelectedDay(null)}
          onSave={handleSaveWorkout}
        />
      )}
    </div>
  );
};

export default CalendarView;
   