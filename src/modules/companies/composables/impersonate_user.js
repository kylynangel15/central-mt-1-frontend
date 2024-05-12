import { http } from "@/composables/http_service";
import { ref } from "vue"

export const impersonateUser = (companyCentralId) => {

    const redirectUrl = ref([])

    const impersonate = async () => {
        await http().post(`/impersonate/company/` + companyCentralId).then((response) => {
            redirectUrl.value = response.data.redirectUrl
            console.log(redirectUrl.value)
        })
    }

    return {
        impersonate,
        redirectUrl
    }
} 