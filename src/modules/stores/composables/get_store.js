import { http } from "@/composables/http_service"
import { ref } from "vue"

export const getStore = (id) => {
    const data = ref(null)
    const hasError = ref(false)
    const message = ref(null)
    const load = async () => {
        await http().get(`/store/${id}`)
            .then(res => {
                data.value = res.data
            }).catch( error => {
                hasError.value = true
                message.value = error
            })
    }

    return {
        load, 
        data, 
        hasError,
        message
    }
}