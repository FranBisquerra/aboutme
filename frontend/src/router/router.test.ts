import {describe, expect, it} from 'vitest'
import router from './index'
import HomePage from '../pages/HomePage.vue'
import ContactPage from '../pages/ContactPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import AdminPage from '../pages/AdminPage.vue'

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

    it('/login resolves to LoginPage', async () => {
        await router.push('/login')
        const component = router.currentRoute.value.matched[0].components?.default
        expect(component).toBe(LoginPage)
    })

    it('/admin resolves to AdminPage', async () => {
        await router.push('/admin')
        const component = router.currentRoute.value.matched[0].components?.default
        expect(component).toBe(AdminPage)
    })
})
