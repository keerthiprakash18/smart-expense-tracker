import React, { useState, useId } from 'react';
import {
  Camera,
  RefreshCw,
  Download,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  ScanLine,
  Layers,
  Store,
  CopyCheck,
  ShieldAlert,
  BrainCircuit,
  Coins,
  CreditCard,
  Target,
  CalendarDays,
  Repeat,
  Receipt,
  FileCheck2,
  FileX2,
  Files,
  Cloud,
  History,
  CloudUpload,
  DatabaseBackup,
  Upload,
  Trash2,
  FileSpreadsheet,
  PieChart,
  ReceiptText,
  Share2,
  Lock,
  Fingerprint,
  Smartphone,
  ShieldCheck,
  EyeOff,
  FileText,
  Moon,
  Globe,
  Hash,
  LayoutDashboard,
  Zap,
  Bell,
  AlertTriangle,
  Clock,
  HelpCircle,
  MessageSquareHelp,
  Bug,
  Headphones,
  Send,
  Star,
  Info,
  LogOut,
  Home,
  ArrowRightLeft,
  PlusCircle,
  User,
  X
} from 'lucide-react';

export default function SettingsProfileView() {
  // --- Header Action States ---
  const [isSyncing, setIsSyncing] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  // --- Core Form & Toggle States ---
  const [toggles, setToggles] = useState({
    // AI & OCR
    aiReceiptScanning: true,
    autoCategorization: true,
    merchantDetection: true,
    duplicateDetection: true,
    ocrVerification: true,
    aiSpendingInsights: true,
    // Budget & Alerts
    budgetAlerts: true,
    dailySummary: true,
    weeklySummary: true,
    unusualSpending: true,
    recurringReminder: true,
    // Security
    appLock: true,
    biometricAuth: true,
    // App Preferences
    animations: true,
    // Notifications
    notifExpense: true,
    notifBudget: true,
    notifBills: true,
    notifWeekly: true,
    notifAI: true,
    notifSecurity: true
  });

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  // --- Currency & Budget Numerical Metrics ---
  const currencySymbol = '₹';
  const monthlyCap = 50000;
  const currentSpent = 32480;
  const remainingBudget = monthlyCap - currentSpent;
  const budgetUsagePct = Math.min(Math.round((currentSpent / monthlyCap) * 100), 100);

  return (
    <div className="fin-layout" style={styles.layout}>
      {/* Dynamic Background Flare */}
      <div style={styles.topAmbientFlare} />

      {/* Main Viewport Container (390px - 430px ideal mobile width) */}
      <div style={styles.scrollCanvas}>
        {/* ==================================================
            2. TOP HEADER
        ================================================== */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>Preferences &amp; Settings</h1>
            <p style={styles.headerSubtitle}>Control your AI-powered financial experience</p>
          </div>

          <div style={styles.headerActions}>
            <button
              onClick={() => alert('Launching High-Speed Camera OCR...')}
              style={styles.scanBillBtn}
              aria-label="Scan Bill"
            >
              <Camera size={14} color="#FFFFFF" strokeWidth={2.5} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFF' }}>Scan Bill</span>
            </button>

            <button
              onClick={handleSync}
              style={styles.headerIconButton}
              aria-label="Synchronize Data"
            >
              <RefreshCw
                size={14}
                color="#FFFFFF"
                style={{
                  transform: isSyncing ? 'rotate(360deg)' : 'none',
                  transition: isSyncing ? 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
                }}
              />
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              style={styles.headerIconButton}
              aria-label="Export Reports"
            >
              <Download size={14} color="#FFFFFF" />
            </button>
          </div>
        </header>

        {/* ==================================================
            3. PROFILE CARD
        ================================================== */}
        <section style={styles.sectionBlock}>
          <div style={styles.profileCard}>
            <div style={styles.profileTopRow}>
              <div style={styles.avatarSquircle}>
                <span style={styles.avatarText}>AK</span>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={styles.profileLabel}>Your Profile</span>
                  <span style={styles.verifiedBadge}>
                    <CheckCircle2 size={10} color="#30D158" strokeWidth={3} />
                    Verified
                  </span>
                </div>
                <h2 style={styles.userName}>Alex Kumar</h2>
                <p style={styles.userEmail}>alex@example.com</p>
              </div>

              <button
                onClick={() => alert('Navigating to Account Profile Editor')}
                style={styles.editProfileBtn}
              >
                <span>Edit</span>
                <ChevronRight size={14} color="rgba(235, 235, 245, 0.6)" />
              </button>
            </div>

            <div style={styles.profileDivider} />

            <div style={styles.profileMetaGrid}>
              <div>
                <span style={styles.metaLabel}>Financial ID</span>
                <div style={styles.metaValue}>Verified Account</div>
              </div>
              <div>
                <span style={styles.metaLabel}>Cloud Sync</span>
                <div style={styles.metaValueHighlight}>
                  <span style={styles.greenPulseDot} />
                  Synced just now
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            4. AI FINANCIAL ASSISTANT CARD
        ================================================== */}
        <section style={styles.sectionBlock}>
          <div style={styles.aiAssistantCard}>
            <div style={styles.aiCardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={styles.aiIconBadge}>
                  <Sparkles size={16} color="#0A84FF" />
                </div>
                <div>
                  <h2 style={styles.cardHeading}>AI Financial Assistant</h2>
                  <p style={styles.cardSubheading}>Your expenses are automatically analyzed</p>
                </div>
              </div>

              <div style={styles.aiLiveStatusPill}>
                <span style={styles.aiLivePulse} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0A84FF' }}>Active</span>
              </div>
            </div>

            <div style={styles.aiMetricsGrid}>
              <div style={styles.aiMetricBox}>
                <span style={styles.aiMetricLabel}>Receipts Scanned</span>
                <span style={styles.aiMetricVal}>128</span>
              </div>
              <div style={styles.aiMetricBox}>
                <span style={styles.aiMetricLabel}>Categorized</span>
                <span style={styles.aiMetricVal}>124</span>
              </div>
              <div style={styles.aiMetricBox}>
                <span style={styles.aiMetricLabel}>AI Accuracy</span>
                <span style={{ ...styles.aiMetricVal, color: '#30D158' }}>96.8%</span>
              </div>
              <div style={styles.aiMetricBox}>
                <span style={styles.aiMetricLabel}>Last Analysis</span>
                <span style={styles.aiMetricVal}>2m ago</span>
              </div>
            </div>

            <button
              onClick={() => alert('Opening Predictive AI Insights...')}
              style={styles.aiInsightsBtn}
            >
              <span>View AI Insights</span>
              <ChevronRight size={15} color="#0A84FF" />
            </button>
          </div>
        </section>

        {/* ==================================================
            5. AI & OCR SETTINGS
        ================================================== */}
        <section style={styles.sectionBlock}>
          <h3 style={styles.sectionHeaderTitle}>AI &amp; OCR</h3>
          <div style={styles.settingsGroupCard}>
            <SettingRowToggle
              icon={<ScanLine size={17} color="#0A84FF" />}
              title="AI Receipt Scanning"
              desc="Automatically extract information from bills"
              checked={toggles.aiReceiptScanning}
              onChange={() => handleToggle('aiReceiptScanning')}
            />
            <SettingRowToggle
              icon={<Layers size={17} color="#BF5AF2" />}
              title="Auto Categorization"
              desc="Let AI assign expense categories"
              checked={toggles.autoCategorization}
              onChange={() => handleToggle('autoCategorization')}
            />
            <SettingRowToggle
              icon={<Store size={17} color="#FF9F0A" />}
              title="Merchant Detection"
              desc="Automatically identify merchants"
              checked={toggles.merchantDetection}
              onChange={() => handleToggle('merchantDetection')}
            />
            <SettingRowToggle
              icon={<CopyCheck size={17} color="#30D158" />}
              title="Duplicate Receipt Detection"
              desc="Detect repeated or duplicate bills"
              checked={toggles.duplicateDetection}
              onChange={() => handleToggle('duplicateDetection')}
            />
            <SettingRowToggle
              icon={<ShieldAlert size={17} color="#64D2FF" />}
              title="OCR Verification"
              desc="Review low-confidence extracted data"
              checked={toggles.ocrVerification}
              onChange={() => handleToggle('ocrVerification')}
            />
            <SettingRowToggle
              icon={<BrainCircuit size={17} color="#FF375F" />}
              title="AI Spending Insights"
              desc="Generate personalized spending insights"
              checked={toggles.aiSpendingInsights}
              onChange={() => handleToggle('aiSpendingInsights')}
              isLast
            />
          </div>
        </section>

        {/* ==================================================
            6. EXPENSE PREFERENCES
        ================================================== */}
        <section style={styles.sectionBlock}>
          <h3 style={styles.sectionHeaderTitle}>Expense Preferences</h3>
          <div style={styles.settingsGroupCard}>
            <SettingRowLink
              icon={<Coins size={17} color="#0A84FF" />}
              title="Currency"
              value="INR (₹)"
              onClick={() => alert('Select Primary Currency')}
            />
            <SettingRowLink
              icon={<Layers size={17} color="#BF5AF2" />}
              title="Default Category"
              value="General"
              onClick={() => alert('Select Default Category')}
            />
            <SettingRowLink
              icon={<CreditCard size={17} color="#30D158" />}
              title="Payment Methods"
              value="Cash • UPI • Card • Bank"
              onClick={() => alert('Configure Payment Methods')}
            />
            <SettingRowLink
              icon={<Target size={17} color="#FF9F0A" />}
              title="Monthly Budget"
              value="₹50,000"
              onClick={() => alert('Edit Budget Limit')}
            />
            <SettingRowLink
              icon={<CalendarDays size={17} color="#64D2FF" />}
              title="Budget Period"
              value="Monthly"
              onClick={() => alert('Select Cycle Period')}
            />
            <SettingRowLink
              icon={<Repeat size={17} color="#FF375F" />}
              title="Recurring Expenses"
              value="Manage recurring payments"
              onClick={() => alert('Configure Recurring Transactions')}
            />
            <SettingRowLink
              icon={<Receipt size={17} color="#AC8E68" />}
              title="Tax / GST"
              value="Configure tax preferences"
              onClick={() => alert('Configure GST/Tax Settings')}
              isLast
            />
          </div>
        </section>

        {/* ==================================================
            7. BUDGET & ALERTS
        ================================================== */}
        <section style={styles.sectionBlock}>
          <h3 style={styles.sectionHeaderTitle}>Budget &amp; Alerts</h3>
          <div style={styles.budgetOverviewCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={styles.budgetCardSub}>Current Allocation</span>
                <div style={styles.budgetCardTotal}>
                  {currencySymbol}
                  {monthlyCap.toLocaleString('en-IN')}
                </div>
              </div>
              <span style={styles.budgetPctBadge}>{budgetUsagePct}% Exhausted</span>
            </div>

            {/* Linear Progress Bar */}
            <div style={styles.progressBarTrack}>
              <div style={{ ...styles.progressBarFill, width: `${budgetUsagePct}%` }} />
            </div>

            <div style={styles.budgetMetricsRow}>
              <div>
                <span style={styles.budgetMiniLabel}>Spent</span>
                <div style={styles.budgetMiniValSpent}>
                  {currencySymbol}
                  {currentSpent.toLocaleString('en-IN')}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={styles.budgetMiniLabel}>Remaining</span>
                <div style={styles.budgetMiniValRemaining}>
                  {currencySymbol}
                  {remainingBudget.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div style={styles.profileDivider} />

            <SettingRowToggle
              title="Budget Alerts"
              checked={toggles.budgetAlerts}
              onChange={() => handleToggle('budgetAlerts')}
              compact
            />
            <SettingRowToggle
              title="Daily Spending Summary"
              checked={toggles.dailySummary}
              onChange={() => handleToggle('dailySummary')}
              compact
            />
            <SettingRowToggle
              title="Weekly Financial Summary"
              checked={toggles.weeklySummary}
              onChange={() => handleToggle('weeklySummary')}
              compact
            />
            <SettingRowToggle
              title="Unusual Spending Detection"
              checked={toggles.unusualSpending}
              onChange={() => handleToggle('unusualSpending')}
              compact
            />
            <SettingRowToggle
              title="Recurring Payment Reminder"
              checked={toggles.recurringReminder}
              onChange={() => handleToggle('recurringReminder')}
              compact
              isLast
            />
          </div>
        </section>

        {/* ==================================================
            8. RECEIPT MANAGEMENT
        ================================================== */}
        <section style={styles.sectionBlock}>
          <h3 style={styles.sectionHeaderTitle}>Receipt Management</h3>
          <div style={styles.settingsGroupCard}>
            <SettingRowLink
              icon={<Files size={17} color="#0A84FF" />}
              title="All Receipts"
              value="128 receipts"
              onClick={() => alert('View All Scanned Receipts')}
            />
            <SettingRowLink
              icon={<FileCheck2 size={17} color="#FF9F0A" />}
              title="Pending Verification"
              value="4 receipts"
              valueColor="#FF9F0A"
              onClick={() => alert('Review Unconfirmed OCR Items')}
            />
            <SettingRowLink
              icon={<FileX2 size={17} color="#FF453A" />}
              title="Failed OCR"
              value="2 receipts"
              valueColor="#FF453A"
              onClick={() => alert('Review Unreadable Bills')}
            />
            <SettingRowLink
              icon={<CopyCheck size={17} color="#BF5AF2" />}
              title="Duplicate Receipts"
              value="3 detected"
              onClick={() => alert('Review Duplicate Bills')}
            />
            <SettingRowLink
              icon={<Cloud size={17} color="#30D158" />}
              title="Receipt Storage"
              value="Cloud synced"
              onClick={() => alert('Inspect Cloud File Storage')}
            />
            <SettingRowLink
              icon={<History size={17} color="#64D2FF" />}
              title="Scan History"
              value="View previous scans"
              onClick={() => alert('Open Timeline Archive')}
              isLast
            />
          </div>
        </section>

        {/* ==================================================
            9. BACKUP & DATA
        ================================================== */}
        <section style={styles.sectionBlock}>
          <h3 style={styles.sectionHeaderTitle}>Backup &amp; Data</h3>
          <div style={styles.cloudSyncCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CloudUpload size={22} color="#0A84FF" />
                <div>
                  <h4 style={styles.cardHeading}>Cloud Sync</h4>
                  <p style={styles.cardSubheading}>Automatic multi-device synchronization</p>
                </div>
              </div>
              <span style={styles.syncStatusGreen}>✓ Up to date</span>
            </div>

            <p style={styles.lastBackupStamp}>Last backup: Today, 12:08 AM</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px' }}>
              <button
                onClick={() => alert('Triggering instant database backup...')}
                style={styles.backupActionPrimary}
              >
                <DatabaseBackup size={14} color="#FFF" />
                <span>Backup Now</span>
              </button>
              <button
                onClick={() => alert('Restoring latest ledger snapshots...')}
                style={styles.backupActionSecondary}
              >
                <Upload size={14} color="rgba(235, 235, 245, 0.8)" />
                <span>Restore Data</span>
              </button>
            </div>
          </div>

          <div style={{ ...styles.settingsGroupCard, marginTop: '12px' }}>
            <SettingRowLink
              icon={<FileSpreadsheet size={17} color="#0A84FF" />}
              title="Export Expenses"
              value="CSV • PDF • Excel"
              onClick={() => setShowExportModal(true)}
            />
            <SettingRowLink
              icon={<Upload size={17} color="#30D158" />}
              title="Import Expenses"
              value="Upload external statement"
              onClick={() => alert('Upload CSV/QIF File')}
            />
            <SettingRowLink
              icon={<Cloud size={17} color="#64D2FF" />}
              title="Manage Cloud Data"
              value="Configure retention"
              onClick={() => alert('Manage cloud quotas')}
            />
            <SettingRowLink
              icon={<Trash2 size={17} color="#FF453A" />}
              title="Delete Local Data"
              value="Clear cache"
              valueColor="#FF453A"
              onClick={() => {
                if (window.confirm('Delete local device cache? Your cloud transactions will remain safe.')) {
                  alert('Local cache wiped clean.');
                }
              }}
              isLast
            />
          </div>
        </section>

        {/* ==================================================
            10. REPORTS & EXPORT
        ================================================== */}
        <section style={styles.sectionBlock}>
          <h3 style={styles.sectionHeaderTitle}>Reports &amp; Export</h3>
          <div style={styles.settingsGroupCard}>
            <SettingRowLink
              icon={<CalendarDays size={17} color="#0A84FF" />}
              title="Monthly Reports"
              desc="View detailed monthly reports"
              onClick={() => alert('Viewing Monthly Financial Summary')}
            />
            <SettingRowLink
              icon={<PieChart size={17} color="#BF5AF2" />}
              title="Category Analysis"
              desc="Analyze spending by category"
              onClick={() => alert('Opening Category Variance Dashboard')}
            />
            <SettingRowLink
              icon={<ReceiptText size={17} color="#30D158" />}
              title="Tax Report"
              desc="Generate tax-ready report"
              onClick={() => alert('Generating GST & Tax Summary')}
            />
            <SettingRowLink
              icon={<Download size={17} color="#FF9F0A" />}
              title="Export Data"
              desc="CSV / PDF / Excel"
              onClick={() => setShowExportModal(true)}
            />
            <SettingRowLink
              icon={<Share2 size={17} color="#64D2FF" />}
              title="Share Report"
              desc="Send to accountant or email"
              onClick={() => alert('Opening Native Share Sheet')}
              isLast
            />
          </div>
        </section>

        {/* ==================================================
            11. SECURITY & PRIVACY
        ================================================== */}
        <section style={styles.sectionBlock}>
          <h3 style={styles.sectionHeaderTitle}>Security &amp; Privacy</h3>
          <div style={styles.settingsGroupCard}>
            <SettingRowToggle
              icon={<Lock size={17} color="#0A84FF" />}
              title="App Lock"
              desc="Protect your expense data"
              checked={toggles.appLock}
              onChange={() => handleToggle('appLock')}
            />
            <SettingRowToggle
              icon={<Fingerprint size={17} color="#30D158" />}
              title="Biometric Authentication"
              desc="Fingerprint / Face authentication"
              checked={toggles.biometricAuth}
              onChange={() => handleToggle('biometricAuth')}
            />
            <SettingRowLink
              icon={<Smartphone size={17} color="#64D2FF" />}
              title="Active Devices"
              value="Manage signed-in devices"
              onClick={() => alert('Active Sessions: 1 Phone, 1 Browser')}
            />
            <SettingRowLink
              icon={<EyeOff size={17} color="#BF5AF2" />}
              title="Privacy Controls"
              onClick={() => alert('Opening Privacy Preferences')}
            />
            <SettingRowLink
              icon={<ShieldCheck size={17} color="#FF9F0A" />}
              title="Data Permissions"
              onClick={() => alert('Checking Camera and Storage Access')}
            />
            <SettingRowLink
              icon={<FileText size={17} color="rgba(235, 235, 245, 0.5)" />}
              title="Privacy Policy"
              onClick={() => alert('Opening verified Privacy Policy')}
            />
            <SettingRowLink
              icon={<FileText size={17} color="rgba(235, 235, 245, 0.5)" />}
              title="Terms &amp; Conditions"
              onClick={() => alert('Opening Terms & Conditions')}
              isLast
            />
          </div>
        </section>

        {/* ==================================================
            12. APPEARANCE & APP PREFERENCES
        ================================================== */}
        <section style={styles.sectionBlock}>
          <h3 style={styles.sectionHeaderTitle}>App Preferences</h3>
          <div style={styles.settingsGroupCard}>
            <SettingRowLink
              icon={<Moon size={17} color="#BF5AF2" />}
              title="Appearance"
              value="Dark Mode"
              onClick={() => alert('Dark Mode is enforced for fintech telemetry')}
            />
            <SettingRowLink
              icon={<Globe size={17} color="#0A84FF" />}
              title="Language"
              value="English"
              onClick={() => alert('Select App Language')}
            />
            <SettingRowLink
              icon={<Hash size={17} color="#30D158" />}
              title="Currency Format"
              value="₹1,00,000"
              onClick={() => alert('Choose Number Representation')}
            />
            <SettingRowLink
              icon={<CalendarDays size={17} color="#FF9F0A" />}
              title="Date Format"
              value="DD/MM/YYYY"
              onClick={() => alert('Choose Date Layout')}
            />
            <SettingRowLink
              icon={<LayoutDashboard size={17} color="#64D2FF" />}
              title="Start Screen"
              value="Dashboard"
              onClick={() => alert('Select Default Tab On Launch')}
            />
            <SettingRowToggle
              icon={<Zap size={17} color="#FF375F" />}
              title="Animations"
              desc="Haptic feedback and interface scaling"
              checked={toggles.animations}
              onChange={() => handleToggle('animations')}
              isLast
            />
          </div>
        </section>

        {/* ==================================================
            13. NOTIFICATIONS
        ================================================== */}
        <section style={styles.sectionBlock}>
          <h3 style={styles.sectionHeaderTitle}>Notifications</h3>
          <div style={styles.settingsGroupCard}>
            <SettingRowToggle
              icon={<Bell size={17} color="#0A84FF" />}
              title="Expense Alerts"
              desc="Instant alerts on recorded transactions"
              checked={toggles.notifExpense}
              onChange={() => handleToggle('notifExpense')}
            />
            <SettingRowToggle
              icon={<AlertTriangle size={17} color="#FF9F0A" />}
              title="Budget Alerts"
              desc="Notification when approaching 80% ceiling"
              checked={toggles.notifBudget}
              onChange={() => handleToggle('notifBudget')}
            />
            <SettingRowToggle
              icon={<Clock size={17} color="#30D158" />}
              title="Bill Reminders"
              desc="Scheduled utility and loan reminders"
              checked={toggles.notifBills}
              onChange={() => handleToggle('notifBills')}
            />
            <SettingRowToggle
              icon={<CalendarDays size={17} color="#BF5AF2" />}
              title="Weekly Summary"
              desc="Digest of top spending merchants"
              checked={toggles.notifWeekly}
              onChange={() => handleToggle('notifWeekly')}
            />
            <SettingRowToggle
              icon={<Sparkles size={17} color="#64D2FF" />}
              title="AI Insights"
              desc="Smart detection of anomalies and savings"
              checked={toggles.notifAI}
              onChange={() => handleToggle('notifAI')}
            />
            <SettingRowToggle
              icon={<ShieldCheck size={17} color="#FF375F" />}
              title="Security Alerts"
              desc="Notifications on sign-ins and exports"
              checked={toggles.notifSecurity}
              onChange={() => handleToggle('notifSecurity')}
              isLast
            />
          </div>
        </section>

        {/* ==================================================
            14. HELP & SUPPORT
        ================================================== */}
        <section style={styles.sectionBlock}>
          <h3 style={styles.sectionHeaderTitle}>Help &amp; Support</h3>
          <div style={styles.settingsGroupCard}>
            <SettingRowLink
              icon={<HelpCircle size={17} color="#0A84FF" />}
              title="Help Center"
              onClick={() => alert('Opening Knowledge Base')}
            />
            <SettingRowLink
              icon={<MessageSquareHelp size={17} color="#64D2FF" />}
              title="Frequently Asked Questions"
              onClick={() => alert('Opening FAQ Repository')}
            />
            <SettingRowLink
              icon={<Bug size={17} color="#FF9F0A" />}
              title="Report a Problem"
              onClick={() => alert('Opening Debug Report Portal')}
            />
            <SettingRowLink
              icon={<Headphones size={17} color="#30D158" />}
              title="Contact Support"
              onClick={() => alert('Emailing support@smartai.finance')}
            />
            <SettingRowLink
              icon={<Send size={17} color="#BF5AF2" />}
              title="Send Feedback"
              onClick={() => alert('Feedback Form Opened')}
            />
            <SettingRowLink
              icon={<Star size={17} color="#FFD60A" />}
              title="Rate the App"
              onClick={() => alert('Opening App Store/Play Store Rating')}
            />
            <SettingRowLink
              icon={<Info size={17} color="rgba(235, 235, 245, 0.6)" />}
              title="About Smart AI Expense Tracker"
              onClick={() => alert('Smart AI Expense Tracker v1.0.0')}
              isLast
            />
          </div>

          <div style={styles.versionFooterText}>
            Smart AI Expense Tracker • Version 1.0.0 (Build 2026.09)
          </div>
        </section>

        {/* ==================================================
            15. SIGN OUT
        ================================================== */}
        <section style={{ ...styles.sectionBlock, marginBottom: '24px' }}>
          <button
            onClick={() => setShowSignOutConfirm(true)}
            style={styles.signOutButton}
          >
            <LogOut size={16} color="#FF453A" />
            <span>Sign Out Account</span>
          </button>
        </section>
      </div>

      {/* ==================================================
          16. BOTTOM NAVIGATION BAR
      ================================================== */}
      <nav style={styles.floatingBottomNav}>
        <button style={styles.navItemInactive} onClick={() => alert('Navigating to Home')}>
          <Home size={19} color="rgba(235, 235, 245, 0.45)" />
          <span>Home</span>
        </button>

        <button style={styles.navItemInactive} onClick={() => alert('Navigating to Ledger')}>
          <ArrowRightLeft size={19} color="rgba(235, 235, 245, 0.45)" />
          <span>Ledger</span>
        </button>

        {/* Prominent Elevated Center Scan Button */}
        <button
          style={styles.navCenterScanBtn}
          onClick={() => alert('Opening AI OCR Bill Scanner')}
          aria-label="Scan Bill"
        >
          <Camera size={22} color="#FFFFFF" strokeWidth={2.4} />
        </button>

        <button style={styles.navItemInactive} onClick={() => alert('Quick Add Modal')}>
          <PlusCircle size={19} color="rgba(235, 235, 245, 0.45)" />
          <span>+ Add</span>
        </button>

        <button style={styles.navItemActive}>
          <User size={19} color="#0A84FF" />
          <span style={{ color: '#0A84FF' }}>Profile</span>
        </button>
      </nav>

      {/* ==================================================
          SIGN OUT CONFIRMATION MODAL
      ================================================== */}
      {showSignOutConfirm && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalCard}>
            <div style={styles.modalIconRing}>
              <LogOut size={22} color="#FF453A" />
            </div>

            <h3 style={styles.modalHeading}>Sign out of your account?</h3>
            <p style={styles.modalSubheading}>
              You can sign back in anytime. Your synced expenses will remain available in your cloud profile.
            </p>

            <div style={styles.modalActionGrid}>
              <button
                onClick={() => setShowSignOutConfirm(false)}
                style={styles.modalCancelBtn}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSignOutConfirm(false);
                  alert('Signed out successfully.');
                }}
                style={styles.modalConfirmDestructiveBtn}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          EXPORT REPORT MODAL
      ================================================== */}
      {showExportModal && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={18} color="#0A84FF" />
                <h3 style={{ ...styles.modalHeading, margin: 0, textAlign: 'left' }}>Export Ledger</h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FFF' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ ...styles.modalSubheading, textAlign: 'left', marginBottom: '18px' }}>
              Select your required file format for audits, tax compliance, or bookkeeping.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['CSV Spreadsheet (.csv)', 'Tax Compliant PDF (.pdf)', 'Microsoft Excel (.xlsx)'].map((fmt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    alert(`Generating ${fmt}...`);
                    setShowExportModal(false);
                  }}
                  style={styles.exportFormatOptionBtn}
                >
                  <FileSpreadsheet size={16} color="#0A84FF" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFF' }}>{fmt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================================================
// SUB-COMPONENTS: SETTING ROWS
// ==================================================

function SettingRowLink({ icon, title, desc, value, valueColor, onClick, isLast = false }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...styles.rowContainer,
        borderBottom: isLast ? 'none' : '1px solid rgba(255, 255, 255, 0.05)'
      }}
    >
      <div style={styles.rowLeftWrapper}>
        {icon && <div style={styles.rowIconSquircle}>{icon}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={styles.rowTitleText}>{title}</span>
          {desc && <span style={styles.rowDescText}>{desc}</span>}
        </div>
      </div>

      <div style={styles.rowRightWrapper}>
        {value && (
          <span style={{ ...styles.rowValueText, color: valueColor || 'rgba(235, 235, 245, 0.6)' }}>
            {value}
          </span>
        )}
        <ChevronRight size={15} color="rgba(235, 235, 245, 0.35)" />
      </div>
    </div>
  );
}

function SettingRowToggle({ icon, title, desc, checked, onChange, isLast = false, compact = false }) {
  const toggleId = useId();

  return (
    <div
      onClick={onChange}
      style={{
        ...styles.rowContainer,
        padding: compact ? '12px 0' : '14px 16px',
        borderBottom: isLast ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
        cursor: 'pointer'
      }}
    >
      <div style={styles.rowLeftWrapper}>
        {icon && <div style={styles.rowIconSquircle}>{icon}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <label htmlFor={toggleId} style={{ ...styles.rowTitleText, cursor: 'pointer' }}>{title}</label>
          {desc && <span style={styles.rowDescText}>{desc}</span>}
        </div>
      </div>

      <div style={styles.rowRightWrapper}>
        {/* Accessible Switch Pattern */}
        <button
          id={toggleId}
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={(e) => {
            e.stopPropagation();
            onChange();
          }}
          style={{
            ...styles.togglePill,
            background: checked ? '#0A84FF' : 'rgba(255, 255, 255, 0.12)'
          }}
        >
          <div
            style={{
              ...styles.toggleThumb,
              transform: checked ? 'translateX(18px)' : 'translateX(0px)'
            }}
          />
        </button>
      </div>
    </div>
  );
}

// ==================================================
// STYLES OBJECT (Fintech Dark Glassmorphism)
// ==================================================

const styles = {
  layout: {
    width: '100%',
    minHeight: '100vh',
    minHeight: '100dvh',
    backgroundColor: '#05070A',
    color: '#FFFFFF',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    overflowX: 'hidden'
  },
  topAmbientFlare: {
    position: 'absolute',
    top: '-150px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '500px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(10, 132, 255, 0.18) 0%, rgba(191, 90, 242, 0.05) 50%, transparent 75%)',
    pointerEvents: 'none',
    zIndex: 0
  },
  scrollCanvas: {
    width: '100%',
    maxWidth: '430px',
    padding: '16px 20px calc(110px + env(safe-area-inset-bottom, 16px)) 20px',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box'
  },

  // Header Styles
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 'env(safe-area-inset-top, 8px)',
    marginBottom: '22px'
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: 800,
    letterSpacing: '-0.3px',
    margin: 0,
    color: '#FFFFFF'
  },
  headerSubtitle: {
    fontSize: '11px',
    color: 'rgba(235, 235, 245, 0.5)',
    margin: '2px 0 0 0'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  scanBillBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'linear-gradient(135deg, #0A84FF 0%, #0056D2 100%)',
    border: 'none',
    borderRadius: '12px',
    padding: '7px 11px',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(10, 132, 255, 0.35)'
  },
  headerIconButton: {
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },

  // Section Foundations
  sectionBlock: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '24px'
  },
  sectionHeaderTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: 'rgba(235, 235, 245, 0.6)',
    letterSpacing: '0.2px',
    marginBottom: '10px',
    paddingLeft: '4px'
  },
  settingsGroupCard: {
    background: 'rgba(16, 20, 28, 0.75)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    borderRadius: '24px',
    overflow: 'hidden'
  },

  // Profile Card Styles
  profileCard: {
    background: 'linear-gradient(135deg, rgba(22, 27, 40, 0.85) 0%, rgba(10, 13, 20, 0.95) 100%)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    border: '1px solid rgba(255, 255, 255, 0.09)',
    borderRadius: '26px',
    padding: '20px'
  },
  profileTopRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  avatarSquircle: {
    width: '54px',
    height: '54px',
    borderRadius: '18px',
    background: 'linear-gradient(135deg, #0A84FF 0%, #BF5AF2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 8px 20px rgba(10, 132, 255, 0.3)'
  },
  avatarText: {
    fontSize: '18px',
    fontWeight: 800,
    color: '#FFFFFF'
  },
  profileLabel: {
    fontSize: '10px',
    fontWeight: 700,
    color: 'rgba(235, 235, 245, 0.45)',
    textTransform: 'uppercase'
  },
  verifiedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    fontSize: '10px',
    fontWeight: 700,
    color: '#30D158',
    background: 'rgba(48, 209, 88, 0.12)',
    padding: '2px 6px',
    borderRadius: '8px'
  },
  userName: {
    fontSize: '17px',
    fontWeight: 800,
    color: '#FFF',
    margin: '2px 0 0 0'
  },
  userEmail: {
    fontSize: '12px',
    color: 'rgba(235, 235, 245, 0.5)',
    margin: 0
  },
  editProfileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '6px 10px',
    color: 'rgba(235, 235, 245, 0.8)',
    fontSize: '12px',
    fontWeight: 700,
    cursor: 'pointer'
  },
  profileDivider: {
    height: '1px',
    background: 'rgba(255, 255, 255, 0.06)',
    margin: '16px 0'
  },
  profileMetaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  },
  metaLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'rgba(235, 235, 245, 0.45)'
  },
  metaValue: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#FFFFFF',
    marginTop: '2px'
  },
  metaValueHighlight: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: 700,
    color: 'rgba(235, 235, 245, 0.9)',
    marginTop: '2px'
  },
  greenPulseDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#30D158'
  },

  // AI Assistant Card Styles
  aiAssistantCard: {
    background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.08) 0%, rgba(191, 90, 242, 0.04) 100%)',
    border: '1px solid rgba(10, 132, 255, 0.22)',
    borderRadius: '26px',
    padding: '20px',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)'
  },
  aiCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  aiIconBadge: {
    width: '36px',
    height: '36px',
    borderRadius: '12px',
    background: 'rgba(10, 132, 255, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardHeading: {
    fontSize: '15px',
    fontWeight: 800,
    color: '#FFFFFF',
    margin: 0
  },
  cardSubheading: {
    fontSize: '11px',
    color: 'rgba(235, 235, 245, 0.5)',
    margin: '2px 0 0 0'
  },
  aiLiveStatusPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    background: 'rgba(10, 132, 255, 0.12)',
    border: '1px solid rgba(10, 132, 255, 0.25)',
    padding: '3px 9px',
    borderRadius: '12px'
  },
  aiLivePulse: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#0A84FF',
    boxShadow: '0 0 8px #0A84FF'
  },
  aiMetricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    marginBottom: '16px'
  },
  aiMetricBox: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '14px',
    padding: '10px 8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  aiMetricLabel: {
    fontSize: '10px',
    fontWeight: 600,
    color: 'rgba(235, 235, 245, 0.45)',
    lineHeight: '1.2',
    height: '24px',
    display: 'flex',
    alignItems: 'center'
  },
  aiMetricVal: {
    fontSize: '14px',
    fontWeight: 800,
    color: '#FFF',
    marginTop: '4px'
  },
  aiInsightsBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    background: 'rgba(10, 132, 255, 0.1)',
    border: '1px solid rgba(10, 132, 255, 0.2)',
    borderRadius: '14px',
    padding: '11px',
    color: '#0A84FF',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer'
  },

  // Budget Card Specific Styles
  budgetOverviewCard: {
    background: 'rgba(16, 20, 28, 0.75)',
    backdropFilter: 'blur(25px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '26px',
    padding: '20px'
  },
  budgetCardSub: {
    fontSize: '11px',
    fontWeight: 700,
    color: 'rgba(235, 235, 245, 0.5)',
    textTransform: 'uppercase'
  },
  budgetCardTotal: {
    fontSize: '26px',
    fontWeight: 800,
    color: '#FFF',
    letterSpacing: '-0.5px',
    marginTop: '2px'
  },
  budgetPctBadge: {
    fontSize: '11px',
    fontWeight: 800,
    color: '#FF9F0A',
    background: 'rgba(255, 159, 10, 0.12)',
    padding: '4px 8px',
    borderRadius: '10px'
  },
  progressBarTrack: {
    width: '100%',
    height: '7px',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: '10px',
    overflow: 'hidden',
    margin: '14px 0'
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #0A84FF 0%, #FF9F0A 100%)',
    borderRadius: '10px',
    transition: 'width 0.4s ease'
  },
  budgetMetricsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  budgetMiniLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'rgba(235, 235, 245, 0.45)'
  },
  budgetMiniValSpent: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#FF453A',
    marginTop: '1px'
  },
  budgetMiniValRemaining: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#30D158',
    marginTop: '1px'
  },

  // Cloud Sync Block
  cloudSyncCard: {
    background: 'rgba(16, 20, 28, 0.75)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '18px'
  },
  syncStatusGreen: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#30D158',
    background: 'rgba(48, 209, 88, 0.1)',
    padding: '3px 8px',
    borderRadius: '8px'
  },
  lastBackupStamp: {
    fontSize: '11px',
    color: 'rgba(235, 235, 245, 0.4)',
    margin: '6px 0 0 0'
  },
  backupActionPrimary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    background: '#0A84FF',
    border: 'none',
    borderRadius: '12px',
    padding: '11px',
    color: '#FFF',
    fontSize: '12px',
    fontWeight: 700,
    cursor: 'pointer'
  },
  backupActionSecondary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '11px',
    color: '#FFF',
    fontSize: '12px',
    fontWeight: 700,
    cursor: 'pointer'
  },

  // Row Level Reusables
  rowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    minHeight: '52px',
    cursor: 'pointer'
  },
  rowLeftWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    minWidth: 0,
    paddingRight: '12px'
  },
  rowIconSquircle: {
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.04)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  rowTitleText: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#FFFFFF'
  },
  rowDescText: {
    fontSize: '11px',
    color: 'rgba(235, 235, 245, 0.45)',
    lineHeight: '1.2'
  },
  rowRightWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexShrink: 0
  },
  rowValueText: {
    fontSize: '12px',
    fontWeight: 500
  },

  // Switch Toggle Styling
  togglePill: {
    width: '42px',
    height: '24px',
    borderRadius: '20px',
    padding: '2px',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  toggleThumb: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
  },

  // Sign Out & Footers
  signOutButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '15px',
    borderRadius: '18px',
    background: 'rgba(255, 69, 58, 0.08)',
    border: '1px solid rgba(255, 69, 58, 0.22)',
    color: '#FF453A',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer'
  },
  versionFooterText: {
    textAlign: 'center',
    fontSize: '11px',
    color: 'rgba(235, 235, 245, 0.3)',
    marginTop: '16px'
  },

  // Floating Bottom Navigation (Glass Pill)
  floatingBottomNav: {
    position: 'fixed',
    bottom: 'max(14px, env(safe-area-inset-bottom, 14px))',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 32px)',
    maxWidth: '390px',
    background: 'rgba(14, 18, 26, 0.92)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '30px',
    padding: '8px 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.85)',
    zIndex: 200
  },
  navItemInactive: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    fontSize: '10px',
    fontWeight: 600,
    color: 'rgba(235, 235, 245, 0.45)',
    cursor: 'pointer',
    padding: '4px 8px'
  },
  navItemActive: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    fontSize: '10px',
    fontWeight: 700,
    color: '#0A84FF',
    cursor: 'pointer',
    padding: '4px 8px'
  },
  navCenterScanBtn: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #0A84FF 0%, #0056D2 100%)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transform: 'translateY(-6px)',
    boxShadow: '0 8px 24px rgba(10, 132, 255, 0.45)'
  },

  // Modal Dialogs
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    zIndex: 500
  },
  modalCard: {
    width: '100%',
    maxWidth: '340px',
    background: '#121620',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '24px',
    textAlign: 'center',
    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)'
  },
  modalIconRing: {
    width: '48px',
    height: '48px',
    borderRadius: '16px',
    background: 'rgba(255, 69, 58, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 14px auto'
  },
  modalHeading: {
    fontSize: '16px',
    fontWeight: 800,
    color: '#FFF',
    margin: '0 0 6px 0'
  },
  modalSubheading: {
    fontSize: '12px',
    color: 'rgba(235, 235, 245, 0.55)',
    lineHeight: '1.4',
    margin: '0 0 20px 0'
  },
  modalActionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px'
  },
  modalCancelBtn: {
    padding: '12px',
    borderRadius: '14px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#FFF',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer'
  },
  modalConfirmDestructiveBtn: {
    padding: '12px',
    borderRadius: '14px',
    background: '#FF453A',
    border: 'none',
    color: '#FFF',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer'
  },
  exportFormatOptionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '13px 14px',
    borderRadius: '14px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    cursor: 'pointer',
    textAlign: 'left'
  }
};