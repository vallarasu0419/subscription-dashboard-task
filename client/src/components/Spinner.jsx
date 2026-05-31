/** Inline spinner with an optional centered full-area wrapper. */
const Spinner = ({ center = false, label = 'Loading' }) => {
  const node = <span className="spinner" role="status" aria-label={label} />;
  if (!center) return node;
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        padding: 'var(--space-7)',
        minHeight: 200,
      }}
    >
      {node}
    </div>
  );
};

export default Spinner;
