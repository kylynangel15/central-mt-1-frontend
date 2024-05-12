import { http } from "@/composables/http_service"
import { ref } from "vue"

export const deleteRole = (role) => {
    const data = ref(null)
    
    const post = async () => {
        await http().delete(`/roles/${role.id}`)
            .then(res => {
                data.value = res.data
            }).catch(error => {
                alert(error)
            })
    }

    return {
        post, data
    }
}