import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:5001"; // Ensure this matches your backend port

function App() {
  // --- State Management ---
  const [tasks, setTasks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [filter, setFilter] = useState('all');

  // --- Auth Functions ---
  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register';
      const res = await axios.post(`${API_URL}${endpoint}`, { email, password });
      
      if (authMode === 'login') {
        localStorage.setItem('token', res.data.token);
        setIsLoggedIn(true);
        setEmail('');
        setPassword('');
      } else {
        alert("Registration successful! Please login.");
        setAuthMode('login');
      }
    } catch (err) {
      alert(err.response?.data?.error || "Authentication failed");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setTasks([]);
  };

  // --- Task Functions ---
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 403) logout(); // Token expired
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchTasks();
  }, [isLoggedIn]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const token = localStorage.getItem('token');
    await axios.post(`${API_URL}/tasks`, 
      { title, description: desc },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTitle(''); setDesc('');
    fetchTasks();
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    const token = localStorage.getItem('token');
    await axios.put(`${API_URL}/tasks/${id}`, 
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchTasks();
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTasks();
  };

  const filteredTasks = tasks.filter(t => filter === 'all' ? true : t.status === filter);

  // --- UI Components ---

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-200">
          <h2 className="text-3xl font-black text-indigo-600 mb-2 text-center">
            {authMode === 'login' ? 'Welcome Back' : 'Join Taskly'}
          </h2>
          <p className="text-slate-500 text-center mb-8">Professional Task Management</p>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <input 
              type="email" placeholder="Email Address" required
              className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" placeholder="Password" required
              className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all">
              {authMode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>
          
          <p className="text-center mt-6 text-sm font-medium text-slate-900">
            {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-indigo-600 font-bold hover:underline ml-1"
            >
              {authMode === 'login' ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        {/* Navbar */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-black text-indigo-600 tracking-tighter">TASKLY.</h1>
          <button onClick={logout} className="text-slate-400 hover:text-red-500 font-bold text-sm transition-colors">
            LOGOUT →
          </button>
        </div>

        {/* Task Creator */}
        <section className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-indigo-100/50 border border-slate-100 mb-10">
          <form onSubmit={addTask} className="space-y-4">
            <input 
              className="w-full text-xl font-semibold border-b-2 border-slate-100 focus:border-indigo-500 py-2 outline-none transition-colors"
              placeholder="Main task goal..."
              value={title} onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex gap-4">
              <input 
                className="flex-1 bg-slate-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="Description..."
                value={desc} onChange={(e) => setDesc(e.target.value)}
              />
              <button className="bg-indigo-600 text-white px-8 font-bold rounded-xl hover:bg-indigo-700 transition-all">
                Add
              </button>
            </div>
          </form>
        </section>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8">
          {['all', 'Pending', 'Completed'].map((f) => (
            <button 
              key={f} onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <div key={task.id} className="bg-white p-6 rounded-2xl flex items-center gap-4 border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <button 
                onClick={() => toggleStatus(task.id, task.status)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${task.status === 'Completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 hover:border-indigo-400'}`}
              >
                {task.status === 'Completed' && '✓'}
              </button>
              <div className="flex-1">
                <h3 className={`font-bold text-lg ${task.status === 'Completed' ? 'line-through text-slate-300' : 'text-slate-800'}`}>
                  {task.title}
                </h3>
                <p className="text-slate-400 text-sm">{task.description}</p>
              </div>
              <button onClick={() => deleteTask(task.id)} className="text-slate-200 hover:text-red-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;