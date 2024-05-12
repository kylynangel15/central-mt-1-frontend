import { http } from "@/composables/http_service"

export const removeCompany = (params) => {
    const destroy = async () => {
        await http().delete(`/apps/modules/detach`, {params})
            .then(res => {

            }).catch(error => {
                alert(error)
            })
    }

    return {
        destroy
    }
}