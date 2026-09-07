import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  startScreen: 'Dashboard'
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
  const [activeTab, setActiveTab] = useState('home');

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

  /* =======================================================
     ADDITIVE INTERNAL NAVIGATION
     Keeps the existing dashboard intact and adds one-step back.
  ======================================================= */
  const tabHistoryRef = useRef(['home']);

  const navigateTo = (tab) => {
    if (tab === activeTab) return;
    tabHistoryRef.current.push(tab);
    setActiveTab(tab);
    try {
      window.history.pushState({ smartExpenseTab: tab }, '', window.location.href);
    } catch (_) {}
  };

  const goBackInDashboard = () => {
    if (isOcrModalOpen) {
      setIsOcrModalOpen(false);
      return true;
    }
    if (showSignOutConfirm) {
      setShowSignOutConfirm(false);
      return true;
    }
    if (showEditProfileModal) {
      setShowEditProfileModal(false);
      return true;
    }
    if (activeSettingsModal) {
      setActiveSettingsModal(null);
      return true;
    }
    if (tabHistoryRef.current.length > 1) {
      tabHistoryRef.current.pop();
      setActiveTab(tabHistoryRef.current[tabHistoryRef.current.length - 1] || 'home');
      return true;
    }
    return false;
  };

  useEffect(() => {
    const onPopState = () => {
      goBackInDashboard();
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  });

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
          monthly_budget: Number(res.data.monthly_budget) || 50000
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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setProfileSaving(true);

    try {
      const res = await api.put('/api/profile/', {
        username: editUsername.trim(),
        email: editEmail.trim(),
        currency: editCurrency,
        monthly_budget: Number(editBudget) || 50000
      });

      setProfile({
        username: res.data.username || editUsername,
        email: res.data.email || editEmail,
        currency: res.data.currency || editCurrency,
        monthly_budget:
          Number(res.data.monthly_budget) ||
          Number(editBudget) ||
          50000
      });

      setShowEditProfileModal(false);
    } catch (err) {
      alert(
        err.response?.data?.error ||
          'Failed to update profile.'
      );
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
      return false;
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
      return true;
    } catch (err) {
      setErrorMessage(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          'Unable to record transaction.'
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  };

 const handleDelete = async (id) => {
  if (!id) {
    alert('Invalid transaction.');
    return;
  }

  const confirmed = window.confirm(
    'Are you sure you want to delete this expense?'
  );

  if (!confirmed) return;

  const oldExpenses = expenses;

  // Remove from UI immediately
  setExpenses((prev) =>
    prev.filter((item) => String(item.id) !== String(id))
  );

  try {
    await api.delete(`/api/expenses/${id}/`);

    // Refresh expenses + dashboard totals
    await loadLedger();
  } catch (err) {
    // Restore if API delete failed
    setExpenses(oldExpenses);

    const message =
      err.response?.data?.error ||
      err.response?.data?.detail ||
      'Unable to delete this transaction.';

    alert(message);
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

  /* =======================================================
     CSV EXPORT
  ======================================================= */

  const exportCSV = async () => {
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

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

    const filename = `smart-expense-${new Date().toISOString().slice(0, 10)}.csv`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    /* Android-friendly share first; normal download remains the fallback. */
    try {
      if (navigator.share && typeof File !== 'undefined') {
        const file = new File([blob], filename, { type: 'text/csv' });
        if (!navigator.canShare || navigator.canShare({ files: [file] })) {
          await navigator.share({ title: 'Smart Expense CSV', files: [file] });
          return;
        }
      }
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }

    try {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (_) {
      alert('Export could not be started on this device.');
    }
  };

  /* =======================================================
     HEADER
  ======================================================= */

  const renderHeader = () => (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 90,
        background: 'rgba(5,7,10,0.86)',
        backdropFilter: 'blur(24px)',
        borderBottom:
          '1px solid rgba(255,255,255,0.06)',
        padding: '13px 18px'
      }}
    >
      <div
        style={{
          maxWidth: 520,
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
            <smartInsight.icon
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
                navigateTo('add');
                setEntryType('EXPENSE');
              }
            },
            {
              label: 'Income',
              icon: CircleDollarSign,
              action: () => {
                navigateTo('add');
                setEntryType('INCOME');
              }
            },
            {
              label: 'Ledger',
              icon: ArrowRightLeft,
              action: () =>
                navigateTo('transactions')
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
              navigateTo('transactions')
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
    const expenseRows = Object.entries(categoryStats).sort((a, b) => b[1] - a[1]);
    const totalCategorySpend = expenseRows.reduce((sum, item) => sum + Number(item[1] || 0), 0);
    const maxCategory = expenseRows.length ? Math.max(...expenseRows.map((item) => Number(item[1] || 0))) : 1;

    const monthly = Array.from({ length: 6 }, (_, index) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - index));
      const year = d.getFullYear();
      const month = d.getMonth();
      let income = 0;
      let expense = 0;
      expenses.forEach((tx) => {
        const date = new Date(tx.date || tx.created_at || '');
        if (Number.isNaN(date.getTime())) return;
        if (date.getFullYear() !== year || date.getMonth() !== month) return;
        const amount = Number(tx.amount) || 0;
        if (tx.transaction_type === 'INCOME') income += amount;
        else expense += amount;
      });
      return {
        label: d.toLocaleDateString('en-IN', { month: 'short' }),
        income,
        expense
      };
    });

    const maxMonthly = Math.max(1, ...monthly.map((m) => Math.max(m.income, m.expense)));
    const chartW = 320;
    const chartH = 150;
    const pad = 22;
    const xFor = (i) => pad + (i * (chartW - pad * 2)) / Math.max(1, monthly.length - 1);
    const yFor = (v) => chartH - pad - (v / maxMonthly) * (chartH - pad * 2);
    const incomePoints = monthly.map((m, i) => `${xFor(i)},${yFor(m.income)}`).join(' ');
    const expensePoints = monthly.map((m, i) => `${xFor(i)},${yFor(m.expense)}`).join(' ');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 21, fontWeight: 850 }}>Analytics</h2>
          <p style={{ margin: '4px 0', fontSize: 10, color: 'rgba(235,235,245,0.42)' }}>
            Visual tracking of your real recorded transactions
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 9 }}>
          {[
            ['Total Spending', money(summary.total_expenses, currencySymbol), '#FF453A'],
            ['Total Income', money(summary.total_income, currencySymbol), '#30D158'],
            ['Budget Used', `${budgetPct}%`, '#0A84FF'],
            ['Top Category', topCategory ? topCategory[0] : '—', '#BF5AF2']
          ].map(([title, value, color]) => (
            <GlassCard key={title} style={{ padding: 15 }}>
              <div style={{ fontSize: 9, color: 'rgba(235,235,245,0.42)', fontWeight: 700 }}>{title}</div>
              <div style={{ marginTop: 7, fontSize: 15, fontWeight: 850, color }}>{value}</div>
            </GlassCard>
          ))}
        </div>

        <GlassCard style={{ padding: 16 }}>
          <SectionTitle icon={BarChart3} title="Income vs Expenses" subtitle="Last 6 months" />
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg viewBox={`0 0 ${chartW} ${chartH + 28}`} width="100%" height="190" role="img" aria-label="Income and expense chart">
              {[0, 0.5, 1].map((ratio) => (
                <line key={ratio} x1={pad} x2={chartW - pad} y1={yFor(maxMonthly * ratio)} y2={yFor(maxMonthly * ratio)} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              ))}
              <polyline points={incomePoints} fill="none" stroke="#30D158" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points={expensePoints} fill="none" stroke="#FF453A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {monthly.map((m, i) => (
                <g key={m.label + i}>
                  <circle cx={xFor(i)} cy={yFor(m.income)} r="3.5" fill="#30D158" />
                  <circle cx={xFor(i)} cy={yFor(m.expense)} r="3.5" fill="#FF453A" />
                  <text x={xFor(i)} y={chartH + 17} textAnchor="middle" fill="rgba(235,235,245,0.45)" fontSize="9">{m.label}</text>
                </g>
              ))}
            </svg>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 9.5, color: 'rgba(235,235,245,0.55)' }}>
            <span><b style={{ color: '#30D158' }}>●</b> Income</span>
            <span><b style={{ color: '#FF453A' }}>●</b> Expenses</span>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: 16 }}>
          <SectionTitle icon={PieChart} title="Category Spending" subtitle="Where your recorded expenses go" />
          {expenseRows.length ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ width: 132, height: 132, flex: '0 0 132px', borderRadius: '50%', background: `conic-gradient(${expenseRows.map((item, i) => {
                const colors = ['#0A84FF', '#30D158', '#FF9F0A', '#BF5AF2', '#FF453A', '#64D2FF', '#FFD60A'];
                const start = expenseRows.slice(0, i).reduce((sum, x) => sum + Number(x[1] || 0), 0) / totalCategorySpend * 360;
                const end = (expenseRows.slice(0, i + 1).reduce((sum, x) => sum + Number(x[1] || 0), 0) / totalCategorySpend) * 360;
                return `${colors[i % colors.length]} ${start}deg ${end}deg`;
              }).join(',')})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 82, height: 82, borderRadius: '50%', background: '#111621', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 9, color: 'rgba(235,235,245,0.45)' }}>TOTAL</div>
                  <div style={{ fontSize: 11, fontWeight: 850 }}>{money(totalCategorySpend, currencySymbol)}</div>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {expenseRows.slice(0, 6).map(([category, amount], i) => {
                  const colors = ['#0A84FF', '#30D158', '#FF9F0A', '#BF5AF2', '#FF453A', '#64D2FF', '#FFD60A'];
                  const pct = totalCategorySpend ? Math.round((Number(amount) / totalCategorySpend) * 100) : 0;
                  return (
                    <div key={category} style={{ display: 'grid', gridTemplateColumns: '9px 1fr auto', alignItems: 'center', gap: 7, fontSize: 9.5 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 3, background: colors[i % colors.length] }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{category}</span>
                      <b>{pct}%</b>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ padding: 28, textAlign: 'center', fontSize: 10, color: 'rgba(235,235,245,0.4)' }}>Add expenses to see your category chart.</div>
          )}
        </GlassCard>

        <GlassCard style={{ padding: 16 }}>
          <SectionTitle icon={TrendingUp} title="Category Tracking" subtitle="Actual spending by category" />
          {expenseRows.length ? expenseRows.slice(0, 8).map(([category, amount]) => (
            <div key={category} style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, marginBottom: 6 }}>
                <span>{CATEGORY_ICONS[category] || '•'} {category}</span>
                <b>{money(amount, currencySymbol)}</b>
              </div>
              <div style={{ height: 8, borderRadius: 10, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.max(3, Math.round((Number(amount) / maxCategory) * 100))}%`, height: '100%', borderRadius: 10, background: getCategoryColor(category), transition: 'width .35s ease' }} />
              </div>
            </div>
          )) : (
            <div style={{ padding: 20, textAlign: 'center', fontSize: 10, color: 'rgba(235,235,245,0.4)' }}>No expense data yet.</div>
          )}
        </GlassCard>

        <GlassCard style={{ padding: 16 }}>
          <SectionTitle icon={Wallet} title="Budget Health" subtitle="Current recorded spending against your budget" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
            <span>Spent <b>{money(expenseTotal, currencySymbol)}</b></span>
            <span style={{ color: 'rgba(235,235,245,0.45)' }}>Budget <b>{budget ? money(budget, currencySymbol) : 'Not set'}</b></span>
          </div>
          <div style={{ height: 10, marginTop: 10, borderRadius: 20, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            <div style={{ width: `${budget ? Math.min(100, Math.round((expenseTotal / budget) * 100)) : 0}%`, height: '100%', borderRadius: 20, background: budgetPct >= 90 ? '#FF453A' : '#0A84FF' }} />
          </div>
          <div style={{ marginTop: 8, fontSize: 9.5, color: 'rgba(235,235,245,0.45)' }}>
            {budget ? `${budgetPct}% used • ${money(remainingBudget, currencySymbol)} remaining` : 'Set a monthly budget from Profile → Edit.'}
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
            onClick={() =>
              setShowEditProfileModal(true)
            }
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
            onClick={() =>
              setShowEditProfileModal(true)
            }
          />

          <SettingRow
            icon={CreditCard}
            title="Payment Methods"
            description="UPI, Card, Cash and Bank"
            value="Manage"
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
            value="Coming soon"
            onClick={() =>
              alert(
                'Recurring expense management can be connected to the backend next.'
              )
            }
          />

          <SettingRow
            icon={FileText}
            title="Tax / GST"
            description="Configure tax-related preferences"
            value="Configure"
            onClick={() =>
              alert(
                'Tax / GST configuration is ready for backend integration.'
              )
            }
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
              navigateTo('transactions')
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
              navigateTo('analytics')
            }
          />

          <SettingRow
            icon={PieChart}
            title="Category Analysis"
            description="Analyze spending categories"
            value="Open"
            onClick={() =>
              navigateTo('analytics')
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
            value="Coming soon"
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
              alert(
                'Biometric authentication requires native device integration.'
              )
            }
          />

          <SettingRow
            icon={Smartphone}
            title="Active Devices"
            description="Device management"
            value="Coming soon"
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
            onClick={() =>
              alert(
                'Help Center will be connected here.'
              )
            }
          />

          <SettingRow
            icon={FileText}
            title="Frequently Asked Questions"
            value="View"
            onClick={() =>
              alert(
                'FAQ section will be connected here.'
              )
            }
          />

          <SettingRow
            icon={Settings}
            title="Report a Problem"
            value="Support"
            onClick={() =>
              alert(
                'Support request flow will be connected here.'
              )
            }
          />

          <SettingRow
            icon={Sparkles}
            title="Send Feedback"
            value="Feedback"
            onClick={() =>
              alert(
                'Thank you for your feedback.'
              )
            }
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
                updateSetting(
                  'currency',
                  symbol
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
            Save your profile after changing
            currency to persist it on the
            server.
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

          {[
            'UPI',
            'Card',
            'Cash',
            'Bank Transfer'
          ].map((method) => (
            <div
              key={method}
              style={{
                marginTop: 9,
                padding: 13,
                borderRadius: 13,
                background:
                  'rgba(255,255,255,0.04)',
                border:
                  '1px solid rgba(255,255,255,0.07)',
                fontSize: 11,
                fontWeight: 700
              }}
            >
              <CreditCard
                size={14}
                style={{
                  verticalAlign: 'middle',
                  marginRight: 7
                }}
              />
              {method}
            </div>
          ))}
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
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#05070A',
        color: '#fff',
        boxSizing: 'border-box',
        paddingBottom: 105,
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >
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
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 520,
          margin: '0 auto',
          padding: '17px 16px 25px',
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
        style={{
          position: 'fixed',
          left: '50%',
          bottom:
            'max(12px, env(safe-area-inset-bottom, 12px))',
          transform:
            'translateX(-50%)',
          width: 'calc(100% - 28px)',
          maxWidth: 420,
          height: 65,
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
            navigateTo('home')
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
            navigateTo('transactions')
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
            navigateTo('add')
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
            navigateTo('profile')
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