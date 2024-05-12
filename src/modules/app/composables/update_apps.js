import { http, httpServer } from "@/composables/http_service"
import { ref } from "vue"

export const updateApp = (app, id) => {
    const data = ref(null)
    const errorData = ref(null)
    const message = ref(null)

    const update = async () => {
        await httpServer().post(`/apps/${id}`, app)
            .then(res => {
                data.value = res.data
                errorData.value = null;
                message.value = null
            }).catch(error => {
                switch (error.response.status) {
                    case 422:
                        errorData.value = error.response.data
                        break;
                    
                    case 401: 
                        message.value = error.response.message
                        break;

                    default:
                        alert(error)
                        break;
                }
            })
    }

    return {
        data,
        errorData,
        message,
        update
    }
}