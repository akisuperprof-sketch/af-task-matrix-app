import React, { useState, useCallback, FormEvent, useMemo, useEffect } from 'react';
import { QuadrantType, Task, Category, RequestStatus } from './types';
import { QUADRANT_DETAILS } from './constants';
import Quadrant from './components/Quadrant';
import HelpModal from './components/HelpModal';
import { EditIcon } from './components/icons/EditIcon';
import { TrashIcon } from './components/icons/TrashIcon';
import { PlusIcon } from './components/icons/PlusIcon';
import { ListIcon } from './components/icons/ListIcon';
import { AppleIcon } from './components/icons/AppleIcon';
import MatrixLogo from './components/MatrixLogo';
import useLocalStorage from './hooks/useLocalStorage';

const initialTasks = {
    'tab1': [
        {
            id: 'task-1',
            name: '本日中の重要顧客A社への提案書提出',
            description: '最終見積もりを反映させ、本日17時までに送付する。',
            time: '120',
            cost: 0,
            category: Category.WORK,
            quadrant: QuadrantType.A, // Important & Urgent
            completed: false,
            dueDate: new Date().toISOString().split('T')[0],
            creationDate: new Date().toISOString().split('T')[0],
            requestStatus: RequestStatus.NONE,
            order: 0,
        },
        {
            id: 'task-2',
            name: '来四半期の営業戦略立案',
            description: '市場分析データをもとに、ターゲット顧客とアプローチ方法を具体化する。',
            time: '480',
            cost: 0,
            category: Category.WORK,
            quadrant: QuadrantType.B, // Important & Not Urgent
            completed: false,
            dueDate: '',
            creationDate: new Date().toISOString().split('T')[0],
            requestStatus: RequestStatus.NONE,
            order: 0,
        },
        {
            id: 'task-3',
            name: '急ぎの経費精算申請（今週分）',
            description: '交通費と交際費のレシートを添付して申請する。',
            time: '30',
            cost: 15000,
            category: Category.WORK,
            quadrant: QuadrantType.C, // Not Important & Urgent
            completed: false,
            dueDate: '',
            creationDate: new Date().toISOString().split('T')[0],
            requestStatus: RequestStatus.NONE,
            order: 0,
        },
        {
            id: 'task-4',
            name: '業界ニュースの定期チェック',
            description: '競合の動向や新技術に関する情報を収集する。',
            time: '15',
            cost: 0,
            category: Category.WORK,
            quadrant: QuadrantType.D, // Not Important & Not Urgent
            completed: false,
            dueDate: '',
            creationDate: new Date().toISOString().split('T')[0],
            requestStatus: RequestStatus.NONE,
            order: 0,
        },
    ],
    'tab2': []
};


const App: React.FC = () => {
    const [tabs, setTabs] = useLocalStorage<{ [key: string]: string }>('task-matrix-tabs', {
        'tab1': 'マイプロジェクト',
        'tab2': 'プライベート'
    });
    const [allTasks, setAllTasks] = useLocalStorage<{ [key: string]: Task[] }>('task-matrix-tasks', initialTasks);
    const [activeTab, setActiveTab] = useState<string>('tab1');
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isFormPanelOpen, setFormPanelOpen] = useState(false);
    const [isListPanelOpen, setListPanelOpen] = useState(false);
    const [editingTab, setEditingTab] = useState<string | null>(null);
    const [tabName, setTabName] = useState('');
    const [isHelpModalOpen, setHelpModalOpen] = useState(false);

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
        setAllTasks(prev => {
            const newTasks = [...(prev[activeTab] || [])];
            const taskIndex = newTasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                newTasks[taskIndex].quadrant = newQuadrant;
            }
            return { ...prev, [activeTab]: newTasks };
        });
    }, [activeTab, setAllTasks]);

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
    }, [activeTab, setAllTasks]);

    const handleToggleComplete = useCallback((taskId: string) => {
        setAllTasks(prev => {
            const newTasks = (prev[activeTab] || []).map(t =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
            );
            return { ...prev, [activeTab]: newTasks };
        });
    }, [activeTab, setAllTasks]);

    const handleDeleteTask = useCallback((taskId: string) => {
        if (window.confirm('このタスクを削除してもよろしいですか？')) {
            setAllTasks(prev => {
                const newTasks = (prev[activeTab] || []).filter(t => t.id !== taskId);
                return { ...prev, [activeTab]: newTasks };
            });
        }
    }, [activeTab, setAllTasks]);

    const handleOpenForm = (task: Task | null = null) => {
        setEditingTask(task);
        setFormPanelOpen(true);
        setListPanelOpen(false);
    };

    const handleSaveTask = (formData: Omit<Task, 'id' | 'order'>) => {
        const currentTasks = allTasks[activeTab] || [];
        if (editingTask) {
            setAllTasks(prev => ({
                ...prev,
                [activeTab]: (prev[activeTab] || []).map(t =>
                    t.id === editingTask.id ? { ...t, ...formData, id: t.id, order: t.order } : t
                ),
            }));
        } else {
            const newTask: Task = {
                ...formData,
                id: `task-${Date.now()}`,
                order: currentTasks.length,
            };
            setAllTasks(prev => ({
                ...prev,
                [activeTab]: [...(prev[activeTab] || []), newTask],
            }));
        }
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
        const quadrantOrder: Record<QuadrantType, number> = {
            [QuadrantType.A]: 1, [QuadrantType.B]: 2, [QuadrantType.C]: 3, [QuadrantType.D]: 4,
        };
        return tasks
            .slice()
            .sort((a, b) => {
                if (a.completed !== b.completed) return a.completed ? 1 : -1;
                const orderA = quadrantOrder[a.quadrant] ?? 5;
                const orderB = quadrantOrder[b.quadrant] ?? 5;
                if (orderA !== orderB) return orderA - orderB;
                return a.order - b.order;
            });
    }, [tasks]);


    return (
        <div className="flex flex-col h-screen max-h-screen p-2 sm:p-4 bg-black font-sans overflow-hidden">
            <header className="flex-shrink-0 relative">
                <button 
                    onClick={() => setHelpModalOpen(true)}
                    className="absolute top-2 left-2 text-red-500 hover:text-red-400 transition-colors z-10 p-2"
                    aria-label="使い方"
                >
                    <AppleIcon />
                </button>
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
                        <span className="[writing-mode:vertical-lr] font-semibold text-red-400">重要度 高</span>
                    </div>
                    <div className="col-span-1 row-span-1 flex items-center justify-center">
                        <span className="[writing-mode:vertical-lr] font-semibold text-blue-400">重要度 低</span>
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

            <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-gray-900/95 backdrop-blur-sm shadow-2xl z-10 p-4 transform transition-transform duration-300 ease-in-out ${isFormPanelOpen || isListPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <button onClick={() => { setFormPanelOpen(false); setListPanelOpen(false); }} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>

                {isFormPanelOpen && <TaskForm task={editingTask} onSave={handleSaveTask} />}

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
            
            <HelpModal isOpen={isHelpModalOpen} onClose={() => setHelpModalOpen(false)} />
        </div>
    );
};

