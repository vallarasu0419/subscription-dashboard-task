/**
 * Reusable button supporting variants, sizes, full-width and a loading state.
 * Variants map to classes defined in App.css.
 */
const VARIANT_CLASS = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  block = false,
  loading = false,
  disabled = false,
  type = 'button',
  children,
  className = '',
  ...rest
}) => {
  const classes = [
    'btn',
    VARIANT_CLASS[variant] || VARIANT_CLASS.primary,
    size === 'sm' ? 'btn-sm' : '',
    block ? 'btn-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading && <span className="spinner" style={{ width: 16, height: 16 }} />}
      {children}
    </button>
  );
};

export default Button;
