import React, { useEffect } from 'react';
import { Trophy, CheckCircle, MapPin, Swords, AlertCircle, X } from 'lucide-react';

export default function TournamentSyncToast({ toast, onDismiss }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'new_match':
        return <Trophy size={18} color="#fbbf24" />;
      case 'new_set':
        return <CheckCircle size={18} color="#34d399" />;
      case 'court_change':
        return <MapPin size={18} color="#60a5fa" />;
      default:
        return <AlertCircle size={18} color="#a78bfa" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '85px',
        right: '20px',
        zIndex: 1200,
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid rgba(59, 130, 246, 0.4)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.2)',
        borderRadius: '14px',
        padding: '0.85rem 1.15rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        maxWidth: '380px',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {getIcon()}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {toast.title || 'Tournament Sync'}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.3, marginTop: '2px' }}>
          {toast.message}
        </div>
      </div>

      <button
        onClick={onDismiss}
        style={{
          background: 'none',
          border: 'none',
          color: '#64748b',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px'
        }}
      >
        <X size={15} />
      </button>
    </div>
  );
}
