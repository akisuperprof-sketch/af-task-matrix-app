import React, { DragEvent, useState } from 'react';
import { Task } from '../types';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';

interface TaskCardProps {
  task: Task;
  onEditTask: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onReorderTask: (draggedTaskId: string, droppedOnTaskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEditTask, onToggleComplete, onReorderTask }) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('text/plain', task.id.toString());
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => {
            (e.target as HTMLDivElement).classList.add('opacity-50');
        }, 0);
    };

    const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
        (e.target as HTMLDivElement).classList.remove('opacity-50');
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsDragOver(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        const draggedTaskIdStr = e.dataTransfer.getData('text/plain');
        if (draggedTaskIdStr) {
            if (draggedTaskIdStr !== task.id) {
                onReorderTask(draggedTaskIdStr, task.id);
            }
        }
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative task-card bg-gray-800/80 p-1.5 rounded-md border border-gray-600/70 cursor-grab active:cursor-grabbing flex items-center justify-between gap-2 ${task.completed ? 'opacity-60' : ''}`}
        >
            {isDragOver && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-green-500 rounded-full" />
            )}
            <p className={`flex-grow font-semibold text-gray-200 truncate text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.name}</p>
            
            <div className="flex-shrink-0 flex items-center">
                <button onClick={() => onEditTask(task)} className="p-1 text-gray-400 hover:text-blue-400 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label={`Edit task ${task.name}`}>
                    <EditIcon />
                </button>
                <button onClick={() => onToggleComplete(task.id)} className="p-1 text-gray-400 hover:text-red-400 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-red-500" aria-label={`Delete task ${task.name}`}>
                    <TrashIcon />
                </button>
            </div>
        </div>
    );
};

export default TaskCard;