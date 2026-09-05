import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  Receipt, 
  MoreHorizontal, 
  Bell, 
  Plus, 
  Home, 
  BarChart3, 
  PieChart as PieIcon, 
  User,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  TrendingDown,
  LogOut,
  Trash2
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api, { clearTokens } from '../services/api';

const CATEGORY_MAP = {
  Food: { icon: Utensils, color: '#FF453A', bg: 'rgba(255,69,58,0.15)' },
  Transport: { icon: Car, color: '#FF9F0A', bg: 'rgba(255,159,10,0.15)' },
  Shopping: { icon: ShoppingBag, color: '#BF5AF2', bg: 'rgba(191,90,242,0.15)' },
  Bills: { icon: Receipt, color: '#0A84FF', bg: 'rgba(10,132,255,0.15)' },
  Others: { icon: MoreHorizontal, color: '#30D158', bg: 'rgba(48,209,88,0.15)' },
};

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('home');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Food');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/api/expenses/');
      setExpenses(res.data || []);
    } catch (e) {
      console.error(e);
      if (e.response && e.response.status === 401) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;
    try {
      const res = await api.post('/api/expenses/', {
        title: newTitle,
        amount: parseFloat(newAmount),
        category: newCategory,
        date: new Date().toISOString().split('T')[0]
      });
      setExpenses([res.data, ...expenses]);
      setNewTitle('');
      setNewAmount('');
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed to add expense');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/expenses/${id}/`);
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    clearTokens();
    window.location.href = '/login';
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const totalBudget = 45000;
  const remainingBudget = Math.max(0, totalBudget - totalSpent);

  const categoryTotals = expenses.reduce((acc, curr) => {
    const cat = curr.category || 'Others';
    acc[cat] = (acc[cat] || 0) + Number(curr.amount || 0);
    return acc;
  }, {});

  const chartData = Object.keys(categoryTotals).map(cat => ({
    name: cat,
    value: categoryTotals[cat],
    color: CATEGORY_MAP[cat]?.color || '#8E8E93',
  }));

  const filteredExpenses = selectedFilter === 'All' 
    ? expenses 
    : expenses.filter(e => e.category === selectedFilter);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#08090D',
      color: '#FFFFFF',
      display: 'flex',
      justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      position: 'relative'
    }}>
      
      {/* Dynamic Viewport Container: Auto fits Mobile (<480px) & Desktop Screens */}
      <div style={{
        width: '100%',
        maxWidth: '850px',
        padding: '0 20px 120px 20px',
        position: 'relative'
      }}>
        
        {/* Top Glow Ambient */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '240px',
          background: 'radial-gradient(ellipse at top, rgba(10, 132, 255, 0.18), transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Apple Status Header */}
        <header style={{
          padding: '36px 0 18px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #0A84FF 0%, #0056D2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(10, 132, 255, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Sparkles size={24} color="#FFF" />
            </div>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(235, 235, 245, 0.45)', fontWeight: 700 }}>
                Enterprise Vault
              </span>
              <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#FFF', letterSpacing: '-0.4px' }}>
                Smart Expense
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleLogout}
              title="Sign Out"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <LogOut size={18} color="#FF453A" />
            </button>
          </div>
        </header>

        {/* Adaptive 2-Column Mesh Grid for Windows / 1-Column for Mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          marginTop: '10px',
          marginBottom: '24px'
        }}>
          {/* Apple Titanium Card */}
          <div style={{
            background: 'linear-gradient(135deg, #161C2C 0%, #0D1220 50%, #151829 100%)',
            borderRadius: '28px',
            padding: '26px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '13px', color: 'rgba(235, 235, 245, 0.65)', fontWeight: 600 }}>Total Balance Spent</span>
                <h2 style={{ fontSize: '38px', fontWeight: 800, margin: '6px 0 0 0', letterSpacing: '-1px', color: '#FFFFFF' }}>
                  ₹{totalSpent.toLocaleString('en-IN')}
                </h2>
              </div>
              <div style={{
                background: 'rgba(48, 209, 88, 0.15)',
                border: '1px solid rgba(48, 209, 88, 0.3)',
                borderRadius: '20px',
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <TrendingDown size={14} color="#30D158" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#30D158' }}>Active</span>
              </div>
            </div>

            <div style={{
              marginTop: '32px',
              paddingTop: '18px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '11px', color: 'rgba(235, 235, 245, 0.45)', fontWeight: 600 }}>Available Budget</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '17px', fontWeight: 700, color: '#30D158' }}>
                  ₹{remainingBudget.toLocaleString('en-IN')}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: 'rgba(235, 235, 245, 0.45)', fontWeight: 600 }}>Monthly Limit</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>
                  ₹{totalBudget.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Portfolio Donut Distribution */}
          <div style={{
            background: 'rgba(22, 26, 38, 0.65)',
            backdropFilter: 'blur(28px)',
            borderRadius: '28px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ width: '140px', height: '140px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.length > 0 ? chartData : [{ name: 'None', value: 1, color: '#232836' }]}
                    innerRadius={46}
                    outerRadius={64}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {(chartData.length > 0 ? chartData : [{ color: '#232836' }]).map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'rgba(235, 235, 245, 0.4)', fontWeight: 700 }}>Total</span>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 800 }}>{expenses.length}</p>
              </div>
            </div>

            <div style={{ flex: 1, paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chartData.slice(0, 4).map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: c.color }} />
                    <span style={{ color: 'rgba(235, 235, 245, 0.85)', fontWeight: 600 }}>{c.name}</span>
                  </div>
                  <span style={{ color: 'rgba(235, 235, 245, 0.45)', fontWeight: 700 }}>
                    ₹{c.value.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '18px' }}>
          {['All', 'Food', 'Transport', 'Shopping', 'Bills', 'Others'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              style={{
                background: selectedFilter === cat ? '#0A84FF' : 'rgba(255, 255, 255, 0.05)',
                color: selectedFilter === cat ? '#FFF' : 'rgba(235, 235, 245, 0.6)',
                border: selectedFilter === cat ? '1px solid #0A84FF' : '1px solid rgba(255, 255, 255, 0.08)',
                padding: '9px 18px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#FFF' }}>Activity Log</h3>
            <span style={{ fontSize: '12px', color: '#0A84FF', fontWeight: 600 }}>{filteredExpenses.length} Records</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredExpenses.length === 0 ? (
              <div style={{
                background: 'rgba(22, 26, 38, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '36px',
                textAlign: 'center',
                borderRadius: '24px'
              }}>
                <p style={{ color: 'rgba(235, 235, 245, 0.4)', fontSize: '14px', margin: 0 }}>
                  No expenses in this category. Click '+' to record one!
                </p>
              </div>
            ) : (
              filteredExpenses.map((exp) => {
                const conf = CATEGORY_MAP[exp.category] || CATEGORY_MAP.Others;
                const IconComp = conf.icon;
                return (
                  <div
                    key={exp.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 18px',
                      borderRadius: '22px',
                      background: 'rgba(22, 26, 38, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.07)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '14px',
                        backgroundColor: conf.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <IconComp size={20} color={conf.color} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
                          {exp.title}
                        </p>
                        <span style={{ fontSize: '11px', color: 'rgba(235, 235, 245, 0.45)', fontWeight: 500 }}>
                          {exp.date || 'Today'} • {exp.category}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>
                        -₹{Number(exp.amount).toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          opacity: 0.4,
                          padding: '4px'
                        }}
                      >
                        <Trash2 size={16} color="#FF453A" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Floating Add Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1000
        }}>
          <div style={{
            width: '100%',
            maxWidth: '380px',
            background: '#151924',
            borderRadius: '28px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '28px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 800 }}>Add New Expense</h3>
            <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text"
                placeholder="Title (e.g. Starbucks Coffee)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  color: '#FFF',
                  outline: 'none'
                }}
              />
              <input
                type="number"
                placeholder="Amount (₹)"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                required
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  color: '#FFF',
                  outline: 'none'
                }}
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                style={{
                  background: '#1C2232',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  color: '#FFF',
                  outline: 'none'
                }}
              >
                {['Food', 'Transport', 'Shopping', 'Bills', 'Others'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: '#FFF',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '14px',
                    background: '#0A84FF',
                    border: 'none',
                    color: '#FFF',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Apple Dock Bottom Nav */}
      <nav style={{
        position: 'fixed',
        bottom: '18px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 36px)',
        maxWidth: '420px',
        height: '66px',
        background: 'rgba(20, 24, 34, 0.85)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderRadius: '34px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 10px',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6)',
        zIndex: 100
      }}>
        <button onClick={() => setActiveNav('home')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer' }}>
          <Home size={20} color={activeNav === 'home' ? '#0A84FF' : 'rgba(235, 235, 245, 0.45)'} />
          <span style={{ fontSize: '10px', fontWeight: 700, color: activeNav === 'home' ? '#0A84FF' : 'rgba(235, 235, 245, 0.45)' }}>Home</span>
        </button>

        <button onClick={() => setActiveNav('reports')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer' }}>
          <BarChart3 size={20} color={activeNav === 'reports' ? '#0A84FF' : 'rgba(235, 235, 245, 0.45)'} />
          <span style={{ fontSize: '10px', fontWeight: 700, color: activeNav === 'reports' ? '#0A84FF' : 'rgba(235, 235, 245, 0.45)' }}>Analytics</span>
        </button>

        {/* Center Glowing Add Modal Button */}
        <button 
          onClick={() => setShowAddModal(true)}
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0A84FF 0%, #0056D2 100%)',
            border: '3px solid #08090D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(10, 132, 255, 0.5)'
          }}
        >
          <Plus size={26} color="#FFF" />
        </button>

        <button onClick={() => setActiveNav('budget')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer' }}>
          <PieIcon size={20} color={activeNav === 'budget' ? '#0A84FF' : 'rgba(235, 235, 245, 0.45)'} />
          <span style={{ fontSize: '10px', fontWeight: 700, color: activeNav === 'budget' ? '#0A84FF' : 'rgba(235, 235, 245, 0.45)' }}>Budget</span>
        </button>

        <button onClick={() => setActiveNav('profile')} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer' }}>
          <User size={20} color={activeNav === 'profile' ? '#0A84FF' : 'rgba(235, 235, 245, 0.45)'} />
          <span style={{ fontSize: '10px', fontWeight: 700, color: activeNav === 'profile' ? '#0A84FF' : 'rgba(235, 235, 245, 0.45)' }}>Profile</span>
        </button>
      </nav>

    </div>
  );
}