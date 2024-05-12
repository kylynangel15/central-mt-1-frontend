import { http } from "@/composables/http_service"
import { ref } from "vue"

export const deleteUser = (user) => {
    const data = ref(null)
    
    const trash = async () => {
        await http().delete(`/users/${user.id}`)
            .then(res => {
                data.value = res.data
            }).catch(error => {
                alert(error)
            })
    }

    return {
        trash, data
    }
}