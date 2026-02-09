import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:5000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Backend not connected. Did you start the server?");
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    await axios.post(API_URL, { title, description: desc });
    setTitle(''); setDesc('');
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black tracking-tight text-indigo-600">TASK FLOW</h1>
          <p className="text-slate-500 mt-2">Manage your daily grind with ease.</p>
        </header>

        {/* Input Section */}
        <section className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/60 border border-white mb-8">
          <form onSubmit={addTask} className="space-y-4">
            <input 
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-400 outline-none transition-all placeholder:text-slate-400"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea 
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-400 outline-none transition-all placeholder:text-slate-400"
              placeholder="Add a description..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95">
              Create Task
            </button>
          </form>
        </section>

        {/* Task Display Section */}
        <div className="grid gap-4">
          {tasks.length === 0 && (
            <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">Your task list is empty!</p>
            </div>
          )}
          
          {tasks.map(task => (
            <div key={task.id} className="group bg-white p-6 rounded-3xl border border-slate-100 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <h3 className="font-bold text-lg">{task.title}</h3>
                </div>
                <p className="text-slate-500 mt-1 ml-5 text-sm">{task.description}</p>
              </div>
              
              <button 
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 bg-red-50 text-red-500 px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all font-semibold"
              >
                Done
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;