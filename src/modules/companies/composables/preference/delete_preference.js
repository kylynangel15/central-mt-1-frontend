import { http } from "@/composables/http_service"

export const deletePreference = (id) => {
    const trash = async () => {
        await http().delete(`/preferences/${id}`)
            .then(res => {

            }).catch(error => {
                alert(error)
            })
    }
    return {
        trash
    }
}