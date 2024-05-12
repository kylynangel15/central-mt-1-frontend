import { http } from "@/composables/http_service"
import { ref } from "vue"

export const sendWelcomeEmail = (id) => {
    const data = ref(null)
    const send = async () => {
        await http().get(`/users/send-welcome-email/${id}`)
            .then(res => {
                data.value = res.data
            }).catch(error => {
                alert(error)
            })
    }

    return {
        send,
        data
    }
}