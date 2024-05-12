const Module = () => import('./SettingModule.vue')

const moduleRoute = {
    path: '/settings',
    component: Module,
    children: [
        {
            path: '',
            name: 'Setting Home Page',
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