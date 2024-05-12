const Module = () => import('./PreferenceModel.vue')

const moduleRoute = {
    path: '/preference',
    component: Module,
    children: [
        {
            path: '',
            name: 'Preference Home Page',
            component: () => import('./views/HomePage.vue')
        },
    ],
    meta: {
      auth: true,
    },
}

export default router => {
    router.addRoute('layout', moduleRoute);
}