const Module = () => import('./SupportModule.vue')

const moduleRoute = {
    path: '/support',
    component: Module,
    children: [
        {
            path: '',
            name: 'Support Home Page',
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