import { http } from "@/composables/http_service";
import { ref } from "vue"

export const getCompaniesById = (params) => {

   const data = ref([]) 

    const load = async () => {
        await http().get(`/company/`+params).then((response) => {
            data.value      = response.data
        })
    }

    return {
        load,
        data
    }
} 