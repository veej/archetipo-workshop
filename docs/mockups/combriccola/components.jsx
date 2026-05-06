// Reusable UI primitives & icons for TravelHub

function Icon({ name, size = 18, stroke = 1.8, style }) {
  const s = { width: size, height: size, ...style };
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", style: s };
  switch (name) {
    case "home":     return <svg {...common}><path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/></svg>;
    case "compass":  return <svg {...common}><circle cx="12" cy="12" r="9"/><polygon points="16,8 13,13 8,16 11,11"/></svg>;
    case "calendar": return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>;
    case "file":     return <svg {...common}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>;
    case "wallet":   return <svg {...common}><path d="M3 7a2 2 0 0 1 2-2h14v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M3 7v0a2 2 0 0 0 2 2h16"/><circle cx="17" cy="14" r="1.2" fill="currentColor"/></svg>;
    case "users":    return <svg {...common}><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><circle cx="17" cy="8" r="3"/><path d="M22 19a5 5 0 0 0-5-5"/></svg>;
    case "bell":     return <svg {...common}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8z"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
    case "search":   return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
    case "plus":     return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
    case "check":    return <svg {...common}><path d="M5 13l4 4L19 7"/></svg>;
    case "x":        return <svg {...common}><path d="M6 6l12 12M6 18L18 6"/></svg>;
    case "chevron-right": return <svg {...common}><path d="M9 6l6 6-6 6"/></svg>;
    case "chevron-down":  return <svg {...common}><path d="M6 9l6 6 6-6"/></svg>;
    case "more":     return <svg {...common}><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></svg>;
    case "edit":     return <svg {...common}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>;
    case "trash":    return <svg {...common}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>;
    case "upload":   return <svg {...common}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>;
    case "download": return <svg {...common}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>;
    case "map-pin":  return <svg {...common}><path d="M12 22s8-7 8-12a8 8 0 0 0-16 0c0 5 8 12 8 12z"/><circle cx="12" cy="10" r="3"/></svg>;
    case "clock":    return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "info":     return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg>;
    case "globe":    return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case "settings": return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3 1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8 1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>;
    case "logout":   return <svg {...common}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>;
    case "send":     return <svg {...common}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>;
    case "trending-up": return <svg {...common}><path d="M22 7L13.5 15.5l-5-5L2 17"/><path d="M16 7h6v6"/></svg>;
    case "trending-down": return <svg {...common}><path d="M22 17L13.5 8.5l-5 5L2 7"/><path d="M16 17h6v-6"/></svg>;
    case "arrow-right": return <svg {...common}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case "filter":   return <svg {...common}><path d="M3 5h18l-7 9v6l-4-2v-4z"/></svg>;
    case "image":    return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></svg>;
    case "pdf":      return <svg viewBox="0 0 24 24" style={s} fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" opacity="0.85"/><text x="12" y="17.5" textAnchor="middle" fill="white" fontSize="6" fontWeight="800">PDF</text></svg>;
    case "sparkles": return <svg {...common}><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 14l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/></svg>;
    case "copy":     return <svg {...common}><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
    case "link":     return <svg {...common}><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>;
    default:         return <svg {...common}><circle cx="12" cy="12" r="9"/></svg>;
  }
}

function Avatar({ p, size = "md" }) {
  const cls = size === "sm" ? "th-avatar th-avatar-sm" : size === "lg" ? "th-avatar th-avatar-lg" : "th-avatar";
  return (
    <div className={cls} style={{ background: p.color }} title={p.name}>{p.initials}</div>
  );
}

function AvatarStack({ people, max = 5, size = "md" }) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <div className="th-avatar-stack">
      {shown.map(p => <Avatar key={p.id} p={p} size={size}/>)}
      {extra > 0 && (
        <div className={`th-avatar ${size === "sm" ? "th-avatar-sm" : size === "lg" ? "th-avatar-lg" : ""}`}
             style={{ background: "var(--th-surface-2)", color: "var(--th-fg-muted)", border: "1.5px solid var(--th-surface)" }}>
          +{extra}
        </div>
      )}
    </div>
  );
}

