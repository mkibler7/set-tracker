type Props = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
};

export default function RetryButton({
  onClick,
  disabled,
  label = "Retry",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
    >
      {label}
    </button>
  );
}
