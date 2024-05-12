const Module = () => import('./DashboardModule.vue')

const moduleRoute = {
    path: '/',
    component: Module,
    children: [
        {
            path: '',
            name: 'Dashboard Home Page',
            component: () => import('./views/HomePage.vue'),
			meta: {
				title: 'Dashboard',
			},
        }
    ],
    meta: {
        auth: true
    }
}

export default router => {
    router.addRoute('layout', moduleRoute);
}