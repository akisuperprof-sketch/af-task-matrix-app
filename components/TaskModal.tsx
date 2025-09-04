import React, { useState, useEffect } from 'react';
// FIX: Import `Category` to provide a default value in the `onSave` payload, aligning with the `Task` type and resolving a type error.
import { Task, Category, RequestStatus } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'completed' | 'quadrant' | 'order'>) => void;
  task: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, task }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Task name is required.');
      return;
    }
    // FIX: The onSave payload was incorrect. It has been updated to remove the non-existent 'dueDate' property and include all required properties from the Task type ('time', 'cost', 'category') with default values, satisfying the Omit<...> type. This resolves the error on line 35.
    onSave({
        name: name.trim(),
        description: description.trim(),
        time: '',
        cost: 0,
        category: Category.WORK,
        dueDate: '',
        creationDate: new Date().toISOString().split('T')[0],
        requestStatus: RequestStatus.NONE,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4 p-6 border border-gray-700" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-200">{task ? 'Edit Task' : 'Add New Task'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="taskName" className="block text-sm font-medium text-gray-300 mb-1">Task Name *</label>
              <input
                id="taskName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-200"
                required
              />
            </div>
            <div>
              <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                id="taskDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-200"
              />
            </div>
            {/* FIX: The input field and associated state for 'dueDate' were removed because the property does not exist on the 'Task' type. This resolves the error on line 21. */}
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;