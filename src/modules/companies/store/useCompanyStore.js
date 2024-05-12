import { defineStore } from "pinia";

export const useCompanyStore = defineStore('companyStore', {
    state: () => ({
        types: ['GROUP_COMPANY', 'SINGLE_ROOFTOP', 'SINGLE_USER'],
        status: ['ALL', 'ACTIVE', 'INACTIVE']
    })
})