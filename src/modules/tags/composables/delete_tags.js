import { http } from "@/composables/http_service"
import { ref } from "vue"

export const deleteTag = (tag) => {
    const data = ref(null)
    
    const destroy = async () => {
        await http().delete(`/tags/${tag.id}`)
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