import type { ReactNode } from "react";
import type { User } from "../../domain/models/User";
import { UserGender } from "../../domain/models/enums/UserGender";

interface UserDetailsModalProps {
  user: User | null;
  onClose: () => void;
}

function formatAddress(user: User): string {
  const parts = [
    user.country,
    user.state,
    user.city,
    user.street,
    user.postalCode,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "—";
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  );
}

export function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  if (!user) return null;

  const fullName = [user.lastName, user.firstName, user.middleName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
        <div className="modal-header">
          {user.avatar ? (
            <img className="modal-avatar" src={user.avatar} alt={fullName} />
          ) : (
            <div className="modal-avatar modal-avatar--placeholder">?</div>
          )}
          <h2 className="modal-title">{fullName}</h2>
        </div>
        <div className="modal-body">
          <Row label="ФИО" value={fullName || "—"} />
          <Row label="Возраст" value={user.age} />
          <Row
            label="Пол"
            value={user.gender === UserGender.Male ? "Мужской" : "Женский"}
          />
          <Row label="Адрес" value={formatAddress(user)} />
          <Row label="Рост" value={user.height != null ? `${user.height} см` : "—"} />
          <Row label="Вес" value={user.weight != null ? `${user.weight} кг` : "—"} />
          <Row label="Телефон" value={user.phone} />
          <Row label="Email" value={user.email} />
        </div>
      </div>
    </div>
  );
}
