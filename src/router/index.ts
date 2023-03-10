import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/home/HomePage.vue')
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/pages/home/HomePage.vue')
    },
    {
      path: '/convenios',
      name: 'Convênios',
      component: () => import('@/pages/convenios/ConveniosPage.vue')
    },
    {
      path: '/user',
      name: 'Area do Usuáro',
      component: () => import('@/pages/user/UserArea.vue')
    },
    {
      path: '/socios',
      name: 'Socios',
      component: () => import('@/pages/socios/SociosPage.vue')
    },
    {
      path: '/socios/:id',
      name: 'Sócio',
      component: () => import('@/pages/socios/SocioSelected.vue')
    },
    {
      path: '/socios/new',
      name: 'Novo Sócio',
      component: () => import('@/pages/socios/AdicionarSocio.vue')
    },
    {
      path: '/socios/Ghosts',
      name: 'Ghosts',
      component: () => import('@/pages/socios/GhostsPage.vue')
    },
    {
      path: '/sorteios',
      name: 'Sorteios',
      component: () => import('@/pages/sorteios/SorteiosPage.vue')
    },
    {
      path: '/sorteios/:id',
      name: 'Sorteio',
      component: () => import('@/pages/sorteios/SorteioSelected.vue')
    },
    {
      path: '/sorteios/new',
      name: 'Novo Sorteio',
      component: () => import('@/pages/sorteios/AdicionarSorteio.vue')
    },
    {
      path: '/cct',
      name: 'CCT',
      component: () => import('@/pages/cct/CCTPage.vue')
    },
    {
      path: '/cct/new',
      name: 'Adicionar CCT',
      component: () => import('@/pages/cct/AdicionarCCT.vue')
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/pages/admin/ListAdmins.vue')
    },
    {
      path: '/estatisticas',
      name: 'Estatísticas',
      component: () => import('@/pages/estatisticas/EstatisticasPage.vue')
    },
    {
      path: '/noticias',
      name: 'Notícias',
      component: () => import('@/pages/noticias/NoticiasPage.vue')
    },

  ]
})

export default router
