import React, { useState, useEffect } from 'react';
import { X, Check, Star, Award, Shield, User, ArrowLeftRight } from 'lucide-react';
import VolleyballIcon from './icons/VolleyballIcon';
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

    const playerId = playerToEdit?.id || `p-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    onSave({
      ...(playerToEdit || {}),
      id: playerId,
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
    <div className="modal-overlay player-modal-overlay" onClick={onClose}>
      <div className="modal-content player-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Sticky Modal Header */}
        <div className="modal-header player-modal-header">
          <div className="player-modal-header-info">
            <div className="player-modal-header-icon">
              <VolleyballIcon size={20} color="var(--accent-orange)" />
            </div>
            <div>
              <h2 className="modal-title player-modal-title">
                {playerToEdit ? 'Edit Volleyball Player' : 'Add Volleyball Player'}
              </h2>
              <div className="player-modal-subtitle">
                {playerToEdit ? `Updating #${playerToEdit.number} ${playerToEdit.name}` : 'Assign number, position, and rotation strategy'}
              </div>
            </div>
          </div>
          <button className="btn-icon btn-sm" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="player-modal-form">
          {/* Scrollable Form Body */}
          <div className="player-modal-body">
            {/* Dynamic Jersey Live Preview Card */}
            <div className="jersey-preview-container">
              <div className="jersey-preview-visual">
                <JerseyVisualizer
                  number={formData.number}
                  name={formData.name}
                  position={formData.position}
                  isCaptain={formData.isCaptain}
                  isLibero={isLibero}
                  primaryColor={teamSettings?.primaryColor || '#ff6b35'}
                  secondaryColor={teamSettings?.secondaryColor || '#1e3a8a'}
                />
              </div>
              <div className="jersey-preview-details">
                <div className="jersey-preview-heading">Live Jersey Preview</div>
                <div className="jersey-preview-player-name">
                  {formData.name.trim() || 'Player Name'}
                </div>
                <div className="jersey-preview-badges">
                  <span className={`badge-position ${formData.position === 'Libero' ? 'pos-libero' : formData.position === 'Setter' ? 'pos-setter' : 'pos-outside'}`}>
                    {formData.position}
                  </span>
                  {formData.isStarter && (
                    <span className="badge-status" style={{ color: '#34d399', background: 'rgba(16, 185, 129, 0.15)' }}>
                      ★ Starter
                    </span>
                  )}
                  {formData.isCaptain && (
                    <span className="badge-status" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)' }}>
                      Captain
                    </span>
                  )}
                  {formData.isFirstServer && (
                    <span className="badge-status" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)' }}>
                      1st Server
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Name & Number Row */}
            <div className="form-row form-row-name-num">
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
                <label className="form-label">Jersey # (0-99) *</label>
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
            <div className="player-toggle-grid">
              <div
                className="toggle-group"
                onClick={() => setFormData({ ...formData, isCaptain: !formData.isCaptain })}
              >
                <span className="toggle-label">
                  <Star size={15} color={formData.isCaptain ? '#f59e0b' : 'var(--text-muted)'} fill={formData.isCaptain ? '#f59e0b' : 'none'} />
                  <span>Captain</span>
                </span>
                <input
                  type="checkbox"
                  checked={formData.isCaptain}
                  onChange={(e) => setFormData({ ...formData, isCaptain: e.target.checked })}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div
                className="toggle-group"
                onClick={() => setFormData({ ...formData, isStarter: !formData.isStarter })}
              >
                <span className="toggle-label">
                  <Award size={15} color={formData.isStarter ? '#10b981' : 'var(--text-muted)'} />
                  <span>Starting 6</span>
                </span>
                <input
                  type="checkbox"
                  checked={formData.isStarter}
                  onChange={(e) => setFormData({ ...formData, isStarter: e.target.checked })}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div
                className="toggle-group"
                onClick={() => setFormData({ ...formData, isFirstServer: !formData.isFirstServer })}
                title="Designate this player to serve first for the team at the start of the match"
              >
                <span className="toggle-label">
                  <VolleyballIcon size={15} color={formData.isFirstServer ? '#3b82f6' : 'var(--text-muted)'} />
                  <span>1st Server</span>
                </span>
                <input
                  type="checkbox"
                  checked={formData.isFirstServer}
                  onChange={(e) => setFormData({ ...formData, isFirstServer: e.target.checked })}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* 🔄 Substitution & Rotation Strategy Section */}
            <div className="player-sub-strategy-card">
              <div className="player-sub-strategy-header">
                <ArrowLeftRight size={16} color="var(--accent-orange)" />
                <span>Substitution & 6-2 Rotation Strategy</span>
              </div>

              <div className="form-row form-row-sub" style={{ marginBottom: 0 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
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

                <div className="form-group" style={{ marginBottom: 0 }}>
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
                <div className="player-libero-rule-notice">
                  <Shield size={14} color="#c084fc" />
                  <span><strong>Volleyball Rule 19.3.1.1:</strong> Libero is strictly restricted to back-row replacement only.</span>
                </div>
              )}
            </div>

            {/* Coach Notes */}
            <div className="form-group" style={{ marginBottom: '0.25rem' }}>
              <label className="form-label">Coach Notes (Optional)</label>
              <textarea
                rows="2"
                className="form-textarea"
                placeholder="e.g. Heavy topspin jump server, primary target in serve-receive."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          {/* Sticky Modal Action Footer */}
          <div className="player-modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary player-modal-submit-btn">
              <Check size={16} />
              <span>{playerToEdit ? 'Save Changes' : 'Add Player to Roster'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
