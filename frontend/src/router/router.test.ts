import {describe, expect, it} from 'vitest'
import router from './index'
import HomePage from '../pages/HomePage.vue'
import ContactPage from '../pages/ContactPage.vue'

describe('Router', () => {
    it('/ resolves to HomePage', async () => {
        await router.push('/')
        const component = router.currentRoute.value.matched[0].components?.default
        expect(component).toBe(HomePage)
    })

    it('/contact resolves to ContactPage', async () => {
        await router.push('/contact')
        const component = router.currentRoute.value.matched[0].components?.default
        expect(component).toBe(ContactPage)
    })
})
