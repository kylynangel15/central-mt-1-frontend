import { http } from "@/composables/http_service"
import { ref } from "vue"

export const deletePrivilege = (privilege) => {
    const data = ref(null)
    
    const destroy = async () => {
        await http().delete(`/privileges/${privilege.id}`)
            .then(res => {
                data.value = res.data
            }).catch(error => {
                alert(error)
            })
    }

    return {
        destroy, data
    }
}