import { http } from "@/composables/http_service"

export const removeFromTag = (params) => {
    const remove = async () => {
        await http().delete('/tags/modules/detach', { params })
            .then((res) => {

            }).catch(error => {
                alert(error)
            })
    }

    return {
        remove
    }
}