import React, { useState, useCallback, FormEvent, useMemo, useEffect } from 'react';
import { QuadrantType, Task, Category, RequestStatus } from './types';
import { QUADRANT_DETAILS } from './constants';
import Quadrant from './components/Quadrant';
import { EditIcon } from './components/icons/EditIcon';
import { TrashIcon } from './components/icons/TrashIcon';
import { PlusIcon } from './components/icons/PlusIcon';
import { ListIcon } from './components/icons/ListIcon';
import MatrixLogo from './components/MatrixLogo';

const initialTabs = {
    tab1: 'A',
    tab2: 'B',
    tab3: 'C',
    tab4: 'D',
};

const initialTasksData: { [key: string]: Task[] } = {
    'tab1': [
        { id: 't1-1', name: 'プロジェクト計画書の作成', description: '主要なマイルストーンを定義する', time: '8h', cost: 0, category: Category.WORK, quadrant: QuadrantType.A, completed: false, dueDate: '2024-08-15', creationDate: '2024-08-01', requestStatus: RequestStatus.NONE, order: 0 },
        { id: 't1-2', name: '新しいスキルの学習', description: 'ReactとTypeScriptのコースを完了する', time: '20h', cost: 50, category: Category.PRIVATE, quadrant: QuadrantType.B, completed: false, dueDate: '2024-09-30', creationDate: '2024-08-01', requestStatus: RequestStatus.NONE, order: 1 },
        { id: 't1-3', name: 'クライアントからの緊急メール対応', description: 'XX社からの問い合わせに本日中に返信', time: '1h', cost: 0, category: Category.WORK, quadrant: QuadrantType.C, completed: true, dueDate: '2024-08-10', creationDate: '2024-08-10', requestStatus: RequestStatus.RECEIVED, order: 2 },
        { id: 't1-4', name: 'SNSのチェック', description: '友人の投稿を確認する', time: '30m', cost: 0, category: Category.PRIVATE, quadrant: QuadrantType.D, completed: false, dueDate: '', creationDate: '2024-08-10', requestStatus: RequestStatus.NONE, order: 3 },
    ],
    'tab2': [
        { id: 't2-1', name: '週次レポートの提出', description: '', time: '2h', cost: 0, category: Category.WORK, quadrant: QuadrantType.A, completed: false, dueDate: '2024-08-12', creationDate: '2024-08-10', requestStatus: RequestStatus.NONE, order: 0 },
    ],
    'tab3': [],
    'tab4': [],
};


const quadrantOrder: Record<QuadrantType, number> = {
    [QuadrantType.A]: 1,
    [QuadrantType.B]: 2,
    [QuadrantType.C]: 3,
    [QuadrantType.D]: 4,
};


