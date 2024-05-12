import { defineStore } from "pinia";

const ADMINISTRATOR = 'super-admin'

export const useAdminSettingStore = defineStore('settingStore', {
    state: () => ({
        loggedInUser: {}
    }),
    getters: {
        isAdministrator(state) {

            if(!state.loggedInUser) {
                return false
            }

            if(!state.loggedInUser.roles) {
                return false
            }

            let role = state.loggedInUser.roles.find(role => role.name === ADMINISTRATOR)

            if(!role) {
                return false
            }

            return true
        }
    },
    actions: {
        setLoginUser (user) {
            this.loggedInUser = user
        }
    }
})