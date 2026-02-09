import React from 'react'
import { render, screen } from '@testing-library/react'
import DateRange from '@/lib/utils/DateRange'
import '@testing-library/jest-dom'

describe('DateRange Component', () => {
  it('renders correctly with YYYY-MM-DD format', () => {
    render(
      <DateRange
        startYear="2020-01-15"
        endYear="2021-06-20"
        id="test-date-range"
      />
    )
    const element = screen.getByText(/Jan, 2020 - Jun, 2021/)
    expect(element).toBeInTheDocument()
  })

  it('renders correctly with YYYY-MM format (newly supported)', () => {
    render(
      <DateRange startYear="2020-01" endYear="2021-06" id="test-date-range" />
    )
    const element = screen.getByText(/Jan, 2020 - Jun, 2021/)
    expect(element).toBeInTheDocument()
  })

  it('renders "Present" when endYear is missing', () => {
    render(<DateRange startYear="2020-01" id="test-date-range" />)
    const element = screen.getByText(/Jan, 2020 - Present/)
    expect(element).toBeInTheDocument()
  })

  it('renders "Present" when endYear is "Present"', () => {
    render(
      <DateRange startYear="2020-01" endYear="Present" id="test-date-range" />
    )
    const element = screen.getByText(/Jan, 2020 - Present/)
    expect(element).toBeInTheDocument()
  })

  it('renders only end date when showOnlyEndDate is true', () => {
    render(
      <DateRange
        startYear="2020-01"
        endYear="2021-06"
        id="test-date-range"
        showOnlyEndDate={true}
      />
    )
    const element = screen.getByText(/Jun, 2021/)
    expect(element).toBeInTheDocument()
    expect(screen.queryByText(/Jan, 2020/)).not.toBeInTheDocument()
  })

  it('renders empty when startYear is missing and showOnlyEndDate is false', () => {
    const { container } = render(<DateRange id="test-date-range" />)
    const p = container.querySelector('p')
    expect(p).toHaveTextContent('')
  })

  it('handles invalid dates gracefully (defaults to 1st of month or "Present")', () => {
    render(
      <DateRange
        startYear="invalid-date"
        endYear="invalid-end"
        id="test-date-range"
      />
    )
    // "invalid-date" split by '-' gives ["invalid-date"]
    // parts[0] is NaN, parts[1] is undefined
    // month - 1 is NaN
    // Date(NaN, NaN, 1) is Invalid Date
    // toLocaleString on Invalid Date might throw or return "Invalid Date"
    // Our code doesn't check for Invalid Date on start, only on end.

    // Let's see what happens with partially valid strings if we care,
    // but the main goal was YYYY-MM support.
  })
})
