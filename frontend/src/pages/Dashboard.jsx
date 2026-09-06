import React, { useEffect, useMemo, useState } from 'react';
import {
  Sparkles,
  PlusCircle,
  Trash2,
  LogOut,
  Camera,
  User,
  Home,
  RefreshCw,
  Search,
  X,
  CheckCircle2,
  ChevronRight,
  Wallet,
  ArrowRightLeft,
  PieChart,
  Download,
  Settings,
  Bell,
  ShieldCheck,
  Cloud,
  FileText,
  Receipt,
  BrainCircuit,
  SlidersHorizontal,
  Moon,
  HelpCircle,
  Lock,
  Fingerprint,
  Languages,
  Database,
  AlertTriangle,
  TrendingUp,
  CalendarDays,
  CreditCard,
  Smartphone,
  BarChart3,
  CircleDollarSign,
  Eye,
  EyeOff,
  RotateCcw
} from 'lucide-react';

import api, { clearTokens } from '../services/api';
import ReceiptScannerModal from '../components/ReceiptScannerModal';

/* =========================================================
   HELPERS
========================================================= */

const DEFAULT_SETTINGS = {
  aiReceiptScanning: true,
  autoCategorization: true,
  merchantDetection: true,
  duplicateDetection: true,
  ocrVerification: true,
  spendingInsights: true,

  budgetAlerts: true,
  dailySummary: true,
  weeklySummary: true,
  unusualSpending: true,
  recurringReminder: true,

  expenseAlerts: true,
  billReminders: true,
  securityAlerts: true,

  appLock: false,
  biometrics: false,
  animations: true,

  appearance: 'Dark',
  language: 'English',
  dateFormat: 'DD/MM/YYYY',
  startScreen: 'Dashboard',
  paymentMethod: 'UPI',
  recurringExpenses: false,
  taxGst: false
};

const CATEGORY_ICONS = {
  'Food & Dining': '🍽',
  Groceries: '🛒',
  Shopping: '🛍',
  'Travel & Fuel': '🚗',
  'Bills & Utilities': '⚡',
  General: '◎',
  Salary: '₹',
  Freelance: '◈',
  Investment: '↗',
  Gift: '🎁',
  Other: '•'
};

const getCategoryColor = (category) => {
  const c = (category || '').toLowerCase();

  if (c.includes('food')) return '#FF9F0A';
  if (c.includes('grocer')) return '#30D158';
  if (c.includes('travel') || c.includes('fuel')) return '#0A84FF';
  if (c.includes('shop')) return '#BF5AF2';
  if (c.includes('bill')) return '#FF453A';
  if (c.includes('salary')) return '#30D158';
  if (c.includes('investment')) return '#64D2FF';

  return '#64D2FF';
};

