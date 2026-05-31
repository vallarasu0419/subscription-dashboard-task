import { capitalize } from '../utils/format.js';

/** Maps a subscription status to a coloured pill. */
const BADGE_CLASS = {
  active: 'badge-active',
  expired: 'badge-expired',
  cancelled: 'badge-cancelled',
  none: 'badge-none',
};

const StatusBadge = ({ status }) => {
  const key = status || 'none';
  return (
    <span className={`badge ${BADGE_CLASS[key] || 'badge-none'}`}>
      {capitalize(key)}
    </span>
  );
};

export default StatusBadge;
