import {describe, expect, it} from 'vitest'
import {formatDate} from './formatDate'

describe('formatDate', () => {
  it('returns "Present" when date is null', () => {
    expect(formatDate(null)).toBe('Present')
  })

  it('formats a date string to short month + year', () => {
    expect(formatDate('2023-06')).toBe('Jun 2023')
  })

  it('formats January correctly', () => {
    expect(formatDate('2020-01')).toBe('Jan 2020')
  })

  it('formats December correctly', () => {
    expect(formatDate('2019-12')).toBe('Dec 2019')
  })
})