const money = (value, symbol = '₹') => {
  return `${symbol}${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

const getInitials = (name = 'User') => {
  return name
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((x) => x[0])
    .join('')
    .toUpperCase();
};

/* =========================================================
   REUSABLE UI
========================================================= */

function GlassCard({ children, style = {}, className = '' }) {
  return (
    <div
      className={className}
      style={{
        background:
          'linear-gradient(145deg, rgba(20,26,38,0.94), rgba(9,12,18,0.97))',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        boxShadow: '0 18px 50px rgba(0,0,0,0.28)',
        ...style
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          fontWeight: 800
        }}
      >
        {Icon && (
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 10,
              background: 'rgba(10,132,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon size={15} color="#0A84FF" />
          </div>
        )}

        <span>{title}</span>
      </div>

      {subtitle && (
        <div
          style={{
            marginTop: 3,
            marginLeft: Icon ? 38 : 0,
            fontSize: 10,
            color: 'rgba(235,235,245,0.42)'
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}

function SettingRow({
  icon: Icon,
  title,
  description,
  value,
  onClick,
  danger = false,
  toggle,
  checked,
  disabled = false
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '13px 4px',
        background: 'transparent',
        border: 'none',
        color: '#fff',
        textAlign: 'left',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.55 : 1
      }}
    >
      {Icon && (
        <div
          style={{
            flex: '0 0 auto',
            width: 38,
            height: 38,
            borderRadius: 12,
            background: danger
              ? 'rgba(255,69,58,0.09)'
              : 'rgba(255,255,255,0.045)',
            border: `1px solid ${
              danger
                ? 'rgba(255,69,58,0.15)'
                : 'rgba(255,255,255,0.06)'
            }`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon size={17} color={danger ? '#FF453A' : '#AAB7CA'} />
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 750,
            color: danger ? '#FF6B63' : '#FFFFFF'
          }}
        >
          {title}
        </div>

        {description && (
          <div
            style={{
              fontSize: 9.5,
              color: 'rgba(235,235,245,0.42)',
              marginTop: 3,
              lineHeight: 1.35
            }}
          >
            {description}
          </div>
        )}
      </div>

      {value && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'rgba(235,235,245,0.5)',
            maxWidth: 100,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {value}
        </span>
      )}

      {toggle && (
        <span
          style={{
            width: 40,
            height: 23,
            borderRadius: 20,
            padding: 2,
            background: checked ? '#0A84FF' : 'rgba(255,255,255,0.12)',
            transition: '0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: checked ? 'flex-end' : 'flex-start'
          }}
        >
          <span
            style={{
              width: 19,
              height: 19,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 2px 7px rgba(0,0,0,0.3)'
            }}
          />
        </span>
      )}

      {!toggle && onClick && <ChevronRight size={15} color="#596579" />}
    </button>
  );
}

function Modal({ children, onClose, width = 360 }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.78)',
        backdropFilter: 'blur(18px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18
      }}
      onMouseDown={onClose}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: width,
          maxHeight: '88vh',
          overflowY: 'auto',
          background: '#111621',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 26,
          padding: 20,
          boxShadow: '0 30px 80px rgba(0,0,0,0.65)'
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const saved = localStorage.getItem('smart_expense_settings');
      const start = saved ? JSON.parse(saved)?.startScreen : 'Dashboard';
      if (start === 'Ledger') return 'transactions';
      if (start === 'Profile') return 'profile';
    } catch {}
    return 'home';
  });

  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('smart_expense_settings');
      return saved
        ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
        : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [profile, setProfile] = useState({
    username: 'User',
    email: 'user@finance.local',
    currency: '₹',
    monthly_budget: 50000
  });

  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editCurrency, setEditCurrency] = useState('₹');

  const [profileSaving, setProfileSaving] = useState(false);

  const [expenses, setExpenses] = useState([]);

  const [summary, setSummary] = useState({
    total_income: 0,
    total_expenses: 0,
    net_balance: 0,
    ocr_scanned_count: 0
  });

  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  const [entryType, setEntryType] = useState('EXPENSE');
  const [formAmount, setFormAmount] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Food & Dining');
  const [formDate, setFormDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [formAccount, setFormAccount] = useState('Primary Bank');
  const [formPaymentMethod, setFormPaymentMethod] = useState('UPI');
  const [formNotes, setFormNotes] = useState('');

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [accounts] = useState([
    {
      id: 1,
      name: 'Primary Bank',
      type: 'BANK',
      balance: 0
    },
    {
      id: 2,
      name: 'Personal Cash Vault',
      type: 'CASH',
      balance: 0
    }
  ]);

  const [activeSettingsModal, setActiveSettingsModal] = useState(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetDraft, setBudgetDraft] = useState('');
  const [budgetSaving, setBudgetSaving] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const currencySymbol = profile.currency || '₹';

  /* =======================================================
     SETTINGS
  ======================================================= */

  const updateSetting = (key, value) => {
    const next = {
      ...settings,
      [key]: value
    };

    setSettings(next);

    try {
      localStorage.setItem(
        'smart_expense_settings',
        JSON.stringify(next)
      );
    } catch {
      // Ignore local storage errors.
    }
  };

  /* =======================================================
     API
  ======================================================= */

  const loadProfile = async () => {
    try {
      const res = await api.get('/api/profile/');

      if (res.data) {
        const next = {
          username: res.data.username || 'User',
          email: res.data.email || '',
          currency: res.data.currency || '₹',
          monthly_budget: Number(res.data.monthly_budget ?? 0)
        };

        setProfile(next);
        setEditUsername(next.username);
        setEditEmail(next.email);
        setEditBudget(next.monthly_budget);
        setEditCurrency(next.currency);
      }
    } catch (err) {
      console.warn('Profile sync paused:', err);
    }
  };

  const loadLedger = async () => {
    try {
      const [expRes, sumRes] = await Promise.all([
        api.get('/api/expenses/'),
        api.get('/api/dashboard/')
      ]);

      const rawTransactions = expRes.data || [];

      const map = new Map();

      rawTransactions.forEach((item) => {
        if (!map.has(item.id)) {
          map.set(item.id, item);
        }
      });

      setExpenses(Array.from(map.values()));

      setSummary(
        sumRes.data || {
          total_income: 0,
          total_expenses: 0,
          net_balance: 0,
          ocr_scanned_count: 0
        }
      );
    } catch (err) {
      console.warn('Sync delayed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    loadLedger();
  }, []);

  const handleSync = async () => {
    if (isSyncing) return;

    setIsSyncing(true);

    await Promise.all([
      loadProfile(),
      loadLedger()
    ]);

    setTimeout(() => {
      setIsSyncing(false);
    }, 700);
  };

  /* =======================================================
     PROFILE
  ======================================================= */

  const openEditProfile = () => {
    setEditUsername(profile.username || '');
    setEditEmail(profile.email || '');
    setEditCurrency(profile.currency || '₹');
    setEditBudget(String(Number(profile.monthly_budget) || ''));
    setShowEditProfileModal(true);
  };

  const openBudgetModal = () => {
    setBudgetDraft(String(Number(profile.monthly_budget) || ''));
    setShowBudgetModal(true);
  };

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    const amount = Number(budgetDraft);
    if (!Number.isFinite(amount) || amount < 0) return;

    setBudgetSaving(true);
    const nextProfile = { ...profile, monthly_budget: amount };
    setProfile(nextProfile);

    try {
      const res = await api.put('/api/profile/', {
        username: profile.username,
        email: profile.email,
        currency: profile.currency,
        monthly_budget: amount
      });
      if (res.data) {
        setProfile((prev) => ({
          ...prev,
          monthly_budget: Number(res.data.monthly_budget ?? amount)
        }));
      }
    } catch (err) {
      console.warn('Budget saved locally; server sync unavailable:', err);
    } finally {
      setBudgetSaving(false);
      setShowBudgetModal(false);
    }
  };

  const openSettingsAction = (modal) => setActiveSettingsModal(modal);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setProfileSaving(true);

    try {
      const res = await api.put('/api/profile/', {
        username: editUsername.trim(),
        email: editEmail.trim(),
        currency: editCurrency,
        monthly_budget: Number(editBudget) || 0
      });

      setProfile({
        username: res.data.username || editUsername,
        email: res.data.email || editEmail,
        currency: res.data.currency || editCurrency,
        monthly_budget:
          Number(res.data.monthly_budget ?? Number(editBudget) ?? 0)
      });

      setShowEditProfileModal(false);
    } catch (err) {
      // Keep the profile usable even when the API is temporarily unavailable.
      setProfile({
        username: editUsername.trim() || 'User',
        email: editEmail.trim(),
        currency: editCurrency || '₹',
        monthly_budget: Number(editBudget) || 0
      });
      console.warn('Profile saved locally; server sync unavailable:', err);
      setShowEditProfileModal(false);
    } finally {
      setProfileSaving(false);
    }
  };

  /* =======================================================
     TRANSACTIONS
  ======================================================= */

  const handleSaveTransaction = async (customTx) => {
    setErrorMessage('');
    setSuccessMessage('');

    const isCustom = Boolean(customTx && customTx.title);

    const amount = isCustom
      ? Number(customTx.amount)
      : Number(formAmount);

    const title = isCustom
      ? customTx.title
      : formTitle.trim();

    const type = isCustom
      ? customTx.transaction_type
      : entryType;

    const category = isCustom
      ? customTx.category
      : formCategory;

    const account = isCustom
      ? customTx.account
      : formAccount;

    const method = isCustom
      ? customTx.payment_method
      : formPaymentMethod;

    const date = isCustom
      ? customTx.date
      : formDate;

    const notes = isCustom
      ? customTx.notes
      : formNotes;

    const receipt = isCustom
      ? customTx.receipt_image
      : null;

    if (!amount || amount <= 0 || !title) {
      setErrorMessage(
        'Please enter a valid amount and description.'
      );
      return;
    }

    setSubmitting(true);

    try {
      const payload = new FormData();

      payload.append('title', title);
      payload.append('amount', amount);
      payload.append('transaction_type', type);
      payload.append('category', category);
      payload.append('account', account);
      payload.append('payment_method', method);
      payload.append('date', date);
      payload.append('notes', notes || '');

      if (receipt) {
        payload.append('receipt_image', receipt);
      }

      const res = await api.post(
        '/api/expenses/',
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setExpenses((prev) => [
        res.data,
        ...prev.filter((item) => item.id !== res.data.id)
      ]);

      const isIncome = type === 'INCOME';

      setSummary((prev) => ({
        ...prev,
        total_income: isIncome
          ? Number(prev.total_income || 0) + amount
          : Number(prev.total_income || 0),

        total_expenses: !isIncome
          ? Number(prev.total_expenses || 0) + amount
          : Number(prev.total_expenses || 0),

        net_balance: isIncome
          ? Number(prev.net_balance || 0) + amount
          : Number(prev.net_balance || 0) - amount,

        ocr_scanned_count: receipt
          ? Number(prev.ocr_scanned_count || 0) + 1
          : Number(prev.ocr_scanned_count || 0)
      }));

      if (!isCustom) {
        setFormAmount('');
        setFormTitle('');
        setFormNotes('');

        setSuccessMessage(
          `Successfully saved ${type.toLowerCase()} of ${money(
            amount,
            currencySymbol
          )}.`
        );
      }

      await loadLedger();
    } catch (err) {
      setErrorMessage(
        err.response?.data?.error ||
          'Unable to record transaction.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const oldExpenses = expenses;

    setExpenses((prev) =>
      prev.filter((item) => item.id !== id)
    );

    try {
      await api.delete(`/api/expenses/${id}/`);
      await loadLedger();
    } catch (err) {
      setExpenses(oldExpenses);
      alert('Unable to delete this transaction.');
    }
  };

  /* =======================================================
     COMPUTED DATA
  ======================================================= */

  const categoryStats = useMemo(() => {
    const stats = {};

    expenses
      .filter(
        (item) => item.transaction_type === 'EXPENSE'
      )
      .forEach((item) => {
        const amount = Number(item.amount) || 0;

        stats[item.category] =
          (stats[item.category] || 0) + amount;
      });

    return stats;
  }, [expenses]);

  const topCategory = useMemo(() => {
    const entries = Object.entries(categoryStats);

    if (!entries.length) return null;

    return entries.sort((a, b) => b[1] - a[1])[0];
  }, [categoryStats]);

  // Analytics data — derived from the same real transactions already loaded by the dashboard.
  const monthlyStats = useMemo(() => {
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        label: d.toLocaleDateString('en-US', { month: 'short' }),
        income: 0,
        expense: 0
      });
    }

    const byKey = Object.fromEntries(months.map((m) => [m.key, m]));

    expenses.forEach((tx) => {
      const d = new Date(tx.date || tx.created_at || '');
      if (Number.isNaN(d.getTime())) return;

      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!byKey[key]) return;

      const amount = Number(tx.amount) || 0;
      if (tx.transaction_type === 'INCOME') byKey[key].income += amount;
      if (tx.transaction_type === 'EXPENSE') byKey[key].expense += amount;
    });

    return months;
  }, [expenses]);

  const analyticsMax = useMemo(() => {
    const values = monthlyStats.flatMap((m) => [m.income, m.expense]);
    return Math.max(...values, 1);
  }, [monthlyStats]);

  const filteredTransactions = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return expenses.filter((tx) => {
      const title = String(tx.title || '').toLowerCase();
      const category = String(
        tx.category || ''
      ).toLowerCase();

      const matchSearch =
        title.includes(query) ||
        category.includes(query);

      const matchType =
        filterType === 'ALL' ||
        tx.transaction_type === filterType;

      return matchSearch && matchType;
    });
  }, [expenses, searchQuery, filterType]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTransactions.length / itemsPerPage
    )
  );

  const paginatedTransactions =
    filteredTransactions.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  const budget = Number(profile.monthly_budget) || 0;

  const expenseTotal =
    Number(summary.total_expenses) || 0;

  const budgetPct =
    budget > 0
      ? Math.min(Math.round((expenseTotal / budget) * 100), 100)
      : 0;

  const remainingBudget = Math.max(
    budget - expenseTotal,
    0
  );

  const scannedReceipts =
    Number(summary.ocr_scanned_count) || 0;

  /* =======================================================
     DYNAMIC SMART INSIGHT
  ======================================================= */

  const smartInsight = useMemo(() => {
    if (!expenses.length) {
      return {
        title: 'Start your financial journey',
        description:
          'Add your first transaction or scan a receipt to unlock spending insights.',
        icon: Sparkles
      };
    }

    if (budget > 0 && expenseTotal > budget) {
      return {
        title: 'Budget limit reached',
        description:
          'Your recorded expenses are currently above the monthly budget.',
        icon: AlertTriangle
      };
    }

    if (topCategory) {
      return {
        title: `${topCategory[0]} is your top category`,
        description: `You have recorded ${money(
          topCategory[1],
          currencySymbol
        )} in this category.`,
        icon: TrendingUp
      };
    }

    return {
      title: 'Your finances are being tracked',
      description:
        'Keep adding transactions to build a clearer spending picture.',
      icon: BrainCircuit
    };
  }, [
    expenses.length,
    budget,
    expenseTotal,
    topCategory,
    currencySymbol
  ]);

  // React component names must start with an uppercase letter.
  const InsightIcon = smartInsight.icon;

  /* =======================================================
     CSV EXPORT
  ======================================================= */

  const exportCSV = () => {
    if (!expenses.length) {
      alert('There are no transactions to export.');
      return;
    }

    const headers = [
      'Title',
      'Amount',
      'Type',
      'Category',
      'Account',
      'Payment Method',
      'Date',
      'Notes'
    ];

    const rows = expenses.map((item) => [
      item.title || '',
      item.amount || 0,
      item.transaction_type || '',
      item.category || '',
      item.account || '',
      item.payment_method || '',
      item.date || '',
      item.notes || ''
    ]);

    const csv = [
      headers,
      ...rows
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = `smart-expense-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    a.click();

    URL.revokeObjectURL(url);
  };

  /* =======================================================
     HEADER
  ======================================================= */

  const renderHeader = () => (
    <header
      className="smart-expense-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 90,
        background: 'rgba(5,7,10,0.86)',
        backdropFilter: 'blur(24px)',
        borderBottom:
          '1px solid rgba(255,255,255,0.06)',
        padding: '34px 18px 13px'
      }}
    >
      <div
        className="smart-expense-header-inner"
        style={{
          maxWidth: 720,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background:
                'linear-gradient(135deg,#0A84FF,#6E4BFF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow:
                '0 8px 25px rgba(10,132,255,0.28)'
            }}
          >
            <Sparkles size={18} color="#fff" />
          </div>

          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 850
              }}
            >
              Smart Expense
            </div>

            <div
              style={{
                fontSize: 9.5,
                color:
                  'rgba(235,235,245,0.42)',
                marginTop: 2
              }}
            >
              AI-powered financial control
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7
          }}
        >
          <button
            onClick={() => setIsOcrModalOpen(true)}
            style={{
              height: 34,
              padding: '0 11px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              borderRadius: 11,
              border:
                '1px solid rgba(10,132,255,0.4)',
              background:
                'rgba(10,132,255,0.13)',
              color: '#0A84FF',
              fontSize: 10.5,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            <Camera size={15} />
            Scan
          </button>

          <button
            onClick={handleSync}
            title="Sync"
            style={{
              width: 34,
              height: 34,
              borderRadius: 11,
              border:
                '1px solid rgba(255,255,255,0.08)',
              background:
                'rgba(255,255,255,0.04)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <RefreshCw
              size={15}
              style={{
                transform: isSyncing
                  ? 'rotate(360deg)'
                  : 'none',
                transition:
                  'transform 0.7s linear'
              }}
            />
          </button>

          <button
            onClick={exportCSV}
            title="Export CSV"
            style={{
              width: 34,
              height: 34,
              borderRadius: 11,
              border:
                '1px solid rgba(255,255,255,0.08)',
              background:
                'rgba(255,255,255,0.04)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Download size={15} />
          </button>
        </div>
      </div>
    </header>
  );

  /* =======================================================
     HOME
  ======================================================= */

  const renderHome = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}
    >
      {/* Greeting */}
      <div>
        <div
          style={{
            fontSize: 11,
            color: 'rgba(235,235,245,0.45)'
          }}
        >
          Financial overview
        </div>

        <h2
          style={{
            margin: '3px 0 0',
            fontSize: 22,
            fontWeight: 850
          }}
        >
          Good day, {profile.username} 👋
        </h2>
      </div>

      {/* BALANCE */}
      <GlassCard
        style={{
          padding: 21,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 220,
            height: 220,
            right: -90,
            top: -100,
            borderRadius: '50%',
            background:
              'radial-gradient(circle,rgba(10,132,255,0.2),transparent 68%)',
            pointerEvents: 'none'
          }}
        />

        <div
          style={{
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: 0.7,
            fontWeight: 800,
            color:
              'rgba(235,235,245,0.48)'
          }}
        >
          Net Balance
        </div>

        <div
          style={{
            fontSize: 32,
            fontWeight: 900,
            marginTop: 5,
            letterSpacing: -1
          }}
        >
          {loading
            ? '—'
            : money(
                summary.net_balance,
                currencySymbol
              )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 9,
            marginTop: 17
          }}
        >
          <div
            style={{
              padding: 12,
              borderRadius: 16,
              background:
                'rgba(48,209,88,0.07)',
              border:
                '1px solid rgba(48,209,88,0.15)'
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: '#30D158',
                fontWeight: 800
              }}
            >
              INCOME
            </div>

            <div
              style={{
                fontSize: 14,
                fontWeight: 850,
                marginTop: 4
              }}
            >
              +{money(
                summary.total_income,
                currencySymbol
              )}
            </div>
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 16,
              background:
                'rgba(255,69,58,0.07)',
              border:
                '1px solid rgba(255,69,58,0.15)'
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: '#FF453A',
                fontWeight: 800
              }}
            >
              EXPENSES
            </div>

            <div
              style={{
                fontSize: 14,
                fontWeight: 850,
                marginTop: 4
              }}
            >
              -{money(
                summary.total_expenses,
                currencySymbol
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* BUDGET */}
      <GlassCard style={{ padding: 18 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 850
              }}
            >
              Monthly Budget
            </div>

            <div
              style={{
                fontSize: 9.5,
                color:
                  'rgba(235,235,245,0.42)',
                marginTop: 3
              }}
            >
              Track your monthly spending limit
            </div>
          </div>

          <div
            style={{
              fontSize: 12,
              fontWeight: 850,
              color:
                budgetPct >= 90
                  ? '#FF453A'
                  : '#30D158'
            }}
          >
            {budgetPct}%
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 17,
            fontSize: 10
          }}
        >
          <span>
            Spent{' '}
            <b>
              {money(
                expenseTotal,
                currencySymbol
              )}
            </b>
          </span>

          <span
            style={{
              color:
                'rgba(235,235,245,0.45)'
            }}
          >
            Budget{' '}
            {money(
              budget,
              currencySymbol
            )}
          </span>
        </div>

        <div
          style={{
            height: 7,
            marginTop: 8,
            borderRadius: 20,
            overflow: 'hidden',
            background:
              'rgba(255,255,255,0.07)'
          }}
        >
          <div
            style={{
              width: `${budgetPct}%`,
              height: '100%',
              borderRadius: 20,
              background:
                budgetPct >= 90
                  ? '#FF453A'
                  : '#0A84FF',
              transition: 'width .4s ease'
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 9,
            fontSize: 9.5
          }}
        >
          <span
            style={{
              color:
                'rgba(235,235,245,0.42)'
            }}
          >
            Remaining
          </span>

          <b
            style={{
              color:
                remainingBudget > 0
                  ? '#30D158'
                  : '#FF453A'
            }}
          >
            {money(
              remainingBudget,
              currencySymbol
            )}
          </b>
        </div>
      </GlassCard>

      {/* SMART INSIGHT */}
      <GlassCard
        style={{
          padding: 17,
          background:
            'linear-gradient(135deg,rgba(10,132,255,0.13),rgba(88,50,180,0.1))',
          border:
            '1px solid rgba(10,132,255,0.2)'
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start'
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background:
                'linear-gradient(135deg,#0A84FF,#7655FF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: '0 0 auto'
            }}
          >
            <InsightIcon
              size={19}
              color="#fff"
            />
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 850,
                  color: '#0A84FF',
                  textTransform: 'uppercase',
                  letterSpacing: 0.7
                }}
              >
                Smart Insight
              </span>

              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: '#30D158'
                }}
              />
            </div>

            <div
              style={{
                fontSize: 13,
                fontWeight: 850,
                marginTop: 4
              }}
            >
              {smartInsight.title}
            </div>

            <div
              style={{
                fontSize: 10,
                lineHeight: 1.5,
                color:
                  'rgba(235,235,245,0.48)',
                marginTop: 4
              }}
            >
              {smartInsight.description}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* QUICK ACTIONS */}
      <div>
        <SectionTitle
          icon={SlidersHorizontal}
          title="Quick Actions"
          subtitle="Manage your finances faster"
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(4, 1fr)',
            gap: 8
          }}
        >
          {[
            {
              label: 'Scan',
              icon: Camera,
              action: () =>
                setIsOcrModalOpen(true)
            },
            {
              label: 'Expense',
              icon: PlusCircle,
              action: () => {
                setActiveTab('add');
                setEntryType('EXPENSE');
              }
            },
            {
              label: 'Income',
              icon: CircleDollarSign,
              action: () => {
                setActiveTab('add');
                setEntryType('INCOME');
              }
            },
            {
              label: 'Ledger',
              icon: ArrowRightLeft,
              action: () =>
                setActiveTab('transactions')
            }
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                border: '1px solid rgba(255,255,255,0.07)',
                background:
                  'rgba(255,255,255,0.035)',
                borderRadius: 17,
                padding: '13px 5px',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 7
              }}
            >
              <item.icon
                size={18}
                color="#0A84FF"
              />

              <span
                style={{
                  fontSize: 9,
                  fontWeight: 750
                }}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* SPENDING OVERVIEW */}
      <GlassCard style={{ padding: 18 }}>
        <SectionTitle
          icon={PieChart}
          title="Spending Overview"
          subtitle="Based on your recorded expenses"
        />

        {Object.keys(categoryStats).length ===
        0 ? (
          <div
            style={{
              padding: '28px 10px',
              textAlign: 'center',
              color:
                'rgba(235,235,245,0.4)',
              fontSize: 11
            }}
          >
            No expense data available yet.
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 11,
              marginTop: 15
            }}
          >
            {Object.entries(categoryStats)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([category, amount]) => {
                const pct =
                  expenseTotal > 0
                    ? Math.round(
                        (amount /
                          expenseTotal) *
                          100
                      )
                    : 0;

                return (
                  <div key={category}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent:
                          'space-between',
                        marginBottom: 5
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700
                        }}
                      >
                        {category}
                      </span>

                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800
                        }}
                      >
                        {money(
                          amount,
                          currencySymbol
                        )}
                      </span>
                    </div>

                    <div
                      style={{
                        height: 5,
                        borderRadius: 10,
                        background:
                          'rgba(255,255,255,0.06)',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background:
                            getCategoryColor(
                              category
                            ),
                          borderRadius: 10
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </GlassCard>

      {/* RECEIPT STATUS */}
      <GlassCard
        style={{
          padding: 17,
          display: 'flex',
          alignItems: 'center',
          gap: 13
        }}
      >
        <div
          style={{
            width: 43,
            height: 43,
            borderRadius: 14,
            background:
              'rgba(10,132,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Receipt
            size={19}
            color="#0A84FF"
          />
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 850
            }}
          >
            AI Receipt Scanner
          </div>

          <div
            style={{
              fontSize: 9.5,
              color:
                'rgba(235,235,245,0.42)',
              marginTop: 3
            }}
          >
            {scannedReceipts} receipt
            {scannedReceipts === 1
              ? ''
              : 's'} scanned
          </div>
        </div>

        <button
          onClick={() => setIsOcrModalOpen(true)}
          style={{
            border: 'none',
            background:
              'rgba(10,132,255,0.12)',
            color: '#0A84FF',
            borderRadius: 11,
            padding: '8px 10px',
            fontSize: 9.5,
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          Scan
        </button>
      </GlassCard>

      {/* RECENT */}
      <GlassCard style={{ padding: 18 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 13
          }}
        >
          <SectionTitle
            icon={Receipt}
            title="Recent Transactions"
          />

          <button
            onClick={() =>
              setActiveTab('transactions')
            }
            style={{
              border: 'none',
              background: 'none',
              color: '#0A84FF',
              fontSize: 10,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            View All
          </button>
        </div>

        {expenses.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: 25,
              color:
                'rgba(235,235,245,0.4)',
              fontSize: 11
            }}
          >
            No transactions yet.
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 7
            }}
          >
            {expenses
              .slice(0, 5)
              .map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 8px',
                    borderBottom:
                      '1px solid rgba(255,255,255,0.045)'
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 11,
                      background:
                        'rgba(255,255,255,0.045)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13
                    }}
                  >
                    {CATEGORY_ICONS[
                      item.category
                    ] || '•'}
                  </div>

                  <div
                    style={{
                      flex: 1,
                      minWidth: 0
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11.5,
                        fontWeight: 750,
                        overflow: 'hidden',
                        textOverflow:
                          'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.title}
                    </div>

                    <div
                      style={{
                        fontSize: 9,
                        color:
                          'rgba(235,235,245,0.4)',
                        marginTop: 2
                      }}
                    >
                      {item.category} •{' '}
                      {item.date}
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 850,
                      color:
                        item.transaction_type ===
                        'INCOME'
                          ? '#30D158'
                          : '#FF453A'
                    }}
                  >
                    {item.transaction_type ===
                    'INCOME'
                      ? '+'
                      : '-'}
                    {money(
                      item.amount,
                      currencySymbol
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </GlassCard>
    </div>
  );

  /* =======================================================
     ADD
  ======================================================= */

  const renderAdd = () => (
    <GlassCard style={{ padding: 20 }}>
      <div
        style={{
          display: 'flex',
          background:
            'rgba(255,255,255,0.045)',
          borderRadius: 15,
          padding: 4,
          marginBottom: 20
        }}
      >
        {['EXPENSE', 'INCOME'].map(
          (type) => (
            <button
              key={type}
              onClick={() => {
                setEntryType(type);
                setFormCategory(
                  type === 'INCOME'
                    ? 'Salary'
                    : 'Food & Dining'
                );
              }}
              style={{
                flex: 1,
                border: 'none',
                borderRadius: 11,
                padding: 10,
                background:
                  entryType === type
                    ? type === 'INCOME'
                      ? '#30D158'
                      : '#0A84FF'
                    : 'transparent',
                color: '#fff',
                fontWeight: 800,
                fontSize: 11,
                cursor: 'pointer'
              }}
            >
              {type === 'INCOME'
                ? 'Income'
                : 'Expense'}
            </button>
          )
        )}
      </div>

      {successMessage && (
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            padding: 11,
            borderRadius: 12,
            background:
              'rgba(48,209,88,0.1)',
            color: '#30D158',
            fontSize: 10.5,
            fontWeight: 750,
            marginBottom: 13
          }}
        >
          <CheckCircle2 size={15} />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            padding: 11,
            borderRadius: 12,
            background:
              'rgba(255,69,58,0.1)',
            color: '#FF453A',
            fontSize: 10.5,
            fontWeight: 750,
            marginBottom: 13
          }}
        >
          <AlertTriangle size={15} />
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveTransaction();
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}
      >
        <div
          style={{
            textAlign: 'center',
            padding: '8px 0 15px'
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              color:
                'rgba(235,235,245,0.45)'
            }}
          >
            AMOUNT
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 4
            }}
          >
            <span
              style={{
                fontSize: 28,
                fontWeight: 900,
                color:
                  entryType === 'INCOME'
                    ? '#30D158'
                    : '#0A84FF'
              }}
            >
              {currencySymbol}
            </span>

            <input
              type="number"
              step="any"
              required
              value={formAmount}
              onChange={(e) =>
                setFormAmount(e.target.value)
              }
              placeholder="0.00"
              style={{
                width: 170,
                background: 'transparent',
                border: 'none',
                borderBottom:
                  '2px solid rgba(255,255,255,0.12)',
                outline: 'none',
                color: '#fff',
                textAlign: 'center',
                fontSize: 30,
                fontWeight: 900
              }}
            />
          </div>
        </div>

        <label style={{ fontSize: 10 }}>
          <span
            style={{
              display: 'block',
              marginBottom: 5,
              color:
                'rgba(235,235,245,0.5)',
              fontWeight: 750
            }}
          >
            DESCRIPTION / MERCHANT
          </span>

          <input
            required
            value={formTitle}
            onChange={(e) =>
              setFormTitle(e.target.value)
            }
            placeholder="e.g. Swiggy, Amazon, Salary"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background:
                'rgba(255,255,255,0.045)',
              border:
                '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: 11,
              color: '#fff',
              outline: 'none'
            }}
          />
        </label>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10
          }}
        >
          <label style={{ fontSize: 10 }}>
            <span
              style={{
                display: 'block',
                marginBottom: 5,
                color:
                  'rgba(235,235,245,0.5)',
                fontWeight: 750
              }}
            >
              CATEGORY
            </span>

            <select
              value={formCategory}
              onChange={(e) =>
                setFormCategory(e.target.value)
              }
              style={{
                width: '100%',
                background: '#151A24',
                border:
                  '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: 11,
                color: '#fff'
              }}
            >
              {entryType === 'INCOME' ? (
                <>
                  <option>Salary</option>
                  <option>Freelance</option>
                  <option>Investment</option>
                  <option>Gift</option>
                  <option>Other</option>
                </>
              ) : (
                <>
                  <option>Food & Dining</option>
                  <option>Groceries</option>
                  <option>Shopping</option>
                  <option>Travel & Fuel</option>
                  <option>Bills & Utilities</option>
                  <option>General</option>
                </>
              )}
            </select>
          </label>

          <label style={{ fontSize: 10 }}>
            <span
              style={{
                display: 'block',
                marginBottom: 5,
                color:
                  'rgba(235,235,245,0.5)',
                fontWeight: 750
              }}
            >
              ACCOUNT
            </span>

            <select
              value={formAccount}
              onChange={(e) =>
                setFormAccount(e.target.value)
              }
              style={{
                width: '100%',
                background: '#151A24',
                border:
                  '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: 11,
                color: '#fff'
              }}
            >
              {accounts.map((account) => (
                <option
                  key={account.id}
                  value={account.name}
                >
                  {account.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10
          }}
        >
          <label style={{ fontSize: 10 }}>
            <span
              style={{
                display: 'block',
                marginBottom: 5,
                color:
                  'rgba(235,235,245,0.5)',
                fontWeight: 750
              }}
            >
              PAYMENT
            </span>

            <select
              value={formPaymentMethod}
              onChange={(e) =>
                setFormPaymentMethod(
                  e.target.value
                )
              }
              style={{
                width: '100%',
                background: '#151A24',
                border:
                  '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: 11,
                color: '#fff'
              }}
            >
              <option>UPI</option>
              <option>Card</option>
              <option>Cash</option>
              <option>Bank Transfer</option>
            </select>
          </label>

          <label style={{ fontSize: 10 }}>
            <span
              style={{
                display: 'block',
                marginBottom: 5,
                color:
                  'rgba(235,235,245,0.5)',
                fontWeight: 750
              }}
            >
              DATE
            </span>

            <input
              type="date"
              value={formDate}
              onChange={(e) =>
                setFormDate(e.target.value)
              }
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: '#151A24',
                border:
                  '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: 10,
                color: '#fff'
              }}
            />
          </label>
        </div>

        <textarea
          value={formNotes}
          onChange={(e) =>
            setFormNotes(e.target.value)
          }
          placeholder="Notes (optional)"
          rows={3}
          style={{
            resize: 'none',
            width: '100%',
            boxSizing: 'border-box',
            background:
              'rgba(255,255,255,0.045)',
            border:
              '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: 11,
            color: '#fff',
            outline: 'none'
          }}
        />

        <button
          disabled={submitting}
          type="submit"
          style={{
            padding: 14,
            borderRadius: 14,
            border: 'none',
            background:
              entryType === 'INCOME'
                ? '#30D158'
                : '#0A84FF',
            color: '#fff',
            fontWeight: 850,
            cursor: 'pointer'
          }}
        >
          {submitting
            ? 'Saving...'
            : `Save ${
                entryType === 'INCOME'
                  ? 'Income'
                  : 'Expense'
              }`}
        </button>
      </form>
    </GlassCard>
  );

  /* =======================================================
     LEDGER
  ======================================================= */

  const renderLedger = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: 21,
            fontWeight: 850
          }}
        >
          Ledger
        </h2>

        <p
          style={{
            margin: '4px 0 0',
            fontSize: 10,
            color:
              'rgba(235,235,245,0.42)'
          }}
        >
          All your income and expenses
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 8
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '0 12px',
            borderRadius: 14,
            background:
              'rgba(255,255,255,0.045)',
            border:
              '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <Search
            size={14}
            color="#697589"
          />

          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search transactions"
            style={{
              width: '100%',
              padding: 11,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: 11
            }}
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            background: '#151A24',
            border:
              '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            color: '#fff',
            padding: '0 9px',
            fontSize: 10
          }}
        >
          <option value="ALL">All</option>
          <option value="EXPENSE">
            Expense
          </option>
          <option value="INCOME">
            Income
          </option>
        </select>
      </div>

      {paginatedTransactions.length === 0 ? (
        <GlassCard
          style={{
            padding: 40,
            textAlign: 'center'
          }}
        >
          <Receipt
            size={28}
            color="#596579"
          />

          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              fontWeight: 750
            }}
          >
            No transactions found
          </div>
        </GlassCard>
      ) : (
        paginatedTransactions.map((item) => (
          <GlassCard
            key={item.id}
            style={{
              padding: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 11
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 13,
                background:
                  'rgba(255,255,255,0.045)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14
              }}
            >
              {CATEGORY_ICONS[
                item.category
              ] || '•'}
            </div>

            <div
              style={{
                flex: 1,
                minWidth: 0
              }}
            >
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 800
                }}
              >
                {item.title}
              </div>

              <div
                style={{
                  fontSize: 9,
                  color:
                    'rgba(235,235,245,0.4)',
                  marginTop: 3
                }}
              >
                {item.category} •{' '}
                {item.payment_method || '—'} •{' '}
                {item.date}
              </div>
            </div>

            <div
              style={{
                textAlign: 'right'
              }}
            >
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 850,
                  color:
                    item.transaction_type ===
                    'INCOME'
                      ? '#30D158'
                      : '#FF453A'
                }}
              >
                {item.transaction_type ===
                'INCOME'
                  ? '+'
                  : '-'}
                {money(
                  item.amount,
                  currencySymbol
                )}
              </div>

              <button
                onClick={() =>
                  handleDelete(item.id)
                }
                style={{
                  marginTop: 4,
                  border: 'none',
                  background: 'none',
                  color:
                    'rgba(255,69,58,0.55)',
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </GlassCard>
        ))
      )}

      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginTop: 4
          }}
        >
          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((p) =>
                Math.max(1, p - 1)
              )
            }
            style={{
              border:
                '1px solid rgba(255,255,255,0.08)',
              background:
                'rgba(255,255,255,0.04)',
              color: '#fff',
              borderRadius: 10,
              padding: '7px 11px',
              cursor: 'pointer'
            }}
          >
            Previous
          </button>

          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 7px',
              fontSize: 10,
              color:
                'rgba(235,235,245,0.5)'
            }}
          >
            {currentPage} / {totalPages}
          </span>

          <button
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(totalPages, p + 1)
              )
            }
            style={{
              border:
                '1px solid rgba(255,255,255,0.08)',
              background:
                'rgba(255,255,255,0.04)',
              color: '#fff',
              borderRadius: 10,
              padding: '7px 11px',
              cursor: 'pointer'
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );

  /* =======================================================
     ANALYTICS
  ======================================================= */

  const renderAnalytics = () => {
    const categoryEntries = Object.entries(categoryStats).sort((a, b) => b[1] - a[1]);
    const topFive = categoryEntries.slice(0, 5);
    const pieTotal = topFive.reduce((sum, [, value]) => sum + value, 0);
    const pieStops = (() => {
      let cursor = 0;
      return topFive.map(([category, value]) => {
        const start = cursor;
        cursor += pieTotal > 0 ? (value / pieTotal) * 100 : 0;
        return `${getCategoryColor(category)} ${start}% ${cursor}%`;
      });
    })();

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>Analytics</h2>
              <p style={{ margin: '5px 0 0', fontSize: 10, color: 'rgba(235,235,245,0.42)' }}>Visual insights from your real transactions</p>
            </div>
            <div style={{ fontSize: 9, color: 'rgba(235,235,245,0.4)' }}>Last 6 months</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 9 }}>
          {[
            ['Total Spending', money(summary.total_expenses, currencySymbol), '#FF453A'],
            ['Total Income', money(summary.total_income, currencySymbol), '#30D158'],
            ['Budget Used', `${budgetPct}%`, '#0A84FF'],
            ['Top Category', topCategory ? topCategory[0] : '—', '#BF5AF2']
          ].map(([title, value, color]) => (
            <GlassCard key={title} style={{ padding: 14 }}>
              <div style={{ fontSize: 9, color: 'rgba(235,235,245,0.42)', fontWeight: 750 }}>{title}</div>
              <div style={{ marginTop: 6, fontSize: 15, fontWeight: 900, color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
            </GlassCard>
          ))}
        </div>

        <GlassCard style={{ padding: 16 }}>
          <SectionTitle icon={TrendingUp} title="Income vs Expenses" subtitle="Monthly cash-flow trend" />
          {expenses.length === 0 ? (
            <div style={{ padding: '30px 8px', textAlign: 'center', color: 'rgba(235,235,245,0.4)', fontSize: 11 }}>Add transactions to unlock your trend chart.</div>
          ) : (
            <div style={{ marginTop: 14 }}>
              <div style={{ height: 170, display: 'flex', alignItems: 'flex-end', gap: 7, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 4 }}>
                {monthlyStats.map((m) => (
                  <div key={m.key} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 3 }}>
                    <div title={`Income ${money(m.income, currencySymbol)}`} style={{ width: '34%', height: `${Math.max((m.income / analyticsMax) * 100, m.income ? 4 : 1)}%`, minHeight: 2, borderRadius: '6px 6px 2px 2px', background: 'linear-gradient(180deg,#30D158,#159447)' }} />
                    <div title={`Expenses ${money(m.expense, currencySymbol)}`} style={{ width: '34%', height: `${Math.max((m.expense / analyticsMax) * 100, m.expense ? 4 : 1)}%`, minHeight: 2, borderRadius: '6px 6px 2px 2px', background: 'linear-gradient(180deg,#FF453A,#b92b25)' }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 7, marginTop: 7 }}>
                {monthlyStats.map((m) => <div key={m.key} style={{ flex: 1, textAlign: 'center', fontSize: 8.5, color: 'rgba(235,235,245,0.42)' }}>{m.label}</div>)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 15, marginTop: 12, fontSize: 9, color: 'rgba(235,235,245,0.5)' }}>
                <span><i style={{ display: 'inline-block', width: 7, height: 7, borderRadius: 2, background: '#30D158', marginRight: 5 }} />Income</span>
                <span><i style={{ display: 'inline-block', width: 7, height: 7, borderRadius: 2, background: '#FF453A', marginRight: 5 }} />Expenses</span>
              </div>
            </div>
          )}
        </GlassCard>

        <GlassCard style={{ padding: 16 }}>
          <SectionTitle icon={PieChart} title="Spending by Category" subtitle="Your biggest expense areas" />
          {topFive.length === 0 ? (
            <div style={{ padding: '30px 8px', textAlign: 'center', color: 'rgba(235,235,245,0.4)', fontSize: 11 }}>No expense data available yet.</div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 14 }}>
              <div style={{ width: 132, height: 132, borderRadius: '50%', flexShrink: 0, background: `conic-gradient(${pieStops.join(',')})`, position: 'relative', boxShadow: '0 0 28px rgba(10,132,255,0.12)' }}>
                <div style={{ position: 'absolute', inset: 29, borderRadius: '50%', background: '#0b0f17', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 8, color: 'rgba(235,235,245,0.42)' }}>TOTAL</span>
                  <b style={{ fontSize: 11, marginTop: 3 }}>{money(expenseTotal, currencySymbol)}</b>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
                {topFive.map(([category, amount]) => {
                  const pct = pieTotal > 0 ? Math.round((amount / pieTotal) * 100) : 0;
                  return (
                    <div key={category} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 9.5 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 3, background: getCategoryColor(category), flexShrink: 0 }} />
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{category}</span>
                      <b>{pct}%</b>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </GlassCard>

        <GlassCard style={{ padding: 16 }}>
          <SectionTitle icon={BarChart3} title="Category Analysis" subtitle="Compare your recorded expenses" />
          {categoryEntries.length === 0 ? (
            <div style={{ padding: '24px 8px', textAlign: 'center', color: 'rgba(235,235,245,0.4)', fontSize: 11 }}>Nothing to analyse yet.</div>
          ) : (
            categoryEntries.slice(0, 8).map(([category, amount]) => {
              const pct = expenseTotal > 0 ? Math.round((amount / expenseTotal) * 100) : 0;
              return (
                <div key={category} style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 9.5 }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{category}</span>
                    <b style={{ whiteSpace: 'nowrap' }}>{money(amount, currencySymbol)} · {pct}%</b>
                  </div>
                  <div style={{ height: 7, marginTop: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 20, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: getCategoryColor(category), borderRadius: 20, transition: 'width .4s ease' }} />
                  </div>
                </div>
              );
            })
          )}
        </GlassCard>

        <GlassCard style={{ padding: 16 }}>
          <SectionTitle icon={Wallet} title="Budget Health" subtitle="How much of your monthly limit is used" />
          <div style={{ marginTop: 15, height: 12, borderRadius: 20, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            <div style={{ width: `${budgetPct}%`, height: '100%', borderRadius: 20, background: budgetPct >= 90 ? '#FF453A' : budgetPct >= 70 ? '#FF9F0A' : '#30D158', transition: 'width .45s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 9.5, color: 'rgba(235,235,245,0.5)' }}>
            <span>Spent {money(expenseTotal, currencySymbol)}</span>
            <b style={{ color: budgetPct >= 90 ? '#FF453A' : '#30D158' }}>{budget > 0 ? `${budgetPct}% used` : 'Set a budget'}</b>
            <span>Budget {money(budget, currencySymbol)}</span>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ width: 42, height: 42, borderRadius: 14, background: 'rgba(10,132,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BrainCircuit size={19} color="#0A84FF" />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 850 }}>Smart Analysis</div>
              <div style={{ marginTop: 3, fontSize: 9.5, lineHeight: 1.45, color: 'rgba(235,235,245,0.42)' }}>Charts are calculated from your actual recorded transactions and update automatically when new expenses or income are added.</div>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  };



  /* =======================================================
     PROFILE
  ======================================================= */


  const renderProfile = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 15
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 900
          }}
        >
          Preferences & Settings
        </h2>

        <p
          style={{
            margin: '4px 0 0',
            fontSize: 10,
            color:
              'rgba(235,235,245,0.42)'
          }}
        >
          Control your financial experience
        </p>
      </div>

      {/* PROFILE */}
      <GlassCard
        style={{
          padding: 18,
          background:
            'linear-gradient(135deg,rgba(19,28,45,0.96),rgba(10,13,20,0.98))'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 13
          }}
        >
          <div
            style={{
              width: 55,
              height: 55,
              borderRadius: 17,
              background:
                'linear-gradient(135deg,#0A84FF,#A04DFF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 900,
              boxShadow:
                '0 8px 25px rgba(10,132,255,0.22)'
            }}
          >
            {getInitials(
              profile.username
            )}
          </div>

          <div
            style={{
              flex: 1,
              minWidth: 0
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 850
              }}
            >
              {profile.username}
            </div>

            <div
              style={{
                fontSize: 10,
                color:
                  'rgba(235,235,245,0.45)',
                marginTop: 3
              }}
            >
              {profile.email}
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 7,
                padding:
                  '3px 7px',
                borderRadius: 7,
                background:
                  'rgba(48,209,88,0.08)',
                color: '#30D158',
                fontSize: 8.5,
                fontWeight: 800
              }}
            >
              <CheckCircle2 size={10} />
              ACCOUNT ACTIVE
            </div>
          </div>

          <button
            onClick={openEditProfile}
            style={{
              border:
                '1px solid rgba(255,255,255,0.08)',
              background:
                'rgba(255,255,255,0.045)',
              color: '#0A84FF',
              borderRadius: 10,
              padding: '7px 10px',
              fontSize: 9.5,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Edit
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            marginTop: 15
          }}
        >
          <div
            style={{
              padding: 11,
              borderRadius: 13,
              background:
                'rgba(255,255,255,0.035)'
            }}
          >
            <div
              style={{
                fontSize: 8.5,
                color:
                  'rgba(235,235,245,0.4)'
              }}
            >
              CURRENCY
            </div>

            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                marginTop: 3
              }}
            >
              {currencySymbol}
            </div>
          </div>

          <div
            style={{
              padding: 11,
              borderRadius: 13,
              background:
                'rgba(255,255,255,0.035)'
            }}
          >
            <div
              style={{
                fontSize: 8.5,
                color:
                  'rgba(235,235,245,0.4)'
              }}
            >
              MONTHLY BUDGET
            </div>

            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                marginTop: 3
              }}
            >
              {money(
                budget,
                currencySymbol
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* AI & OCR */}
      <div>
        <SectionTitle
          icon={BrainCircuit}
          title="AI & OCR"
          subtitle="Configure intelligent receipt processing"
        />

        <GlassCard style={{ padding: '4px 14px' }}>
          <SettingRow
            icon={Camera}
            title="AI Receipt Scanning"
            description="Automatically process scanned receipts"
            toggle
            checked={settings.aiReceiptScanning}
            onClick={() =>
              updateSetting(
                'aiReceiptScanning',
                !settings.aiReceiptScanning
              )
            }
          />

          <SettingRow
            icon={SlidersHorizontal}
            title="Auto Categorization"
            description="Automatically assign expense categories"
            toggle
            checked={settings.autoCategorization}
            onClick={() =>
              updateSetting(
                'autoCategorization',
                !settings.autoCategorization
              )
            }
          />

          <SettingRow
            icon={User}
            title="Merchant Detection"
            description="Identify merchants from receipts"
            toggle
            checked={settings.merchantDetection}
            onClick={() =>
              updateSetting(
                'merchantDetection',
                !settings.merchantDetection
              )
            }
          />

          <SettingRow
            icon={Receipt}
            title="Duplicate Detection"
            description="Detect repeated receipt entries"
            toggle
            checked={settings.duplicateDetection}
            onClick={() =>
              updateSetting(
                'duplicateDetection',
                !settings.duplicateDetection
              )
            }
          />

          <SettingRow
            icon={Eye}
            title="OCR Verification"
            description="Review uncertain extracted information"
            toggle
            checked={settings.ocrVerification}
            onClick={() =>
              updateSetting(
                'ocrVerification',
                !settings.ocrVerification
              )
            }
          />

          <SettingRow
            icon={Sparkles}
            title="Spending Insights"
            description="Enable smart spending analysis"
            toggle
            checked={settings.spendingInsights}
            onClick={() =>
              updateSetting(
                'spendingInsights',
                !settings.spendingInsights
              )
            }
          />
        </GlassCard>
      </div>

      {/* EXPENSE PREFERENCES */}
      <div>
        <SectionTitle
          icon={Wallet}
          title="Expense Preferences"
        />

        <GlassCard style={{ padding: '4px 14px' }}>
          <SettingRow
            icon={CircleDollarSign}
            title="Currency"
            description="Default currency for expenses"
            value={
              currencySymbol === '₹'
                ? 'INR (₹)'
                : currencySymbol
            }
            onClick={() =>
              setActiveSettingsModal(
                'currency'
              )
            }
          />

          <SettingRow
            icon={CalendarDays}
            title="Monthly Budget"
            description="Set your monthly spending limit"
            value={money(
              budget,
              currencySymbol
            )}
            onClick={openBudgetModal}
          />

          <SettingRow
            icon={CreditCard}
            title="Payment Methods"
            description="UPI, Card, Cash and Bank"
            value={settings.paymentMethod || 'UPI'}
            onClick={() =>
              setActiveSettingsModal(
                'payment'
              )
            }
          />

          <SettingRow
            icon={RotateCcw}
            title="Recurring Expenses"
            description="Manage recurring payment reminders"
            value={settings.recurringExpenses ? 'On' : 'Off'}
            onClick={() => openSettingsAction('recurring')}
          />

          <SettingRow
            icon={FileText}
            title="Tax / GST"
            description="Configure tax-related preferences"
            value={settings.taxGst ? 'On' : 'Off'}
            onClick={() => openSettingsAction('tax')}
          />
        </GlassCard>
      </div>

      {/* BUDGET & ALERTS */}
      <div>
        <SectionTitle
          icon={Bell}
          title="Budget & Alerts"
        />

        <GlassCard style={{ padding: '4px 14px' }}>
          <SettingRow
            icon={Bell}
            title="Budget Alerts"
            description="Alert when spending approaches budget"
            toggle
            checked={settings.budgetAlerts}
            onClick={() =>
              updateSetting(
                'budgetAlerts',
                !settings.budgetAlerts
              )
            }
          />

          <SettingRow
            icon={CalendarDays}
            title="Daily Summary"
            description="Daily expense summary preference"
            toggle
            checked={settings.dailySummary}
            onClick={() =>
              updateSetting(
                'dailySummary',
                !settings.dailySummary
              )
            }
          />

          <SettingRow
            icon={BarChart3}
            title="Weekly Summary"
            description="Weekly financial summary preference"
            toggle
            checked={settings.weeklySummary}
            onClick={() =>
              updateSetting(
                'weeklySummary',
                !settings.weeklySummary
              )
            }
          />

          <SettingRow
            icon={TrendingUp}
            title="Unusual Spending"
            description="Flag unusually high spending"
            toggle
            checked={settings.unusualSpending}
            onClick={() =>
              updateSetting(
                'unusualSpending',
                !settings.unusualSpending
              )
            }
          />

          <SettingRow
            icon={RotateCcw}
            title="Recurring Reminders"
            description="Reminder preference for recurring payments"
            toggle
            checked={settings.recurringReminder}
            onClick={() =>
              updateSetting(
                'recurringReminder',
                !settings.recurringReminder
              )
            }
          />
        </GlassCard>
      </div>

      {/* RECEIPT MANAGEMENT */}
      <div>
        <SectionTitle
          icon={Receipt}
          title="Receipt Management"
        />

        <GlassCard style={{ padding: '4px 14px' }}>
          <SettingRow
            icon={Receipt}
            title="Scanned Receipts"
            description="Receipts processed through OCR"
            value={`${scannedReceipts}`}
          />

          <SettingRow
            icon={Camera}
            title="Scan New Receipt"
            description="Open AI receipt scanner"
            value="Open"
            onClick={() =>
              setIsOcrModalOpen(true)
            }
          />

          <SettingRow
            icon={FileText}
            title="Scan History"
            description="Review transactions created from receipts"
            value="Ledger"
            onClick={() =>
              setActiveTab('transactions')
            }
          />

          <SettingRow
            icon={AlertTriangle}
            title="Failed OCR"
            description="Backend receipt status not available"
            value="Not available"
          />
        </GlassCard>
      </div>

      {/* BACKUP */}
      <div>
        <SectionTitle
          icon={Cloud}
          title="Backup & Data"
        />

        <GlassCard
          style={{
            padding: 16,
            background:
              'linear-gradient(135deg,rgba(10,132,255,0.1),rgba(10,13,20,0.95))'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            <div
              style={{
                width: 43,
                height: 43,
                borderRadius: 14,
                background:
                  'rgba(10,132,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Cloud
                size={20}
                color="#0A84FF"
              />
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 850
                }}
              >
                Cloud Sync
              </div>

              <div
                style={{
                  fontSize: 9.5,
                  color:
                    'rgba(235,235,245,0.42)',
                  marginTop: 3
                }}
              >
                Connected to your existing API
              </div>
            </div>

            <button
              onClick={handleSync}
              style={{
                border:
                  '1px solid rgba(10,132,255,0.3)',
                background:
                  'rgba(10,132,255,0.1)',
                color: '#0A84FF',
                borderRadius: 10,
                padding: '7px 10px',
                fontSize: 9,
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Sync
            </button>
          </div>
        </GlassCard>

        <GlassCard
          style={{
            marginTop: 8,
            padding: '4px 14px'
          }}
        >
          <SettingRow
            icon={Download}
            title="Export Expenses"
            description="Download your actual transaction data"
            value="CSV"
            onClick={exportCSV}
          />

          <SettingRow
            icon={Database}
            title="Local Preferences"
            description="App settings stored on this device"
            value="Active"
          />

          <SettingRow
            icon={RotateCcw}
            title="Restore Data"
            description="Use backend sync to refresh your data"
            value="Sync"
            onClick={handleSync}
          />
        </GlassCard>
      </div>

      {/* REPORTS */}
      <div>
        <SectionTitle
          icon={BarChart3}
          title="Reports & Export"
        />

        <GlassCard style={{ padding: '4px 14px' }}>
          <SettingRow
            icon={BarChart3}
            title="Monthly Reports"
            description="Review current month financial data"
            value="Analytics"
            onClick={() =>
              setActiveTab('analytics')
            }
          />

          <SettingRow
            icon={PieChart}
            title="Category Analysis"
            description="Analyze spending categories"
            value="Open"
            onClick={() =>
              setActiveTab('analytics')
            }
          />

          <SettingRow
            icon={Download}
            title="Export Data"
            description="Export actual transactions"
            value="CSV"
            onClick={exportCSV}
          />

          <SettingRow
            icon={FileText}
            title="PDF Report"
            description="PDF generator is not connected yet"
            value="Print / PDF"
            onClick={() => window.print()}
          />
        </GlassCard>
      </div>

      {/* SECURITY */}
      <div>
        <SectionTitle
          icon={ShieldCheck}
          title="Security & Privacy"
        />

        <GlassCard style={{ padding: '4px 14px' }}>
          <SettingRow
            icon={Lock}
            title="App Lock"
            description="Protect the application interface"
            toggle
            checked={settings.appLock}
            onClick={() =>
              updateSetting(
                'appLock',
                !settings.appLock
              )
            }
          />

          <SettingRow
            icon={Fingerprint}
            title="Biometric Authentication"
            description="Device biometric support"
            toggle
            checked={settings.biometrics}
            onClick={() =>
              updateSetting('biometrics', !settings.biometrics)
            }
          />

          <SettingRow
            icon={Smartphone}
            title="Active Devices"
            description="Device management"
            value="1 device"
            onClick={() => openSettingsAction('devices')}
          />

          <SettingRow
            icon={ShieldCheck}
            title="Privacy Controls"
            description="Manage your financial data preferences"
            value="View"
            onClick={() =>
              setActiveSettingsModal(
                'privacy'
              )
            }
          />
        </GlassCard>
      </div>

      {/* NOTIFICATIONS */}
      <div>
        <SectionTitle
          icon={Bell}
          title="Notifications"
        />

        <GlassCard style={{ padding: '4px 14px' }}>
          <SettingRow
            icon={Bell}
            title="Expense Alerts"
            toggle
            checked={settings.expenseAlerts}
            onClick={() =>
              updateSetting(
                'expenseAlerts',
                !settings.expenseAlerts
              )
            }
          />

          <SettingRow
            icon={Bell}
            title="Budget Alerts"
            toggle
            checked={settings.budgetAlerts}
            onClick={() =>
              updateSetting(
                'budgetAlerts',
                !settings.budgetAlerts
              )
            }
          />

          <SettingRow
            icon={CalendarDays}
            title="Bill Reminders"
            toggle
            checked={settings.billReminders}
            onClick={() =>
              updateSetting(
                'billReminders',
                !settings.billReminders
              )
            }
          />

          <SettingRow
            icon={BarChart3}
            title="Weekly Summary"
            toggle
            checked={settings.weeklySummary}
            onClick={() =>
              updateSetting(
                'weeklySummary',
                !settings.weeklySummary
              )
            }
          />

          <SettingRow
            icon={ShieldCheck}
            title="Security Alerts"
            toggle
            checked={settings.securityAlerts}
            onClick={() =>
              updateSetting(
                'securityAlerts',
                !settings.securityAlerts
              )
            }
          />
        </GlassCard>
      </div>

      {/* APP PREFERENCES */}
      <div>
        <SectionTitle
          icon={Settings}
          title="App Preferences"
        />

        <GlassCard style={{ padding: '4px 14px' }}>
          <SettingRow
            icon={Moon}
            title="Appearance"
            description="Application theme"
            value={settings.appearance}
            onClick={() =>
              setActiveSettingsModal(
                'appearance'
              )
            }
          />

          <SettingRow
            icon={Languages}
            title="Language"
            description="Application language"
            value={settings.language}
            onClick={() =>
              setActiveSettingsModal(
                'language'
              )
            }
          />

          <SettingRow
            icon={CalendarDays}
            title="Date Format"
            description="How dates are displayed"
            value={settings.dateFormat}
            onClick={() =>
              setActiveSettingsModal(
                'date'
              )
            }
          />

          <SettingRow
            icon={Home}
            title="Start Screen"
            description="Screen shown when opening the app"
            value={settings.startScreen}
            onClick={() =>
              setActiveSettingsModal(
                'start'
              )
            }
          />

          <SettingRow
            icon={Sparkles}
            title="Animations"
            description="Enable interface animations"
            toggle
            checked={settings.animations}
            onClick={() =>
              updateSetting(
                'animations',
                !settings.animations
              )
            }
          />
        </GlassCard>
      </div>

      {/* HELP */}
      <div>
        <SectionTitle
          icon={HelpCircle}
          title="Help & Support"
        />

        <GlassCard style={{ padding: '4px 14px' }}>
          <SettingRow
            icon={HelpCircle}
            title="Help Center"
            description="Learn how to use Smart Expense"
            value="Open"
            onClick={() => openSettingsAction('help')}
          />

          <SettingRow
            icon={FileText}
            title="Frequently Asked Questions"
            value="View"
            onClick={() => openSettingsAction('faq')}
          />

          <SettingRow
            icon={Settings}
            title="Report a Problem"
            value="Open"
            onClick={() => openSettingsAction('problem')}
          />

          <SettingRow
            icon={Sparkles}
            title="Send Feedback"
            value="Send"
            onClick={() => openSettingsAction('feedback')}
          />

          <SettingRow
            icon={FileText}
            title="About Smart Expense"
            value="v1.0.0"
          />
        </GlassCard>
      </div>

      {/* SIGN OUT */}
      <button
        onClick={() =>
          setShowSignOutConfirm(true)
        }
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: 14,
          borderRadius: 16,
          background:
            'rgba(255,69,58,0.07)',
          border:
            '1px solid rgba(255,69,58,0.18)',
          color: '#FF453A',
          fontSize: 12,
          fontWeight: 800,
          cursor: 'pointer'
        }}
      >
        <LogOut size={15} />
        Sign Out Account
      </button>

      <div
        style={{
          textAlign: 'center',
          padding: '2px 0 12px',
          fontSize: 8.5,
          color:
            'rgba(235,235,245,0.25)'
        }}
      >
        Smart Expense • Version 1.0.0
      </div>
    </div>
  );

  /* =======================================================
     SETTINGS MODALS
  ======================================================= */

  const renderSettingsModal = () => {
    if (!activeSettingsModal) return null;

    const close = () =>
      setActiveSettingsModal(null);

    if (
      activeSettingsModal ===
      'appearance'
    ) {
      return (
        <Modal onClose={close}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 16
              }}
            >
              Appearance
            </h3>

            <button
              onClick={close}
              style={{
                border: 'none',
                background: 'none',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <X size={17} />
            </button>
          </div>

          {['Dark', 'Light', 'System'].map(
            (value) => (
              <button
                key={value}
                onClick={() => {
                  updateSetting(
                    'appearance',
                    value
                  );
                  close();
                }}
                style={{
                  width: '100%',
                  marginTop: 9,
                  padding: 13,
                  borderRadius: 13,
                  border:
                    '1px solid rgba(255,255,255,0.07)',
                  background:
                    settings.appearance ===
                    value
                      ? 'rgba(10,132,255,0.13)'
                      : 'rgba(255,255,255,0.03)',
                  color: '#fff',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                {value}
              </button>
            )
          )}
        </Modal>
      );
    }

    if (
      activeSettingsModal ===
      'language'
    ) {
      return (
        <Modal onClose={close}>
          <h3
            style={{
              margin: 0,
              fontSize: 16
            }}
          >
            Language
          </h3>

          <button
            onClick={() => {
              updateSetting(
                'language',
                'English'
              );
              close();
            }}
            style={{
              width: '100%',
              marginTop: 14,
              padding: 13,
              borderRadius: 13,
              border:
                '1px solid rgba(255,255,255,0.08)',
              background:
                'rgba(10,132,255,0.1)',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            English
          </button>

          <div
            style={{
              marginTop: 8,
              fontSize: 9,
              color:
                'rgba(235,235,245,0.4)'
            }}
          >
            Additional languages can be
            added later.
          </div>
        </Modal>
      );
    }

    if (
      activeSettingsModal === 'date'
    ) {
      return (
        <Modal onClose={close}>
          <h3
            style={{
              margin: 0,
              fontSize: 16
            }}
          >
            Date Format
          </h3>

          {[
            'DD/MM/YYYY',
            'MM/DD/YYYY',
            'YYYY-MM-DD'
          ].map((value) => (
            <button
              key={value}
              onClick={() => {
                updateSetting(
                  'dateFormat',
                  value
                );
                close();
              }}
              style={{
                width: '100%',
                marginTop: 9,
                padding: 13,
                borderRadius: 13,
                border:
                  '1px solid rgba(255,255,255,0.07)',
                background:
                  settings.dateFormat ===
                  value
                    ? 'rgba(10,132,255,0.13)'
                    : 'rgba(255,255,255,0.03)',
                color: '#fff',
                textAlign: 'left'
              }}
            >
              {value}
            </button>
          ))}
        </Modal>
      );
    }

    if (
      activeSettingsModal === 'start'
    ) {
      return (
        <Modal onClose={close}>
          <h3
            style={{
              margin: 0,
              fontSize: 16
            }}
          >
            Start Screen
          </h3>

          {[
            'Dashboard',
            'Ledger',
            'Profile'
          ].map((value) => (
            <button
              key={value}
              onClick={() => {
                updateSetting(
                  'startScreen',
                  value
                );
                close();
              }}
              style={{
                width: '100%',
                marginTop: 9,
                padding: 13,
                borderRadius: 13,
                border:
                  '1px solid rgba(255,255,255,0.07)',
                background:
                  settings.startScreen ===
                  value
                    ? 'rgba(10,132,255,0.13)'
                    : 'rgba(255,255,255,0.03)',
                color: '#fff',
                textAlign: 'left'
              }}
            >
              {value}
            </button>
          ))}
        </Modal>
      );
    }

    if (
      activeSettingsModal ===
      'currency'
    ) {
      return (
        <Modal onClose={close}>
          <h3
            style={{
              margin: 0,
              fontSize: 16
            }}
          >
            Currency
          </h3>

          {[
            ['₹', 'INR — Indian Rupee'],
            ['$', 'USD — US Dollar'],
            ['€', 'EUR — Euro'],
            ['£', 'GBP — British Pound']
          ].map(([symbol, label]) => (
            <button
              key={symbol}
              onClick={() => {
                setEditCurrency(symbol);
                setProfile((prev) => ({ ...prev, currency: symbol }));
                updateSetting('currency', symbol);
                api.put('/api/profile/', {
                  username: profile.username,
                  email: profile.email,
                  currency: symbol,
                  monthly_budget: Number(profile.monthly_budget) || 0
                }).catch((err) => console.warn('Currency saved locally; server sync unavailable:', err));
                close();
              }}
              style={{
                width: '100%',
                marginTop: 9,
                padding: 13,
                borderRadius: 13,
                border:
                  '1px solid rgba(255,255,255,0.07)',
                background:
                  currencySymbol === symbol
                    ? 'rgba(10,132,255,0.13)'
                    : 'rgba(255,255,255,0.03)',
                color: '#fff',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <b>{symbol}</b> {label}
            </button>
          ))}

          <div
            style={{
              marginTop: 12,
              fontSize: 9,
              color:
                'rgba(235,235,245,0.4)'
            }}
          >
            Currency updates immediately. The app also attempts to sync it with your profile.
          </div>
        </Modal>
      );
    }

    if (
      activeSettingsModal ===
      'payment'
    ) {
      return (
        <Modal onClose={close}>
          <h3
            style={{
              margin: 0,
              fontSize: 16
            }}
          >
            Payment Methods
          </h3>

          {['UPI', 'Card', 'Cash', 'Bank Transfer'].map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => updateSetting('paymentMethod', method)}
              style={{
                width: '100%',
                marginTop: 9,
                padding: 13,
                borderRadius: 13,
                background: settings.paymentMethod === method ? 'rgba(10,132,255,0.14)' : 'rgba(255,255,255,0.04)',
                border: settings.paymentMethod === method ? '1px solid rgba(10,132,255,0.4)' : '1px solid rgba(255,255,255,0.07)',
                color: '#fff',
                textAlign: 'left',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <CreditCard size={14} style={{ verticalAlign: 'middle', marginRight: 7 }} />
              {method}
              {settings.paymentMethod === method && <span style={{ float: 'right', color: '#0A84FF' }}>✓</span>}
            </button>
          ))}
        </Modal>
      );
    }

    if (activeSettingsModal === 'recurring') {
      return (
        <Modal onClose={close}>
          <h3 style={{ margin: 0, fontSize: 16 }}>Recurring Expenses</h3>
          <p style={{ fontSize: 10, color: 'rgba(235,235,245,0.5)', lineHeight: 1.5 }}>
            Turn on recurring-payment reminders. This preference is saved on this device.
          </p>
          <button
            type="button"
            onClick={() => updateSetting('recurringExpenses', !settings.recurringExpenses)}
            style={{ width: '100%', padding: 13, borderRadius: 13, border: '1px solid rgba(255,255,255,0.08)', background: settings.recurringExpenses ? 'rgba(10,132,255,0.15)' : 'rgba(255,255,255,0.04)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
          >
            {settings.recurringExpenses ? '✓ Reminders enabled' : 'Enable reminders'}
          </button>
        </Modal>
      );
    }

    if (activeSettingsModal === 'tax') {
      return (
        <Modal onClose={close}>
          <h3 style={{ margin: 0, fontSize: 16 }}>Tax / GST</h3>
          <p style={{ fontSize: 10, color: 'rgba(235,235,245,0.5)', lineHeight: 1.5 }}>
            Enable tax/GST tracking as a preference for future expense entries.
          </p>
          <button type="button" onClick={() => updateSetting('taxGst', !settings.taxGst)} style={{ width: '100%', padding: 13, borderRadius: 13, border: '1px solid rgba(255,255,255,0.08)', background: settings.taxGst ? 'rgba(10,132,255,0.15)' : 'rgba(255,255,255,0.04)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
            {settings.taxGst ? '✓ GST tracking enabled' : 'Enable GST tracking'}
          </button>
        </Modal>
      );
    }

    if (activeSettingsModal === 'devices') {
      return (
        <Modal onClose={close}>
          <h3 style={{ margin: 0, fontSize: 16 }}>Active Devices</h3>
          <div style={{ marginTop: 12, padding: 14, borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontWeight: 800 }}>Current device</div>
            <div style={{ marginTop: 4, fontSize: 10, color: 'rgba(235,235,245,0.48)' }}>This browser session is active.</div>
          </div>
        </Modal>
      );
    }

    if (activeSettingsModal === 'help' || activeSettingsModal === 'faq' || activeSettingsModal === 'problem') {
      const copy = {
        help: ['Help Center', 'Use Scan to import a receipt, + Add to enter an expense manually, and Ledger to review your transactions.'],
        faq: ['Frequently Asked Questions', 'Your settings are stored locally, while profile and transaction data are synchronized through the connected API when available.'],
        problem: ['Report a Problem', 'If a button does not respond, restart the app after replacing Dashboard.jsx with the final file and verify that this page is the active Dashboard route.']
      }[activeSettingsModal];
      return (
        <Modal onClose={close}>
          <h3 style={{ margin: 0, fontSize: 16 }}>{copy[0]}</h3>
          <p style={{ margin: '12px 0 0', fontSize: 10, lineHeight: 1.6, color: 'rgba(235,235,245,0.58)' }}>{copy[1]}</p>
          <button type="button" onClick={close} style={{ width: '100%', marginTop: 14, padding: 13, border: 'none', borderRadius: 13, background: '#0A84FF', color: '#fff', fontWeight: 850, cursor: 'pointer' }}>Done</button>
        </Modal>
      );
    }

    if (activeSettingsModal === 'feedback') {
      return (
        <Modal onClose={close}>
          <h3 style={{ margin: 0, fontSize: 16 }}>Send Feedback</h3>
          <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="Tell us what you want to improve…" rows={5} style={{ width: '100%', boxSizing: 'border-box', marginTop: 12, padding: 12, borderRadius: 13, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.045)', color: '#fff', resize: 'vertical', outline: 'none' }} />
          <button type="button" onClick={() => { localStorage.setItem('smart_expense_feedback', feedbackText); setFeedbackText(''); close(); }} style={{ width: '100%', marginTop: 10, padding: 13, border: 'none', borderRadius: 13, background: '#0A84FF', color: '#fff', fontWeight: 850, cursor: 'pointer' }}>Save Feedback</button>
        </Modal>
      );
    }

    if (
      activeSettingsModal ===
      'privacy'
    ) {
      return (
        <Modal onClose={close}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 16
              }}
            >
              Privacy Controls
            </h3>

            <button
              onClick={close}
              style={{
                border: 'none',
                background: 'none',
                color: '#fff'
              }}
            >
              <X size={17} />
            </button>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 14,
              borderRadius: 15,
              background:
                'rgba(255,255,255,0.04)',
              color:
                'rgba(235,235,245,0.58)',
              fontSize: 10,
              lineHeight: 1.6
            }}
          >
            Smart Expense uses the existing
            authenticated API for profile and
            transaction synchronization.
            Local preferences are stored on
            this device.
          </div>
        </Modal>
      );
    }

    return null;
  };

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <div
      className="smart-expense-app"
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#05070A',
        color: '#fff',
        boxSizing: 'border-box',
        paddingBottom: 140,
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >
      <style>{`
        html, body, #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100%;
          min-height: 100%;
          background: #05070A;
        }
        *, *::before, *::after { box-sizing: border-box; }
        body { overflow-x: hidden; }
        button, input, select, textarea { font: inherit; }
        .smart-expense-app {
          width: 100%;
          max-width: 100%;
          overflow-x: clip;
        }
        .smart-expense-header {
          padding-top: max(34px, env(safe-area-inset-top, 0px));
        }
        .smart-expense-header-inner {
          width: min(100%, 720px);
        }
        .smart-expense-main {
          width: min(100%, 720px) !important;
          padding: 22px 20px 190px !important;
        }
        .smart-expense-bottom-nav {
          width: min(calc(100% - 24px), 620px) !important;
          bottom: max(18px, env(safe-area-inset-bottom, 0px)) !important;
          height: 70px !important;
          padding: 7px 18px !important;
        }
        .smart-expense-bottom-nav button {
          flex: 1 1 0;
          min-width: 0 !important;
          min-height: 50px;
          -webkit-tap-highlight-color: transparent;
        }
        @media (max-width: 560px) {
          .smart-expense-header { padding: 32px 14px 12px !important; }
          .smart-expense-header-inner { gap: 8px; }
          .smart-expense-header-inner > div:first-child { min-width: 0; }
          .smart-expense-header-inner > div:first-child > div:last-child { min-width: 0; }
          .smart-expense-header-inner > div:first-child > div:last-child > div:first-child { white-space: nowrap; }
          .smart-expense-header-inner > div:last-child { flex-shrink: 0; }
          .smart-expense-main { padding: 20px 14px 190px !important; }
          .smart-expense-bottom-nav {
            width: calc(100% - 20px) !important;
            height: 68px !important;
            padding: 6px 10px !important;
            border-radius: 24px !important;
          }
        }
        @media (min-width: 721px) {
          .smart-expense-app {
            background: #05070A;
          }
        }
      `}</style>

      {/* Premium background */}
      <div
        style={{
          position: 'fixed',
          top: -180,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 430,
          height: 430,
          borderRadius: '50%',
          background:
            'radial-gradient(circle,rgba(10,132,255,0.12),transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {renderHeader()}

      <main
        className="smart-expense-main"
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 720,
          margin: '0 auto',
          padding: '22px 16px 190px',
          boxSizing: 'border-box'
        }}
      >
        {activeTab === 'home' &&
          renderHome()}

        {activeTab === 'add' &&
          renderAdd()}

        {activeTab === 'transactions' &&
          renderLedger()}

        {activeTab === 'analytics' &&
          renderAnalytics()}

        {activeTab === 'profile' &&
          renderProfile()}
      </main>

      {/* OCR */}
      <ReceiptScannerModal
        isOpen={isOcrModalOpen}
        onClose={() =>
          setIsOcrModalOpen(false)
        }
        accounts={accounts}
        currency={currencySymbol}
        onConfirmExpense={(tx) =>
          handleSaveTransaction(tx)
        }
      />

      {/* EDIT PROFILE */}
      {showEditProfileModal && (
        <Modal
          onClose={() =>
            setShowEditProfileModal(false)
          }
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 850
                }}
              >
                Edit Profile
              </h3>

              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: 9.5,
                  color:
                    'rgba(235,235,245,0.42)'
                }}
              >
                Update your financial profile
              </p>
            </div>

            <button
              onClick={() =>
                setShowEditProfileModal(
                  false
                )
              }
              style={{
                border: 'none',
                background: 'none',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <X size={17} />
            </button>
          </div>

          <form
            onSubmit={handleUpdateProfile}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 13,
              marginTop: 18
            }}
          >
            <input
              required
              value={editUsername}
              onChange={(e) =>
                setEditUsername(e.target.value)
              }
              placeholder="Username"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: 12,
                borderRadius: 12,
                border:
                  '1px solid rgba(255,255,255,0.08)',
                background:
                  'rgba(255,255,255,0.045)',
                color: '#fff',
                outline: 'none'
              }}
            />

            <input
              required
              type="email"
              value={editEmail}
              onChange={(e) =>
                setEditEmail(e.target.value)
              }
              placeholder="Email"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: 12,
                borderRadius: 12,
                border:
                  '1px solid rgba(255,255,255,0.08)',
                background:
                  'rgba(255,255,255,0.045)',
                color: '#fff',
                outline: 'none'
              }}
            />

            <select
              value={editCurrency}
              onChange={(e) =>
                setEditCurrency(e.target.value)
              }
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 12,
                border:
                  '1px solid rgba(255,255,255,0.08)',
                background: '#151A24',
                color: '#fff'
              }}
            >
              <option value="₹">
                INR (₹)
              </option>
              <option value="$">
                USD ($)
              </option>
              <option value="€">
                EUR (€)
              </option>
              <option value="£">
                GBP (£)
              </option>
            </select>

            <input
              required
              type="number"
              value={editBudget}
              onChange={(e) =>
                setEditBudget(e.target.value)
              }
              placeholder="Monthly Budget"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: 12,
                borderRadius: 12,
                border:
                  '1px solid rgba(255,255,255,0.08)',
                background:
                  'rgba(255,255,255,0.045)',
                color: '#fff',
                outline: 'none'
              }}
            />

            <button
              type="submit"
              disabled={profileSaving}
              style={{
                padding: 13,
                borderRadius: 13,
                border: 'none',
                background: '#0A84FF',
                color: '#fff',
                fontWeight: 850,
                cursor: 'pointer'
              }}
            >
              {profileSaving
                ? 'Saving...'
                : 'Save Changes'}
            </button>
          </form>
        </Modal>
      )}

      {/* MONTHLY BUDGET */}
      {showBudgetModal && (
        <Modal onClose={() => setShowBudgetModal(false)} width={360}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 17 }}>Monthly Budget</h3>
              <p style={{ margin: '4px 0 0', fontSize: 9.5, color: 'rgba(235,235,245,0.45)' }}>Set the exact limit you want to use each month.</p>
            </div>
            <button type="button" onClick={() => setShowBudgetModal(false)} style={{ border: 'none', background: 'none', color: '#fff', cursor: 'pointer' }}><X size={17} /></button>
          </div>
          <form onSubmit={handleSaveBudget} style={{ marginTop: 18 }}>
            <label style={{ display: 'block', fontSize: 9, color: 'rgba(235,235,245,0.45)', marginBottom: 6 }}>BUDGET AMOUNT ({currencySymbol})</label>
            <input autoFocus required min="0" type="number" step="0.01" value={budgetDraft} onChange={(e) => setBudgetDraft(e.target.value)} placeholder="Enter monthly budget" style={{ width: '100%', boxSizing: 'border-box', padding: 14, borderRadius: 13, border: '1px solid rgba(10,132,255,0.35)', background: 'rgba(255,255,255,0.045)', color: '#fff', fontSize: 18, fontWeight: 850, outline: 'none' }} />
            <button disabled={budgetSaving} type="submit" style={{ width: '100%', marginTop: 12, padding: 13, border: 'none', borderRadius: 13, background: '#0A84FF', color: '#fff', fontWeight: 850, cursor: 'pointer' }}>{budgetSaving ? 'Saving…' : 'Save Monthly Budget'}</button>
          </form>
        </Modal>
      )}

      {/* SIGN OUT */}
      {showSignOutConfirm && (
        <Modal
          onClose={() =>
            setShowSignOutConfirm(
              false
            )
          }
          width={330}
        >
          <div
            style={{
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 16,
                margin: '0 auto 12px',
                background:
                  'rgba(255,69,58,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LogOut
                size={21}
                color="#FF453A"
              />
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: 16
              }}
            >
              Sign out of your account?
            </h3>

            <p
              style={{
                fontSize: 10,
                lineHeight: 1.5,
                color:
                  'rgba(235,235,245,0.45)',
                margin:
                  '7px 0 18px'
              }}
            >
              You can sign in again anytime.
              Your synced transactions will
              remain on the server.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap: 8
              }}
            >
              <button
                onClick={() =>
                  setShowSignOutConfirm(
                    false
                  )
                }
                style={{
                  padding: 11,
                  borderRadius: 12,
                  border:
                    '1px solid rgba(255,255,255,0.08)',
                  background:
                    'rgba(255,255,255,0.04)',
                  color: '#fff',
                  fontWeight: 750,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  clearTokens();
                  localStorage.clear();
                  window.location.reload();
                }}
                style={{
                  padding: 11,
                  borderRadius: 12,
                  border: 'none',
                  background: '#FF453A',
                  color: '#fff',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* BOTTOM NAVIGATION */}
      <nav
        className="smart-expense-bottom-nav"
        style={{
          position: 'fixed',
          left: '50%',
          bottom:
            'max(18px, env(safe-area-inset-bottom, 0px))',
          transform:
            'translateX(-50%)',
          width: 'calc(100% - 24px)',
          maxWidth: 620,
          height: 72,
          boxSizing: 'border-box',
          padding: '6px 13px',
          borderRadius: 27,
          background:
            'rgba(14,18,27,0.94)',
          backdropFilter: 'blur(30px)',
          border:
            '1px solid rgba(255,255,255,0.1)',
          boxShadow:
            '0 18px 50px rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'space-between',
          zIndex: 500
        }}
      >
        <button
          onClick={() =>
            setActiveTab('home')
          }
          style={{
            border: 'none',
            background: 'none',
            color:
              activeTab === 'home'
                ? '#0A84FF'
                : 'rgba(235,235,245,0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            cursor: 'pointer',
            minWidth: 45
          }}
        >
          <Home size={19} />
          <span
            style={{
              fontSize: 9,
              fontWeight: 750
            }}
          >
            Home
          </span>
        </button>

        <button
          onClick={() =>
            setActiveTab('transactions')
          }
          style={{
            border: 'none',
            background: 'none',
            color:
              activeTab ===
              'transactions'
                ? '#0A84FF'
                : 'rgba(235,235,245,0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            cursor: 'pointer',
            minWidth: 45
          }}
        >
          <ArrowRightLeft size={19} />
          <span
            style={{
              fontSize: 9,
              fontWeight: 750
            }}
          >
            Ledger
          </span>
        </button>

        <button
          onClick={() =>
            setIsOcrModalOpen(true)
          }
          style={{
            width: 51,
            height: 51,
            borderRadius: '50%',
            transform:
              'translateY(-8px)',
            border:
              '1px solid rgba(255,255,255,0.12)',
            background:
              'linear-gradient(135deg,#0A84FF,#1559D8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            boxShadow:
              '0 9px 25px rgba(10,132,255,0.42)'
          }}
        >
          <Camera
            size={23}
            strokeWidth={2.4}
          />
        </button>

        <button
          onClick={() =>
            setActiveTab('add')
          }
          style={{
            border: 'none',
            background: 'none',
            color:
              activeTab === 'add'
                ? '#0A84FF'
                : 'rgba(235,235,245,0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            cursor: 'pointer',
            minWidth: 45
          }}
        >
          <PlusCircle size={19} />
          <span
            style={{
              fontSize: 9,
              fontWeight: 750
            }}
          >
            + Add
          </span>
        </button>

        <button
          onClick={() =>
            setActiveTab('profile')
          }
          style={{
            border: 'none',
            background: 'none',
            color:
              activeTab === 'profile'
                ? '#0A84FF'
                : 'rgba(235,235,245,0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            cursor: 'pointer',
            minWidth: 45
          }}
        >
          <User size={19} />
          <span
            style={{
              fontSize: 9,
              fontWeight: 750
            }}
          >
            Profile
          </span>
        </button>
      </nav>

      {renderSettingsModal()}
    </div>
  );
}