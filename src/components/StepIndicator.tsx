export function StepIndicator({
  titles,
  current,
}: {
  titles: readonly string[]
  current: number
}) {
  return (
    <nav aria-label="Application progress">
      <p className="text-sm text-gray-600">
        Step {current + 1} of {titles.length}
      </p>
      <ol className="mt-2 flex flex-wrap gap-2 text-xs">
        {titles.map((title, index) => (
          <li
            key={title}
            aria-current={index === current ? 'step' : undefined}
            className={
              index === current
                ? 'rounded bg-blue-700 px-2 py-1 text-white'
                : 'rounded border border-gray-300 px-2 py-1'
            }
          >
            {index + 1}. {title}
          </li>
        ))}
      </ol>
    </nav>
  )
}
