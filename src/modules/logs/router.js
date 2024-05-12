const Module = () => import('./LogModule.vue')

const moduleRoute = {
    path: '/logs',
    component: Module,
    children: [
        {
            path: '',
            name: 'Logs Home Page',
            component: () => import('./views/HomePage.vue')
        }
    ],
    meta: {
      auth: true,
    },
}

export default router => {
    router.addRoute('layout', moduleRoute);
}