const App: React.FC = () => {
    const [tabs, setTabs] = useState(initialTabs);
    const [allTasks, setAllTasks] = useState<{ [key: string]: Task[] }>(initialTasksData);
    const [activeTab, setActiveTab] = useState<string>('tab1');
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isFormPanelOpen, setFormPanelOpen] = useState(false);
    const [isListPanelOpen, setListPanelOpen] = useState(false);
    const [editingTab, setEditingTab] = useState<string | null>(null);
    const [tabName, setTabName] = useState('');

    const tasks = useMemo(() => allTasks[activeTab] || [], [allTasks, activeTab]);

    const version = useMemo(() => {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `ver ${year}${month}${day}.${hours}${minutes}`;
    }, []);

    const handleMoveTask = useCallback((taskId: string, newQuadrant: QuadrantType) => {
        setAllTasks(prev => ({
            ...prev,
            [activeTab]: (prev[activeTab] || []).map(t =>
                t.id === taskId ? { ...t, quadrant: newQuadrant } : t
            ),
        }));
    }, [activeTab]);

    const handleReorderTask = useCallback((draggedTaskId: string, droppedOnTaskId: string) => {
        setAllTasks(prev => {
            const currentTasks = [...(prev[activeTab] || [])];
            const draggedTask = currentTasks.find(t => t.id === draggedTaskId);
            if (!draggedTask) return prev;

            let reorderedTasks = currentTasks.filter(t => t.id !== draggedTaskId);
            const targetIndex = reorderedTasks.findIndex(t => t.id === droppedOnTaskId);

            if (targetIndex !== -1) {
                reorderedTasks.splice(targetIndex, 0, draggedTask);
            } else {
                return prev;
            }

            const finalTasks = reorderedTasks.map((task, index) => ({ ...task, order: index }));
            return { ...prev, [activeTab]: finalTasks };
        });
    }, [activeTab]);

    const handleToggleComplete = useCallback((taskId: string) => {
        setAllTasks(prev => ({
            ...prev,
            [activeTab]: (prev[activeTab] || []).map(t =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
            ),
        }));
    }, [activeTab]);

    const handleDeleteTask = useCallback((taskId: string) => {
        setAllTasks(prev => ({
            ...prev,
            [activeTab]: (prev[activeTab] || []).filter(t => t.id !== taskId)
        }));
    }, [activeTab]);

    const handleOpenForm = (task: Task | null = null) => {
        setEditingTask(task);
        setFormPanelOpen(true);
        setListPanelOpen(false);
    };

    const handleSaveTask = (formData: Omit<Task, 'id' | 'order'>) => {
        setAllTasks(prev => {
            const currentTasks = prev[activeTab] || [];
            if (editingTask) {
                const updatedTasks = currentTasks.map(t => t.id === editingTask.id ? { ...editingTask, ...formData, order: t.order } : t);
                return { ...prev, [activeTab]: updatedTasks };
            } else {
                const newTask: Task = {
                    ...formData,
                    id: `task-${Date.now()}`,
                    order: currentTasks.length,
                };
                return { ...prev, [activeTab]: [...currentTasks, newTask] };
            }
        });
        setFormPanelOpen(false);
        setEditingTask(null);
    };

    const handleEditTabName = (tabId: string) => {
        setEditingTab(tabId);
        setTabName(tabs[tabId]);
    };

    const handleSaveTabName = (tabId: string) => {
        if (tabName.trim()) {
            setTabs(prev => ({ ...prev, [tabId]: tabName.trim() }));
        }
        setEditingTab(null);
    };

    const activeTasks = useMemo(() => tasks.filter(task => !task.completed), [tasks]);

    const sortedListedTasks = useMemo(() => {
        return tasks
            .slice()
            .sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                }
                const orderA = quadrantOrder[a.quadrant] ?? 5;
                const orderB = quadrantOrder[b.quadrant] ?? 5;
                if (orderA !== orderB) {
                    return orderA - orderB;
                }
                return a.order - b.order;
            });
    }, [tasks]);


    return (
        <div className="flex flex-col h-screen max-h-screen p-2 sm:p-4 bg-black font-sans overflow-hidden">
            <header className="flex-shrink-0">
                <MatrixLogo version={version} />
            </header>

            <div className="flex-shrink-0 my-2">
                <div className="flex border-b border-gray-700">
                    {Object.entries(tabs).map(([tabId, name]) => (
                        <button
                            key={tabId}
                            onClick={() => setActiveTab(tabId)}
                            onDoubleClick={() => handleEditTabName(tabId)}
                            className={`py-2 px-4 text-sm font-medium transition-colors ${activeTab === tabId
                                    ? 'border-b-2 border-green-500 text-green-400'
                                    : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            {editingTab === tabId ? (
                                <input
                                    type="text"
                                    value={tabName}
                                    onChange={(e) => setTabName(e.target.value)}
                                    onBlur={() => handleSaveTabName(tabId)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveTabName(tabId)}
                                    className="bg-gray-800 text-green-400 border-none outline-none p-0"
                                    autoFocus
                                />
                            ) : (
                                name
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <main className="flex-grow grid grid-cols-1 grid-rows-[auto,1fr] gap-2 overflow-hidden">
                <div className="grid grid-cols-12 gap-2 text-center text-sm font-semibold text-gray-400">
                    <div className="col-start-2 col-span-5 text-red-400">緊急度 高</div>
                    <div className="col-span-6 text-blue-400">緊急度 低</div>
                </div>
                <div className="grid grid-cols-12 grid-rows-2 gap-2 h-full overflow-hidden">
                    <div className="col-span-1 row-span-1 flex items-center justify-center">
                        <span className="[writing-mode:vertical-lr] rotate-180 font-semibold text-red-400">重要度 高</span>
                    </div>
                    <div className="col-span-1 row-span-1 flex items-center justify-center">
                        <span className="[writing-mode:vertical-lr] rotate-180 font-semibold text-blue-400">重要度 低</span>
                    </div>

                    {Object.values(QuadrantType).map((quadrant, index) => {
                        const tasksForQuadrant = activeTasks.filter(t => t.quadrant === quadrant);
                        const gridPosition = [
                            'col-start-2 col-span-5 row-start-1',
                            'col-start-7 col-span-6 row-start-1',
                            'col-start-2 col-span-5 row-start-2',
                            'col-start-7 col-span-6 row-start-2',
                        ][index];

                        return (
                            <div key={quadrant} className={`${gridPosition} h-full overflow-hidden`}>
                                <Quadrant
                                    quadrant={quadrant}
                                    title={QUADRANT_DETAILS[quadrant].title}
                                    tasks={tasksForQuadrant}
                                    onEditTask={handleOpenForm}
                                    onToggleComplete={handleToggleComplete}
                                    onMoveTask={handleMoveTask}
                                    onReorderTask={handleReorderTask}
                                    onDeleteTask={handleDeleteTask}
                                />
                            </div>
                        );
                    })}
                </div>
            </main>

            <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-20">
                <button onClick={() => { setListPanelOpen(false); handleOpenForm(null); }} className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110">
                    <PlusIcon />
                </button>
                <button onClick={() => { setFormPanelOpen(false); setListPanelOpen(prev => !prev); }} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110">
                    <ListIcon />
                </button>
            </div>

            {/* Side Panels */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-gray-900/95 backdrop-blur-sm shadow-2xl z-10 p-4 transform transition-transform duration-300 ease-in-out ${isFormPanelOpen || isListPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <button onClick={() => { setFormPanelOpen(false); setListPanelOpen(false); }} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>

                {/* Form Panel */}
                {isFormPanelOpen && <TaskForm task={editingTask} onSave={handleSaveTask} />}

                {/* List Panel */}
                {isListPanelOpen && (
                    <div className="flex flex-col h-full text-gray-200">
                        <h2 className="text-xl font-bold text-green-400 mb-4">タスク一覧</h2>
                        <div className="flex-grow overflow-y-auto pr-2">
                            <div className="grid grid-cols-[auto,1fr,auto] gap-x-2 items-center font-bold text-gray-500 text-sm mb-2 px-2">
                                <span>状態</span>
                                <span>タスク項目</span>
                                <span>操作</span>
                            </div>
                            {sortedListedTasks.map(task => (
                                <TaskListItem key={task.id} task={task} onEdit={handleOpenForm} onToggleComplete={handleToggleComplete} onDelete={handleDeleteTask} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


// Form Component
const TaskForm: React.FC<{ task: Task | null; onSave: (data: Omit<Task, 'id' | 'order'>) => void; }> = ({ task, onSave }) => {
    const [formData, setFormData] = useState({
        name: '', description: '', time: '', cost: 0, category: Category.WORK, dueDate: '', creationDate: new Date().toISOString().split('T')[0], requestStatus: RequestStatus.NONE,
    });
    const [importance, setImportance] = useState<'high' | 'low'>('low');
    const [urgency, setUrgency] = useState<'high' | 'low'>('low');

    useEffect(() => {
        if (task) {
            setFormData({
                name: task.name,
                description: task.description,
                time: task.time,
                cost: task.cost,
                category: task.category,
                dueDate: task.dueDate,
                creationDate: task.creationDate,
                requestStatus: task.requestStatus || RequestStatus.NONE,
            });
            switch (task.quadrant) {
                case QuadrantType.A: setImportance('high'); setUrgency('high'); break;
                case QuadrantType.B: setImportance('high'); setUrgency('low'); break;
                case QuadrantType.C: setImportance('low'); setUrgency('high'); break;
                case QuadrantType.D: setImportance('low'); setUrgency('low'); break;
            }
        } else {
            setFormData({ name: '', description: '', time: '', cost: 0, category: Category.WORK, dueDate: '', creationDate: new Date().toISOString().split('T')[0], requestStatus: RequestStatus.NONE });
            setImportance('low');
            setUrgency('low');
        }
    }, [task]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) { alert('タスク名は必須です。'); return; }

        let quadrant: QuadrantType;
        if (importance === 'high' && urgency === 'high') quadrant = QuadrantType.A;
        else if (importance === 'high' && urgency === 'low') quadrant = QuadrantType.B;
        else if (importance === 'low' && urgency === 'high') quadrant = QuadrantType.C;
        else quadrant = QuadrantType.D;

        onSave({ ...formData, quadrant, completed: task?.completed || false });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'number' ? parseFloat(value) : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3 text-sm h-full flex flex-col">
            <h2 className="text-xl font-bold text-green-400 mb-2">{task ? 'タスクの編集' : '新しいタスクの追加'}</h2>
            <div className="flex-grow overflow-y-auto pr-2">
                <div>
                    <label className="block text-gray-400 mb-1">重要度</label>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setImportance('high')} className={`w-full p-2 rounded transition-colors ${importance === 'high' ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>高</button>
                        <button type="button" onClick={() => setImportance('low')} className={`w-full p-2 rounded transition-colors ${importance === 'low' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>低</button>
                    </div>
                </div>
                <div>
                    <label className="block text-gray-400 mt-3 mb-1">緊急度</label>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setUrgency('high')} className={`w-full p-2 rounded transition-colors ${urgency === 'high' ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>高</button>
                        <button type="button" onClick={() => setUrgency('low')} className={`w-full p-2 rounded transition-colors ${urgency === 'low' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>低</button>
                    </div>
                </div>
                <div className="pt-2">
                    <label className="block text-gray-400 mb-1">タスク項目 *</label>
                    <input name="name" value={formData.name} onChange={handleChange} required className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:ring-1 focus:ring-green-500 focus:outline-none" />
                </div>
                <div>
                    <label className="block text-gray-400 mb-1">詳細</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:ring-1 focus:ring-green-500 focus:outline-none" />
                </div>
                <div>
                    <label className="block text-gray-400 mb-1">期日</label>
                    <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:ring-1 focus:ring-green-500 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-gray-400 mb-1">タスク処理必要時間</label>
                        <input name="time" value={formData.time} onChange={handleChange} placeholder="例: 2h, 30m" className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:ring-1 focus:ring-green-500 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">費用</label>
                        <input type="number" name="cost" value={formData.cost} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:ring-1 focus:ring-green-500 focus:outline-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-gray-400 mb-1">依頼ステータス</label>
                    <select name="requestStatus" value={formData.requestStatus} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:ring-1 focus:ring-green-500 focus:outline-none">
                        <option value={RequestStatus.NONE}>なし</option>
                        <option value={RequestStatus.RECEIVED}>依頼を受けてる</option>
                        <option value={RequestStatus.DELEGATED}>依頼中</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-400 mb-1">分類</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:ring-1 focus:ring-green-500 focus:outline-none">
                        <option value={Category.WORK}>仕事</option>
                        <option value={Category.PRIVATE}>プライベート</option>
                    </select>
                </div>
            </div>
            <div className="flex-shrink-0 pt-3">
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">保存する</button>
            </div>
        </form>
    );
};

// Task List Item Component
const TaskListItem: React.FC<{ task: Task; onEdit: (task: Task) => void; onToggleComplete: (id: string) => void; onDelete: (id: string) => void; }> = ({ task, onEdit, onToggleComplete, onDelete }) => {
    const hasDetails = task.description || (task.requestStatus && task.requestStatus !== RequestStatus.NONE);

    return (
        <div className={`grid grid-cols-[auto,1fr,auto] gap-x-2 items-center p-2 rounded transition-colors mb-1 ${task.completed ? 'bg-green-900/30' : 'bg-gray-800/70 hover:bg-gray-700/70'}`}>
            <input type="checkbox" checked={task.completed} onChange={() => onToggleComplete(task.id)} className="form-checkbox h-4 w-4 rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500" />
            <div className="truncate">
                <span className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>{task.name}</span>
                {hasDetails && (
                    <p className="text-xs text-gray-400 truncate flex items-center gap-2 mt-1">
                        {task.requestStatus && task.requestStatus !== RequestStatus.NONE && (
                            <span className="bg-gray-600 text-gray-300 px-1.5 py-0.5 rounded-full text-xs whitespace-nowrap">{task.requestStatus}</span>
                        )}
                        <span>{task.description}</span>
                    </p>
                )}
            </div>
            <div className="flex items-center">
                <button onClick={() => onEdit(task)} className="p-1 text-gray-400 hover:text-blue-400"><EditIcon /></button>
                <button onClick={() => onDelete(task.id)} className="p-1 text-gray-400 hover:text-red-400"><TrashIcon /></button>
            </div>
        </div>
    );
};

export default App;
