import { http } from "@/composables/http_service"
import { ref } from "vue"

export const deleteFeature = (feature) => {
    const data = ref(null)
    
    const destroy = async () => {
        await http().delete(`/app-feature/${feature.id}`)
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