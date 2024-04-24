import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SignIn from '@/components/SignIn.vue'
import RegisterView from '@/views/RegisterView.vue'
import RememberPasswordView from '@/views/RememberPasswordView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: SignIn
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: RegisterView
    },
    {
      path: '/rememberPassword',
      name: 'rememberPassword',
      component: RememberPasswordView
    }
  ]
})

export default router
