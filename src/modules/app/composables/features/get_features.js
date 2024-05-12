import { http } from "@/composables/http_service";
import { ref } from "vue";

export const getFeatures = (params) => {
    const data = ref([])

    const hasError = ref(false);

    const errorObject = ref(null)

    const totalFeatures = ref(0)

    const totalPages = ref(0)

    const hasLastPage = ref(true)

    const load = async () => {
        await http().get(`/app-feature`, {params})
            .then(res => {
                data.value = res.data.data;
                hasError.value = false
                totalFeatures.value = res.data.total
                totalPages.value = res.data.last_page
                if(res.data && !res.data.next_page_url) {
                    hasLastPage.value = false
                }
            }).catch(error => {
                hasError.value = true
                errorObject.value = error
                hasLastPage.value = false
            })
    }

    return {
        data, 
        hasError, 
        errorObject, 
        load,
        totalPages,
        totalFeatures,
        hasLastPage
    }
}