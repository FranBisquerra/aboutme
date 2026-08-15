import {describe, expect, it} from 'vitest'
import {byStartDesc} from './byStartDesc'

describe('byStartDesc', () => {
  it('orders YYYY-MM entries most recent first', () => {
    const sorted = byStartDesc([
      {start: '2019-10'},
      {start: '2022-03'},
      {start: '2020-06'},
    ])

    expect(sorted.map(e => e.start)).toEqual(['2022-03', '2020-06', '2019-10'])
  })

  it('orders YYYY entries most recent first', () => {
    const sorted = byStartDesc([{start: '2012'}, {start: '2021'}, {start: '2018'}])

    expect(sorted.map(e => e.start)).toEqual(['2021', '2018', '2012'])
  })

  it('sorts by month when the year is the same', () => {
    const sorted = byStartDesc([{start: '2020-02'}, {start: '2020-11'}])

    expect(sorted.map(e => e.start)).toEqual(['2020-11', '2020-02'])
  })

  it('does not mutate the source array', () => {
    const source = [{start: '2019'}, {start: '2021'}]

    byStartDesc(source)

    expect(source.map(e => e.start)).toEqual(['2019', '2021'])
  })

  it('returns an empty array unchanged', () => {
    expect(byStartDesc([])).toEqual([])
  })
})
