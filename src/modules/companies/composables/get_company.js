import { http } from "@/composables/http_service";
import { ref } from "vue"

export const getCompanies = (params) => {

    const data = ref([])

    const currentPage = ref(0)

    const totalPages = ref(0)

    const hasMorePages = ref(true)

    const totalCompanies = ref(0)

    const hasError = ref(false)

    const errorObject = ref(null)

    const load = async () => {
        await http().get('/company',{params})
            .then((res) => {
                totalPages.value = res.data.last_page;
                data.value = res.data.data;
                totalCompanies.value = res.data.total;
                
                if(res.data && !res.data.next_page_url) {
                    hasMorePages.value = false
                }
            }).catch(error => {
                hasError.value = true
                errorObject.value = error
                hasMorePages.value = false
            })
    }

    return {
        load,
        totalPages,
        currentPage,
        data,
        hasMorePages,
        totalCompanies,
        hasError
    }
} 