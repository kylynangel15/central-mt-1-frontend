import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './modules'
import './assets/css/index.css'
import axios from 'axios'
import adminPlugins from './plugins/admin-plugins'
import i18n from './plugins/translation'
import CKEditor from '@ckeditor/ckeditor5-vue';
import { createPinia } from 'pinia';
import { createAuth } from '@websanova/vue-auth';
import driverAuthBearer from '@websanova/vue-auth/dist/drivers/auth/bearer.esm.js';
import driverHttpAxios from '@websanova/vue-auth/dist/drivers/http/axios.1.x.esm.js';
import driverRouterVueRouter from '@websanova/vue-auth/dist/drivers/router/vue-router.2.x.esm.js';
import mitt from 'mitt'
import infiniteScroll from 'vue3-infinite-scroll-better'
import UserPrivilegesPlugin from './plugins/user-privileges-plugins'
import companyPrivilegesPlugin from './plugins/company-privileges-plugin'
import storePrivilegesPlugin from './plugins/store-privileges-plugin'

const emitter = mitt();
var auth = createAuth({
    plugins: {
        http: axios,
        router: router
    },
    drivers: {
        http: driverHttpAxios,
        auth: driverAuthBearer,
        router: driverRouterVueRouter,
    },
    tokenStore: ['localStorage'],
    options: {
        fetchData: { enabled: false },
        rolesKey: 'type',
        notFoundRedirect: { name: 'user-account' },
    }
});

const pinia = createPinia()

const app = createApp(App);
app.use(auth);
app.use(pinia);
app.use(adminPlugins)
app.use(UserPrivilegesPlugin)
app.use(companyPrivilegesPlugin)
app.use(storePrivilegesPlugin)
app.use(i18n)
app.use(emitter)
app.use(CKEditor)
app.use(infiniteScroll)
app.use(store).use(router).mount('#app')
