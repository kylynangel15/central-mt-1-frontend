const Module = () => import('./UserModule.vue')

const moduleRoute = {
    path: '/users',
    component: Module,
    children: [
        {
            path: '',
            name: 'User Home Page',
            component: () => import('./views/HomePage.vue'),
            meta: {
                title: 'Users'
            }
        },
        {
            path: '/users/create',
            name: 'User Create Page',
            component: () => import('./views/UserFormPage.vue'),
            meta: {
                title: 'Create User'
            }
        },
        {
            path: '/users/edit/:id',
            name: 'User Edit Page',
            component: () => import('./views/UserFormPage.vue'),
            props: true,
            meta: {
                title: 'Edit User'
            }
        },
        {
            path: '/users/:id',
            name: 'User View Page',
            component: () => import('./views/UserViewPage.vue'),
            props: true,
            meta: {
                title: 'View User'
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