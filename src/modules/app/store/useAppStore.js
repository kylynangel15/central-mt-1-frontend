import { getApps } from '../composables/get_apps';
import { defineStore } from 'pinia';
import { storeApp } from '../composables/store_apps';

export const useAppStore = defineStore('apps', {
    state: () => ({
        apps: [],
        pagination: {
            total: 0,
            totalPages: 0,
            hasLastPage: true,
            errorApi: false,
            loading: true,
        },
        reponseError: {
            errorData: null,
            errorMessage: null
        }
    }),
    actions: {
        async fetch(params) {
            this.pagination.loading = true
            const { load, data, hasError, totalPages, totalApps, hasLastPage } = getApps(params);
            await load();
            if(hasError.value) {
                this.pagination.errorApi = hasError.value;
                return;
            }
            this.apps = data.value
            this.pagination.totalPages = totalPages.value;
            this.pagination.total = totalApps.value;
            this.pagination.hasLastPage = hasLastPage.value;
            this.pagination.loading = false
        },
        update(app) {
            this.apps.map(oldApp => {
                if(app.id == oldApp.id) {
                    for(let key in app) {
                        oldApp[key] = app[key]
                    }
                }

                return oldApp
            })
        },
    }
});