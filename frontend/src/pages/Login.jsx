import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Mail, Lock, User, AlertCircle } from 'lucide-react';
import api, { setTokens } from '../services/api';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await api.post('/api/register/', {
          username: username.trim(),
          email: email.trim(),
          password: password.trim()
        });
      }

      const res = await api.post('/api/token/', {
        username: username.trim(),
        password: password.trim()
      });

      if (res.data && res.data.access) {
        setTokens(res.data.access, res.data.refresh);
        window.location.hash = '#/';
        window.location.reload();
      } else {
        throw new Error('Token generation failed');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        const d = err.response.data;
        const msg = typeof d === 'object' ? Object.values(d).flat().join(' ') : 'Authentication failed';
        setError(msg);
      } else if (err.code === 'ERR_NETWORK') {
        setError('Server is connecting... Please wait 30 seconds if Render was idle and retry.');
      } else {
        setError('Authentication failed. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#07080B',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
    }}>
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '450px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(10, 132, 255, 0.18) 0%, transparent 65%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(18, 21, 30, 0.75)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '32px',
        padding: '36px 28px',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #0A84FF 0%, #0056D2 100%)',
            margin: '0 auto 16px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 28px rgba(10, 132, 255, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.25)'
          }}>
            <Sparkles size={28} color="#FFFFFF" />
          </div>
          <h2 style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'rgba(235, 235, 245, 0.55)', fontSize: '13px', margin: 0 }}>
            {isRegister ? 'Start tracking your expenses with precision' : 'Sign in to access your financial dashboard'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255, 69, 58, 0.12)',
            border: '1px solid rgba(255, 69, 58, 0.28)',
            color: '#FF453A',
            padding: '12px 14px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(235, 235, 245, 0.5)', marginBottom: '8px' }}>
              Username
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              borderRadius: '16px',
              padding: '0 14px'
            }}>
              <User size={18} color="rgba(235, 235, 245, 0.4)" />
              <input
                type="text"
                required
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 12px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(235, 235, 245, 0.5)', marginBottom: '8px' }}>
                Email Address
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: '16px',
                padding: '0 14px'
              }}>
                <Mail size={18} color="rgba(235, 235, 245, 0.4)" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 12px',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 500
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'rgba(235, 235, 245, 0.5)', marginBottom: '8px' }}>
              Password
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              borderRadius: '16px',
              padding: '0 14px'
            }}>
              <Lock size={18} color="rgba(235, 235, 245, 0.4)" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 12px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '10px',
              padding: '15px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #0A84FF 0%, #0056D2 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 10px 24px rgba(10, 132, 255, 0.4)',
              opacity: loading ? 0.7 : 1
            }}
          >
            <span>{loading ? 'Authenticating...' : (isRegister ? 'Register Account' : 'Sign In')}</span>
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{
              background: 'none',
              border: 'none',
              color: '#0A84FF',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
          </button>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '28px',
          color: 'rgba(235, 235, 245, 0.35)',
          fontSize: '11px',
          fontWeight: 600
        }}>
          <ShieldCheck size={14} color="#30D158" />
          <span>End-to-End Encrypted Cloud Banking Architecture</span>
        </div>
      </div>
    </div>
  );
}