import {createAuth}          from '@websanova/vue-auth/src/v3.js';
import driverAuthBearer      from '@websanova/vue-auth/src/drivers/auth/bearer.js';
import driverHttpAxios       from '@websanova/vue-auth/src/drivers/http/axios.1.x.js';
import driverRouterVueRouter from '@websanova/vue-auth/src/drivers/router/vue-router.2.x.js';

export default (app) => {

    app.use(createAuth({
        plugins: {
            http: app.axios,
            router: app.router,
        },
        drivers: {
            http: driverHttpAxios,
            auth: driverAuthBearer,
            router: driverRouterVueRouter,
        },
        options: {
            staySignedIn: false,
            rolesKey: 'type',
            tokenStore: ['localStorage', 'cookie'],
            loginData: {
                url: '/auth/login',
                method: 'POST',
                redirect: '/home',
                headerToken: 'Authorization',
                fetchUser: true,
                customToken: (response) => response.data.access_token,
            },
            fetchData: {
                url: '/api/auth/user',
                method: 'get',
                interval: 10,
                enabled: true,
            },
            logoutData: {
                url: '/api/auth/logout',
                method: 'POST',
                redirect: '/logout',
            },
            parseUserData(data) {
                

                return data;
            }
        },
    }));
}