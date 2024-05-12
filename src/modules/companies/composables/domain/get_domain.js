import { http } from "@/composables/http_service"
import { ref } from "vue"

export const getDomain = (companyId) => {
    const data = ref(null)

    const load = async () => {
        await http().get(`/tenant/domain/${companyId}`)
            .then(res => {
                data.value = res.data
                console.log(res.data)
            }).catch(error => {
                alert(error)
            })
    }

    return {
        load,
        data
    }
}