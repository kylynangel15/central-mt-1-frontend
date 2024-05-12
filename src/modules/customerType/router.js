const Module = () => import('./CustomerTypeModule.vue')

const moduleRoute = {
    path: '/customer-types',
    component: Module,
    children: [
        {
            path: '',
            name: 'Customer Type Home Page',
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