const TaskForm: React.FC<{ task: Task | null; onSave: (data: Omit<Task, 'id' | 'order'>) => void; }> = ({ task, onSave }) => {
    const [formData, setFormData] = useState({
        name: '', description: '', time: '', cost: 0, category: Category.WORK, dueDate: '', creationDate: new Date().toISOString().split('T')[0], requestStatus: RequestStatus.NONE, completed: false,
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
                completed: task.completed,
            });
            switch (task.quadrant) {
                case QuadrantType.A: setImportance('high'); setUrgency('high'); break;
                case QuadrantType.B: setImportance('high'); setUrgency('low'); break;
                case QuadrantType.C: setImportance('low'); setUrgency('high'); break;
                case QuadrantType.D: setImportance('low'); setUrgency('low'); break;
            }
        } else {
            setFormData({ name: '', description: '', time: '', cost: 0, category: Category.WORK, dueDate: '', creationDate: new Date().toISOString().split('T')[0], requestStatus: RequestStatus.NONE, completed: false });
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

        onSave({ ...formData, quadrant });
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
                        <label className="block text-gray-400 mb-1">所要時間(分)</label>
                        <input type="text" name="time" value={formData.time} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:ring-1 focus:ring-green-500 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">コスト(円)</label>
                        <input type="number" name="cost" value={formData.cost} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:ring-1 focus:ring-green-500 focus:outline-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-gray-400 mb-1">カテゴリ</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:ring-1 focus:ring-green-500 focus:outline-none">
                        {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-400 mb-1">依頼状況</label>
                    <select name="requestStatus" value={formData.requestStatus} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded p-2 focus:ring-1 focus:ring-green-500 focus:outline-none">
                        {Object.values(RequestStatus).map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>
            </div>
            <div className="flex-shrink-0 pt-2">
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
                    {task ? '更新' : 'タスクを追加'}
                </button>
            </div>
        </form>
    );
};

const TaskListItem: React.FC<{
    task: Task;
    onEdit: (task: Task) => void;
    onToggleComplete: (taskId: string) => void;
    onDelete: (taskId:string) => void;
}> = ({ task, onEdit, onToggleComplete, onDelete }) => {
    const quadrantDetails = QUADRANT_DETAILS[task.quadrant];
    return (
        <div className={`grid grid-cols-[auto,1fr,auto] gap-x-2 items-center p-2 rounded-md mb-1 transition-colors ${task.completed ? 'bg-gray-800/50 text-gray-500' : 'bg-gray-800 hover:bg-gray-700/50'}`}>
            <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleComplete(task.id)}
                className="form-checkbox h-4 w-4 rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500"
                style={{ accentColor: 'var(--tw-prose-bold)' }}
            />
            <div className="flex items-center gap-2 truncate" onDoubleClick={() => onEdit(task)}>
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${quadrantDetails.color.replace('/20', '').replace('border-red-500/50', '')}`} />
                <span className={`truncate ${task.completed ? 'line-through' : ''}`}>{task.name}</span>
            </div>
            <div className="flex items-center">
                <button onClick={() => onEdit(task)} className="p-1 text-gray-400 hover:text-blue-400" aria-label="編集"><EditIcon /></button>
                <button onClick={() => onDelete(task.id)} className="p-1 text-gray-400 hover:text-red-400" aria-label="削除"><TrashIcon /></button>
            </div>
        </div>
    );
};

export default App;