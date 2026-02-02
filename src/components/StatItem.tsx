export interface StatItemProps {
  /**
   * The statistic value to display (e.g., "600+", "5K+")
   */
  value: string;
  /**
   * Label describing the statistic (e.g., "Contributors", "Pull Requests")
   */
  label: string;
  /**
   * Font family for the label text
   */
  monoFontFamily?: string;
  /**
   * Custom class for the value text
   */
  valueClassName?: string;
  /**
   * Custom class for the label text
   */
  labelClassName?: string;
}

/**
 * StatItem - Displays a single statistic with value and label
 *
 * Features:
 * - Bold value display
 * - Smaller monospace label
 * - Customizable styling
 */
export const StatItem: React.FC<StatItemProps> = ({
  value,
  label,
  monoFontFamily = "monospace",
  valueClassName = "text-2xl font-bold text-white",
  labelClassName = "text-xs text-slate-500 mt-1",
}) => (
  <div className="text-center">
    <div className={valueClassName}>{value}</div>
    <div className={labelClassName} style={{ fontFamily: monoFontFamily }}>
      {label}
    </div>
  </div>
);

export default StatItem;
