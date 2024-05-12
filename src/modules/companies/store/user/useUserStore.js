import { defineStore } from "pinia";
import { getUsers } from "../../composables/user/get_users";

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [],
        pagination: {
            total: 0,
            totalPages: 0,
            hasLastPage: true,
            errorApi: false,
            loading: true,
        },
        user: {}
    }),
    getters: {
        
    },
    actions: {
        setUser(user) {
            this.user = user
        },
        setUsers(users) {
            this.users = users
        },
        create(user) {
            this.users.unshift(user)
        },
        delete(index) {
            this.users.splice(index, 1)
        },
        update(newUser) {
            this.users.map(user => {
                if(user.id == newUser.id) {
                    for(let key in newUser) {
                        user[key] = newUser[key]
                    }
                }

                return user;
            })
        }
    }
})