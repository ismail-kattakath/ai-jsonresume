import { pageview, event } from '../analytics'

describe('analytics', () => {
    beforeEach(() => {
        // @ts-ignore
        window.gtag = jest.fn()
        // Directly set the ID used by analytics.ts
        process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID'] = 'G-TEST'
    })

    it('should track page view', () => {
        // We need to re-import or reset to pick up env var if it's top-level
        jest.isolateModules(() => {
            const { pageview: pv, isAnalyticsEnabled } = require('../analytics')
            // Force isAnalyticsEnabled to true by ensuring window.gtag exists
            // window.gtag is already mocked in beforeEach
            pv('/test')
            expect(window.gtag).toHaveBeenCalledWith('config', 'G-TEST', {
                page_path: '/test'
            })
        })
    })

    it('should track event', () => {
        jest.isolateModules(() => {
            const { event: ev } = require('../analytics')
            ev('test_event', { category: 'cat' })
            expect(window.gtag).toHaveBeenCalledWith('event', 'test_event', {
                category: 'cat'
            })
        })
    })
})
