import { defineStore } from "pinia";

export const useUserPrivilegesStore = defineStore('userPrivilegesStore', {
    state: () => ({
        privileges: [] 
    }),
    getters: {
        createUser() {
            
        }
    },
    actions: {
        setPrivileges(privileges) {
            this.privileges = privileges;
        },
        findPrivilege(privilege){
            let result = this.privileges.find(value => value == privilege)

            if(!result) {
                return false
            }

            return true
        }
    }
})