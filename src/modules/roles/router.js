const Module = () => import('./RoleModule.vue')

const moduleRoute = {
    path: '/roles-privileges',
    component: Module,
    children: [
        {
            path: '',
            name: 'Roles Home Page',
            component: () => import('./views/HomePage.vue'),
            meta: {
                title: 'Roles'
            }
        },
        {
            path: '/roles-privileges/role/create',
            name: 'Create Role Page',
            component: () => import('./views/RoleFormPage.vue'),
            props: true,
            meta: {
                title: 'Create Role'
            }
        },
        {
            path: '/roles-privileges/role/edit/:id',
            name: 'Edit Role Page',
            component: () => import('./views/RoleFormPage.vue'),
            props: true,
            meta: {
                title: 'Edit Role'
            }
        },
        {
            path: '/roles-privileges/role/:id',
            name: 'View Role Page',
            component: () => import('./views/ViewRolePage.vue'),
            props: true,
            meta: {
                title: 'View Role'
            }
        },
        {
            path: '/roles-privileges/privilege/create',
            name: 'Create Privilege Page',
            component: () => import('./views/privilege/PrivilegeFormPage.vue'),
            meta: {
                title: 'Create Privilege'
            }
        },
        {
            path: '/roles-privileges/privilege/edit/:id',
            name: 'Edit Privilege Page',
            component: () => import('./views/privilege/PrivilegeFormPage.vue'),
            props: true,
            meta: {
                title: 'Edit Privilege'
            }
        },
        {
            path: '/roles-privileges/privilege/:id',
            name: 'View Privilege Page',
            component: () => import('./views/privilege/ViewPrivilegePage.vue'),
            props: true,
            meta: {
                title: 'View Privilege'
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