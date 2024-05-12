import { defineStore } from "pinia";

export const useUserStatusStore = defineStore('userStatus', {
    state: () => ({
        status: [ 'ACTIVE', 'UNDER_REVIEW', 'REJECTED', 'INACTIVE']
    }),
    actions: {
        getStatusByID(id) {
            return this.status.find(stats => stats.id == id)
        }
    }
});