import { CATEGORY_COLORS, CATEGORY_ICONS, prettyLabel } from '../constants.js'

// A small colored badge showing the expense category.
export default function CategoryBadge({ category }) {
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.OTHER
  const icon = CATEGORY_ICONS[category] || CATEGORY_ICONS.OTHER

  return (
    <span
      className="badge"
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}55` }}
    >
      <span>{icon}</span>
      {prettyLabel(category) || 'Other'}
    </span>
  )
}
