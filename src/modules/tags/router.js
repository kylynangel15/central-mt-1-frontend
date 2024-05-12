const Module = () => import('./TagModule.vue')

const moduleRoute = {
    path: '/tag-management',
    component: Module,
    children: [
        {
            path: '',
            name: 'Tags Home Page',
            component: () => import('./views/HomePage.vue')
        },
        {
            path: '/tag-management/create',
            name: 'Create Tag Page',
            component: () => import('./views/TagsFormPage.vue'),
            props: false
        },
        {
            path: '/tag-management/edit/:id',
            name: 'Edit Tag Page',
            component: () => import('./views/TagsFormPage.vue'),
            props: true
        },
        {
            path: '/tag-management/:id',
            name: 'View Tag Page',
            component: () => import('./views/ViewTagPage.vue'),
            props: true
        }
    ],
    meta: {
      auth: true,
    },
}

export default router => {
    router.addRoute('layout', moduleRoute);
}