import React, { useState, DragEvent } from 'react';
import { QuadrantType, Task } from '../types';
import { QUADRANT_DETAILS } from '../constants';
import TaskCard from './TaskCard';

interface QuadrantProps {
  quadrant: QuadrantType;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onMoveTask: (taskId: string, newQuadrant: QuadrantType) => void;
  onReorderTask: (draggedTaskId: string, droppedOnTaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const Quadrant: React.FC<QuadrantProps> = ({ quadrant, title, tasks, onEditTask, onToggleComplete, onMoveTask, onReorderTask, onDeleteTask }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const details = QUADRANT_DETAILS[quadrant];

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onMoveTask(taskId, quadrant);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`quadrant flex flex-col h-full p-2 border rounded-lg min-h-[160px] transition-colors duration-200 overflow-hidden ${
        isDragOver ? details.dragOverColor : details.color
      }`}
    >
      <h2 className={`text-sm sm:text-lg font-semibold mb-2 text-center ${details.textColor}`}>
        {quadrant}: {title}
      </h2>
      <div className="task-list flex-grow space-y-1 overflow-y-auto pr-1">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onEditTask={onEditTask} 
            onToggleComplete={onToggleComplete} 
            onReorderTask={onReorderTask}
            onDeleteTask={onDeleteTask}
           />
        ))}
      </div>
    </div>
  );
};

export default Quadrant;