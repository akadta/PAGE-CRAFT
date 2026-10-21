import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { templateApi } from "../../../api/templateApi";

export default function TemplateCreate() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const limit = 9;

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await templateApi.getAll({ search, page, limit });
      setTemplates(res.data.templates);
      setTotal(res.data.total);
    } catch {
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleCreate = async () => {
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    setCreating(true);
    setError("");
    try {
      const res = await templateApi.create({
        name: form.name,
        description: form.description,
        data: {},
      });
      setModalOpen(false);
      setForm({ name: "", description: "" });
      navigate(`/template/${res.data.id}/edit`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this template?")) return;
    await templateApi.remove(id);
    fetchTemplates();
  };

  const totalPages = Math.ceil(total / limit);
  const handleActivate = async (id) => {
    await templateApi.activate(id);
    fetchTemplates(); // refreshes list, shows new active state
  };
  return (
    <div
      style={{
        padding: "28px 32px",
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <style>{`
        .tc-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
        .tc-title { font-size:20px; font-weight:700; color:#0f172a; }
        .tc-subtitle { font-size:13px; color:#64748b; margin-top:2px; }
        .tc-btn-primary {
          background:#2563eb; color:#fff; border:none; border-radius:8px;
          padding:9px 18px; font-size:13px; font-weight:600; cursor:pointer;
          display:flex; align-items:center; gap:7px; transition:background 0.2s;
        }
        .tc-btn-primary:hover { background:#1d4ed8; }
        .tc-search {
          width:100%; max-width:340px; padding:9px 14px 9px 36px;
          border:1px solid #e2e8f0; border-radius:8px; font-size:13px;
          color:#0f172a; background:#fff; outline:none;
          transition:border 0.2s;
        }
        .tc-search:focus { border-color:#2563eb; }
        .tc-search-wrap { position:relative; margin-bottom:20px; }
        .tc-search-icon { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:#94a3b8; font-size:15px; }
        .tc-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; }
        .tc-card {
          background:#fff; border:1px solid #e8edf3; border-radius:12px;
          overflow:hidden; transition:box-shadow 0.2s, transform 0.2s;
          cursor:pointer;
        }
        .tc-card:hover { box-shadow:0 4px 20px rgba(37,99,235,0.10); transform:translateY(-2px); }
        .tc-card-thumb {
          height:140px; background:linear-gradient(135deg,#eff6ff,#dbeafe);
          display:flex; align-items:center; justify-content:center;
          border-bottom:1px solid #e8edf3;
        }
        .tc-card-body { padding:14px 16px; }
        .tc-card-name { font-size:14px; font-weight:600; color:#0f172a; margin-bottom:4px; }
        .tc-card-desc { font-size:12px; color:#64748b; margin-bottom:12px; line-height:1.5; }
        .tc-card-footer { display:flex; align-items:center; justify-content:space-between; }
        .tc-card-date { font-size:11px; color:#94a3b8; }
        .tc-card-actions { display:flex; gap:6px; }
        .tc-action-btn {
          border:none; background:#f1f5f9; color:#475569;
          border-radius:6px; padding:5px 10px; font-size:11px;
          font-weight:500; cursor:pointer; transition:all 0.15s;
        }
        .tc-action-btn:hover { background:#e0e7ff; color:#2563eb; }
        .tc-action-btn.danger:hover { background:#fee2e2; color:#dc2626; }
        .tc-empty { text-align:center; padding:60px 20px; color:#94a3b8; }
        .tc-empty-icon { font-size:40px; margin-bottom:12px; }
        .tc-pagination { display:flex; align-items:center; gap:8px; margin-top:24px; justify-content:center; }
        .tc-page-btn {
          border:1px solid #e2e8f0; background:#fff; color:#475569;
          border-radius:7px; padding:6px 13px; font-size:12px; cursor:pointer;
          transition:all 0.15s;
        }
        .tc-page-btn:hover:not(:disabled) { border-color:#2563eb; color:#2563eb; }
        .tc-page-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .tc-page-btn.active { background:#2563eb; border-color:#2563eb; color:#fff; }

        /* Modal */
        .tc-overlay {
          position:fixed; inset:0; background:rgba(0,0,0,0.45);
          display:flex; align-items:center; justify-content:center;
          z-index:1000; padding:20px;
        }
        .tc-modal {
          background:#fff; border-radius:14px; width:100%; max-width:440px;
          box-shadow:0 20px 60px rgba(0,0,0,0.15); overflow:hidden;
        }
        .tc-modal-header {
          padding:20px 24px 16px; border-bottom:1px solid #f1f5f9;
          display:flex; align-items:center; justify-content:space-between;
        }
        .tc-modal-title { font-size:16px; font-weight:700; color:#0f172a; }
        .tc-modal-close {
          border:none; background:none; font-size:20px; color:#94a3b8;
          cursor:pointer; line-height:1; padding:0;
        }
        .tc-modal-body { padding:20px 24px; }
        .tc-field { margin-bottom:16px; }
        .tc-label { font-size:12px; font-weight:600; color:#374151; margin-bottom:6px; display:block; }
        .tc-input {
          width:100%; padding:9px 12px; border:1px solid #e2e8f0;
          border-radius:8px; font-size:13px; color:#0f172a; outline:none;
          transition:border 0.2s; box-sizing:border-box;
        }
        .tc-input:focus { border-color:#2563eb; }
        .tc-textarea { resize:vertical; min-height:80px; }
        .tc-error { color:#dc2626; font-size:12px; margin-bottom:10px; }
        .tc-modal-footer {
          padding:14px 24px 20px; display:flex; justify-content:flex-end; gap:10px;
        }
        .tc-btn-ghost {
          background:#f1f5f9; color:#475569; border:none; border-radius:8px;
          padding:9px 18px; font-size:13px; font-weight:500; cursor:pointer;
        }
        .tc-btn-ghost:hover { background:#e2e8f0; }
      `}</style>

      {/* Header */}
      <div className="tc-header">
        <div>
          <div className="tc-title">Templates</div>
          <div className="tc-subtitle">
            {total} template{total !== 1 ? "s" : ""} total
          </div>
        </div>
        <button className="tc-btn-primary" onClick={() => setModalOpen(true)}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Template
        </button>
      </div>

      {/* Search */}
      <div className="tc-search-wrap">
        <svg
          className="tc-search-icon"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="tc-search"
          placeholder="Search templates..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="tc-empty">
          <div className="tc-empty-icon">⏳</div>Loading...
        </div>
      ) : templates.length === 0 ? (
        <div className="tc-empty">
          <div className="tc-empty-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
          <div style={{ fontWeight: 600, color: "#475569", marginBottom: 6 }}>
            No templates yet
          </div>
          <div style={{ fontSize: 13 }}>
            Create your first template to get started
          </div>
        </div>
      ) : (
        <div className="tc-grid">
          {templates.map((t) => (
            <div
              className="tc-card"
              key={t.id}
              onClick={() => navigate(`/template/${t.id}/edit`)}
            >
              <div
                className="tc-card-thumb"
                onClick={() => navigate(`/template/${t.id}/edit`)}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#93c5fd"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
              </div>
              <div className="tc-card-body">
                <div className="tc-card-name">{t.name}</div>
                <div className="tc-card-desc">
                  {t.description || "No description"}
                </div>
                <div className="tc-card-footer">
                  <span className="tc-card-date">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                  <div className="tc-card-actions">
                    <button
                      className="tc-action-btn"
                      onClick={() => navigate(`/template/${t.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="tc-action-btn"
                      style={
                        t.isActive
                          ? { background: "#dcfce7", color: "#16a34a" }
                          : {}
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivate(t.id);
                      }}
                    >
                      {t.isActive ? "✓ Active" : "Set Active"}
                    </button>
                    <button
                      className="tc-action-btn danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(t.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="tc-pagination">
          <button
            className="tc-page-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`tc-page-btn${page === p ? " active" : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="tc-page-btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}

      {/* Create Modal */}
      {modalOpen && (
        <div
          className="tc-overlay"
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div className="tc-modal">
            <div className="tc-modal-header">
              <span className="tc-modal-title">New Template</span>
              <button
                className="tc-modal-close"
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="tc-modal-body">
              {error && <div className="tc-error">{error}</div>}
              <div className="tc-field">
                <label className="tc-label">Template Name *</label>
                <input
                  className="tc-input"
                  placeholder="e.g. Corporate Landing Page"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
              </div>
              <div className="tc-field">
                <label className="tc-label">Description</label>
                <textarea
                  className="tc-input tc-textarea"
                  placeholder="Optional description..."
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="tc-modal-footer">
              <button
                className="tc-btn-ghost"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="tc-btn-primary"
                onClick={handleCreate}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create & Edit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
