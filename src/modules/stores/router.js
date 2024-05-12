const Module = () => import('./StoreModule.vue')

const moduleRoute = {
    path: '/stores',
    component: Module,
    children: [
        {
            path: '',
            name: 'Store Home Page',
            component: () => import('./views/HomePage.vue'),
            meta: {
                title: 'Stores'
            }
        },
        {
            path: '/stores/create',
            name: 'Store Create Page',
            component: () => import('./views/StoreFormPage.vue'),
            meta: {
                title: 'Create Store'
            }
        },
        {
            path: '/stores/edit/:id',
            name: 'Store Edit Page',
            component: () => import('./views/StoreFormPage.vue'),
            props: true,
            meta: {
                title: 'Edit Store'
            }
        },
        {
            path: '/stores/:id',
            name: 'Store View Page',
            component: () => import('./views/StoreViewPage.vue'),
            props: true,
            meta: {
                title: 'View Store'
            }
        }
    ],
    meta: {
      auth: true,
    },
}

export default router => {
    router.addRoute('layout', moduleRoute);
}