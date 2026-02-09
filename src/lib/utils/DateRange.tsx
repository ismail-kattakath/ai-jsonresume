const DateRange = ({ startYear, endYear, id, showOnlyEndDate = false }) => {
  // Helper function to parse date string and create Date object in local time
  const parseDate = (dateString) => {
    if (!dateString) return null
    const parts = dateString.split('-').map(Number)
    const year = parts[0]
    const month = parts[1]
    const day = parts[2] || 1 // Default to 1st if day is missing
    return new Date(year, month - 1, day) // month is 0-indexed
  }

  // If showOnlyEndDate is true (for education), only show graduation date
  if (showOnlyEndDate && endYear) {
    const end = parseDate(endYear)
    if (end && end != 'Invalid Date') {
      return (
        <p id={id} className="content whitespace-nowrap">
          {end.toLocaleString('default', { month: 'short' })},{' '}
          {end.getFullYear()}
        </p>
      )
    }
    return <p id={id} className="content"></p>
  }

  // Original behavior for work experience (show date range)
  if (!startYear) {
    return <p id={id} className="content"></p>
  }

  const start = parseDate(startYear)
  const end = parseDate(endYear)
  return (
    <p id={id} className="content whitespace-nowrap">
      {start.toLocaleString('default', { month: 'short' })},{' '}
      {start.getFullYear()} -{' '}
      {end && end != 'Invalid Date'
        ? end.toLocaleString('default', { month: 'short' }) +
          ', ' +
          end.getFullYear()
        : 'Present'}
    </p>
  )
}

export default DateRange
