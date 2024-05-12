const Module = () => import('./ProductModule.vue')

const moduleRoute = {
    path: '/products',
    component: Module,
    children: [
        {
            path: '',
            name: 'Product Home Page',
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