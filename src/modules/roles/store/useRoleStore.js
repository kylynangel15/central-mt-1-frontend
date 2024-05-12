import { getRoles } from '../composables/get_roles';
import { defineStore } from 'pinia';
import { storeRole } from '../composables/store_role';

export const useRoleStore = defineStore('role', {
    state: () => ({
        types: ['ALL', 'DEFAULT', 'GLOBAL', 'NONE'],
        roles: [],
        pagination: {
            total: 0,
            totalPages: 0,
            hasLastPage: true,
            errorApi: false,
            loading: true,
        }
    }),
    actions: {
        async setRoles(roles) {
            this.roles = roles
        },
        update(role) {
            this.roles.map(oldRole => {
                if(role.id == oldRole.id) {
                    for(let key in role) {
                        oldRole[key] = role[key]
                    }
                }

                return oldRole
            })
        },
    }
});