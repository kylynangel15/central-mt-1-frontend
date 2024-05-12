import { http } from "@/composables/http_service"
import { ref } from "vue"

export const addCompany = (app) => {
    const data = ref(null)

    const update = async () => {
        await http().put(`/apps/${app.id}`, app)
            .then(res => {
                data.value = res.data
            }).catch(error => {
                alert(error)
            })
    } 

    return {
        data,
        update
    }
}