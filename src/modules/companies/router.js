import { createUserAccess } from './composables/user/user_settings';

const Module = () => import('./CompaniesModule.vue')

const moduleRoute = {
    path: '/companies',
    component: Module,
    children: [
        {
            path: '',
            name: 'Company Home Page',
            component: () => import('./views/HomePage.vue'),
            meta: {
                title: 'Companies'
            }
        },
        {
            path: '/companies/create',
            name: 'Create Company Page',
            component: () => import('./views/CreateCompanyPage.vue'),
            meta: {
                title: 'Create Company'
            }
        },
        {
            path: '/companies/:id',
            name: 'Company Details Page',
            component: () => import('./views/CompanyDetailsPage.vue'),
            props: true,
            meta: {
                title: 'Company Details'
            }
        },
        {
            path: '/companies/:id/create-user',
            name: 'Create Company User Page',
            component: () => import('./components/User/UserForm.vue'),
            props: true,
            beforeEnter: (to, from, next) => {
                if(createUserAccess()) {
                    next();
                    return
                }

                next(from);
            }
        },
        {
            path: '/companies/:id/edit-user/:userId',
            name: 'Edit Company User Page',
            component: () => import('./components/User/UserForm.vue'),
            props: true,
            beforeEnter: (to, from, next) => {
                if(createUserAccess()) {
                    next();
                    return
                }

                next(from);
            }
        },
        {
            path: '/companies/:id/view-user/:userId',
            name: 'View Company User Page',
            component: () => import('./components/User/UserDetails.vue'),
            props: true,
            meta: {
                title: 'View User'
            }
        },
        {
            path: '/companies/:id/create-store',
            name: 'Create Company Store Page',
            component: () => import('./components/store/StoreForm.vue'),
            props: true,
            meta: {
                title: 'Create Store'
            }
        },
        {
            path: '/companies/:id/edit-store/:storeId',
            name: 'Edit Company Store Page',
            component: () => import('./components/store/StoreForm.vue'),
            props: true,
            meta: {
                title: 'Edit Store'
            }
        },
        {
            path: '/companies/:id/store/:storeId',
            name: 'View Company Store Page',
            component: () => import('./components/store/ViewStore.vue'),
            props: true,
            meta: {
                title: 'View Store'
            }
        },
    ],
    meta: {
      auth: true,
    },
}

export default router => {
    router.addRoute('layout', moduleRoute);
}