function Button({ variant = "default", size, icon, iconRight, children, onClick, type = "button", style, disabled }) {
  const cls = ["th-btn"];
  if (variant === "primary") cls.push("th-btn-primary");
  else if (variant === "outline") cls.push("th-btn-outline");
  else if (variant === "ghost") cls.push("th-btn-ghost");
  else cls.push("th-btn-outline");
  if (size === "sm") cls.push("th-btn-sm");
  return (
    <button type={type} className={cls.join(" ")} onClick={onClick} style={style} disabled={disabled}>
      {icon && <Icon name={icon} size={size === "sm" ? 14 : 16}/>}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "sm" ? 14 : 16}/>}
    </button>
  );
}

function IconButton({ icon, onClick, label, size = 18, badge }) {
  return (
    <button type="button" className={`th-btn-icon th-btn ${badge ? "th-dot" : ""}`} onClick={onClick} aria-label={label} title={label}>
      <Icon name={icon} size={size}/>
    </button>
  );
}

function Badge({ variant = "default", icon, children }) {
  const cls = ["th-badge"];
  if (variant !== "default") cls.push(`th-badge-${variant}`);
  return (
    <span className={cls.join(" ")}>
      {icon && <Icon name={icon} size={12}/>}
      {children}
    </span>
  );
}

function Card({ children, style, className = "" }) {
  return <div className={`th-card ${className}`} style={style}>{children}</div>;
}

function Modal({ open, onClose, title, subtitle, children, footer, size }) {
  if (!open) return null;
  return (
    <div className="th-modal-backdrop" onClick={onClose}>
      <div className={`th-modal ${size === "lg" ? "th-modal-lg" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="th-modal-header">
          <div style={{ flex: 1 }}>
            <div className="th-modal-title">{title}</div>
            {subtitle && <div className="th-modal-subtitle">{subtitle}</div>}
          </div>
          <button className="th-btn th-btn-ghost th-btn-icon" onClick={onClose} aria-label="Chiudi">
            <Icon name="x" size={16}/>
          </button>
        </div>
        <div className="th-modal-body">{children}</div>
        {footer && <div className="th-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

function Field({ label, help, children }) {
  return (
    <div className="th-field">
      {label && <label className="th-label">{label}</label>}
      {children}
      {help && <div className="th-help">{help}</div>}
    </div>
  );
}

function Tabs({ value, onChange, options }) {
  return (
    <div className="th-tabs">
      {options.map(o => (
        <button key={o.value}
          className={`th-tab ${value === o.value ? "active" : ""}`}
          onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}

function ToastStack({ toasts }) {
  return (
    <div className="th-toast-stack">
      {toasts.map(t => (
        <div key={t.id} className="th-toast">
          <Icon name="check" size={16} style={{ color: "#7BD89E" }}/>
          {t.text}
        </div>
      ))}
    </div>
  );
}

function fmtCurrency(n) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(n);
}

function fmtDateRange(start, end) {
  const s = new Date(start), e = new Date(end);
  const opts = { day: 'numeric', month: 'short' };
  const optsFull = { day: 'numeric', month: 'short', year: 'numeric' };
  if (s.getMonth() === e.getMonth()) {
    return `${s.toLocaleDateString('it-IT', { day: 'numeric' })}–${e.toLocaleDateString('it-IT', optsFull)}`;
  }
  return `${s.toLocaleDateString('it-IT', opts)} – ${e.toLocaleDateString('it-IT', optsFull)}`;
}

function daysUntil(date) {
  const today = new Date(); today.setHours(0,0,0,0);
  const target = new Date(date); target.setHours(0,0,0,0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

Object.assign(window, { Icon, Avatar, AvatarStack, Button, IconButton, Badge, Card, Modal, Field, Tabs, ToastStack, fmtCurrency, fmtDateRange, daysUntil });
