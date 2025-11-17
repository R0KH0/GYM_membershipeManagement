const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-status-active text-white",
    orange: "bg-status-orange text-white",
    frozen: "bg-status-frozen text-white",
    pending: "bg-status-pending text-white",
    cancelled: "bg-status-cancelled text-white",
  };

  return (
    <span
      className={`px-4 py-1.5 rounded-full text-sm font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
