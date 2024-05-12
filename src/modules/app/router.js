const Module = () => import('./AppModule.vue')

const moduleRoute = {
    path: '/app-management',
    component: Module,
    children: [
        {
            path: '',
            name: 'App Home Page',
            component: () => import('./views/HomePage.vue'),
            meta: {
                title: 'Apps'
            }
        },
        {
            path: '/app-management/create',
            name: 'Create App Page',
            component: () => import('./views/AppFormPage.vue'),
            meta: {
                title: 'Create App'
            }
        },
        {
            path: '/app-management/edit/:id',
            name: 'Edit App Page',
            component: () => import('./views/AppFormPage.vue'),
            props: true,
            meta: {
                title: 'Edit App'
            }
        },
        {
            path: '/app-management/:id',
            name: 'View App Page',
            component: () => import('./views/ViewAppPage.vue'),
            props: true,
            meta: {
                title: 'View App'
            }
        },
        {
            path: '/app-management/:id/create',
            name: 'Create Feature Page',
            component: () => import('./views/feature/FeatureFormPage.vue'),
            props: true,
            meta: {
                title: 'Create Feature'
            }
        },
        {
            path: '/app-management/:id/edit/:featureId',
            name: 'Edit Feature Page',
            component: () => import('./views/feature/FeatureFormPage.vue'),
            props: true,
            meta: {
                title: 'Edit Feature'
            }
        },
        {
            path: '/app-management/:id/feature/:featureId',
            name: 'View Feature Page',
            component: () => import('./views/feature/ViewFeaturePage.vue'),
            props: true,
            meta: {
                title: 'View Feature'
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