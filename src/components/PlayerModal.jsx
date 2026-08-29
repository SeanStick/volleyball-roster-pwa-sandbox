import React, { useState, useEffect } from 'react';
import { X, Check, Star, Award, Shield, User, Volleyball, ArrowLeftRight } from 'lucide-react';
import JerseyVisualizer from './JerseyVisualizer';

const POSITIONS = [
  'Setter',
  'Outside Hitter',
  'Middle Blocker',
  'Libero',
  'Opposite Hitter',
  'Right Side',
  'Defensive Specialist',
  'Serving Specialist'
];

export default function PlayerModal({ isOpen, onClose, onSave, playerToEdit, teamSettings, roster = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    position: 'Outside Hitter',
    secondaryPosition: '',
    isCaptain: false,
    isStarter: false,
    isFirstServer: false,
    height: '',
    status: 'Active',
    subPartnerId: '',
    subTrigger: 'back_row',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (playerToEdit) {
      setFormData({
        name: playerToEdit.name || '',
        number: playerToEdit.number !== undefined ? playerToEdit.number : '',
        position: playerToEdit.position || 'Outside Hitter',
        secondaryPosition: playerToEdit.secondaryPosition || '',
        isCaptain: Boolean(playerToEdit.isCaptain),
        isStarter: Boolean(playerToEdit.isStarter),
        isFirstServer: Boolean(playerToEdit.isFirstServer),
        height: playerToEdit.height || '',
        status: playerToEdit.status || 'Active',
        subPartnerId: playerToEdit.subPartnerId || '',
        subTrigger: playerToEdit.subTrigger || 'back_row',
        notes: playerToEdit.notes || ''
      });
    } else {
      // Default for new player
      setFormData({
        name: '',
        number: '',
        position: 'Outside Hitter',
        secondaryPosition: '',
        isCaptain: false,
        isStarter: false,
        isFirstServer: false,
        height: '',
        status: 'Active',
        subPartnerId: '',
        subTrigger: 'back_row',
        notes: ''
      });
    }
    setErrors({});
  }, [playerToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Player name is required';
    }
    if (formData.number === '' || formData.number === null) {
      newErrors.number = 'Jersey number is required';
    } else {
      const num = Number(formData.number);
      if (isNaN(num) || num < 0 || num > 99) {
        newErrors.number = 'Number must be between 0 and 99';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...(playerToEdit || { id: `p-${Date.now()}` }),
      name: formData.name.trim(),
      number: parseInt(formData.number, 10),
      position: formData.position,
      secondaryPosition: formData.secondaryPosition,
      isCaptain: formData.isCaptain,
      isStarter: formData.isStarter,
      isFirstServer: formData.isFirstServer,
      height: formData.height.trim(),
      status: formData.status,
      subPartnerId: formData.subPartnerId || null,
      subTrigger: formData.subTrigger || 'back_row',
      notes: formData.notes.trim()
    });
  };

  const isLibero = formData.position === 'Libero';
  const availablePartners = roster.filter(p => !playerToEdit || p.id !== playerToEdit.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {playerToEdit ? 'Edit Volleyball Player' : 'Add Volleyball Player'}
          </h2>
          <button className="btn-icon btn-sm" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Dynamic Jersey Live Preview */}
        <div className="jersey-preview-container">
          <JerseyVisualizer
            number={formData.number}
            name={formData.name}
            position={formData.position}
            isCaptain={formData.isCaptain}
            isLibero={isLibero}
            primaryColor={teamSettings?.primaryColor || '#ff6b35'}
            secondaryColor={teamSettings?.secondaryColor || '#1e3a8a'}
            size={130}
          />
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Live Jersey Preview
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name & Number Row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Player Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Jordan Cruz"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                autoFocus
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Jersey Number (0-99) *</label>
              <input
                type="number"
                min="0"
                max="99"
                className="form-input"
                placeholder="e.g. 14"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              />
              {errors.number && <div className="form-error">{errors.number}</div>}
            </div>
          </div>

          {/* Position & Secondary Position */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Primary Position *</label>
              <select
                className="form-select"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              >
                {POSITIONS.map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Secondary Position</label>
              <select
                className="form-select"
                value={formData.secondaryPosition}
                onChange={(e) => setFormData({ ...formData, secondaryPosition: e.target.value })}
              >
                <option value="">None</option>
                {POSITIONS.filter(p => p !== formData.position).map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Height & Status */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Height (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 6'2&quot; or 188cm"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Bench">Bench</option>
                <option value="Injured">Injured</option>
                <option value="Reserve">Reserve</option>
              </select>
            </div>
          </div>

          {/* Toggles: Captain, Starting Lineup & First Server */}
          <div className="form-row" style={{ marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem' }}>
            <div
              className="toggle-group"
              onClick={() => setFormData({ ...formData, isCaptain: !formData.isCaptain })}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: '600' }}>
                <Star size={15} color={formData.isCaptain ? '#f59e0b' : 'var(--text-muted)'} fill={formData.isCaptain ? '#f59e0b' : 'none'} />
                Captain
              </span>
              <input
                type="checkbox"
                checked={formData.isCaptain}
                onChange={(e) => setFormData({ ...formData, isCaptain: e.target.checked })}
              />
            </div>

            <div
              className="toggle-group"
              onClick={() => setFormData({ ...formData, isStarter: !formData.isStarter })}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: '600' }}>
                <Award size={15} color={formData.isStarter ? '#10b981' : 'var(--text-muted)'} />
                Starting 6
              </span>
              <input
                type="checkbox"
                checked={formData.isStarter}
                onChange={(e) => setFormData({ ...formData, isStarter: e.target.checked })}
              />
            </div>

            <div
              className="toggle-group"
              onClick={() => setFormData({ ...formData, isFirstServer: !formData.isFirstServer })}
              title="Designate this player to serve first for the team at the start of the match"
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: '600' }}>
                <Volleyball size={15} color={formData.isFirstServer ? '#3b82f6' : 'var(--text-muted)'} />
                1st Server
              </span>
              <input
                type="checkbox"
                checked={formData.isFirstServer}
                onChange={(e) => setFormData({ ...formData, isFirstServer: e.target.checked })}
              />
            </div>
          </div>

          {/* 🔄 Substitution & Rotation Strategy Section */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-md)',
            padding: '0.9rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
              <ArrowLeftRight size={16} color="var(--accent-orange)" />
              <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#f8fafc' }}>
                Substitution & 6-1 Rotation Strategy
              </span>
            </div>

            <div className="form-row" style={{ marginBottom: 0 }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.78rem' }}>
                  Designated Sub For (Starter):
                </label>
                <select
                  className="form-select"
                  value={formData.subPartnerId}
                  onChange={(e) => setFormData({ ...formData, subPartnerId: e.target.value })}
                >
                  <option value="">None (Regular Rotation)</option>
                  {availablePartners.map(p => (
                    <option key={p.id} value={p.id}>
                      #{p.number} {p.name} ({p.position}) {p.isStarter ? '★ Starter' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.78rem' }}>
                  Sub-In Trigger:
                </label>
                <select
                  className="form-select"
                  value={formData.subTrigger}
                  onChange={(e) => setFormData({ ...formData, subTrigger: e.target.value })}
                  disabled={!formData.subPartnerId}
                >
                  <option value="back_row">When Partner is in Back Row (Z1, Z6, Z5)</option>
                  <option value="serving">When Partner is Serving (Zone 1)</option>
                  {!isLibero && <option value="front_row">When Partner is in Front Row (Z4, Z3, Z2)</option>}
                </select>
              </div>
            </div>

            {/* Libero Rule Notification */}
            {isLibero && (
              <div style={{ fontSize: '0.74rem', color: '#c084fc', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Shield size={14} color="#c084fc" />
                <span><strong>Volleyball Rule 19.3.1.1:</strong> Libero is strictly restricted to back-row replacement only.</span>
              </div>
            )}
          </div>

          {/* Coach Notes */}
          <div className="form-group">
            <label className="form-label">Coach Notes (Optional)</label>
            <textarea
              rows="2"
              className="form-textarea"
              placeholder="e.g. Heavy topspin jump server, primary target in serve-receive."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              {playerToEdit ? 'Save Changes' : 'Add Player to Roster'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
