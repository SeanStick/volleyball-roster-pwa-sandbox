import React from 'react';
import { Plus, Database, Volleyball } from 'lucide-react';

export default function Navbar({ onOpenAddModal, onOpenImportExportModal }) {

  return (
    <header className="header-glass">
      <div className="brand-wrapper">
        <div className="brand-icon">
          <Volleyball size={24} color="#ffffff" />
        </div>
        <div>
          <div className="brand-title">
            Go Stand Over There
          </div>
        </div>
      </div>

      <div className="header-actions">
        

        {/* Import / Export Modal Trigger */}
        <button
          className="btn-icon"
          onClick={onOpenImportExportModal}
          title="Backup & Import Roster"
          aria-label="Backup and Import Roster"
        >
          <Database size={18} />
        </button>

        {/* Add Player Action */}
        <button className="btn btn-primary btn-sm" onClick={onOpenAddModal}>
          <Plus size={16} />
          <span>Add Player</span>
        </button>
      </div>
    </header>
  );
}
