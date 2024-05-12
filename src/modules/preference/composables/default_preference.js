import { http, httpServer } from "@/composables/http_service";
import { ref } from "vue"

export const getPreference = () => {
   const message = ref(null)
   const data = ref(null)
   const errorData = ref(null)
    const get = async () => {
        await httpServer().get('/preferences/default')
            .then(res => {
                message.value = null;
                errorData.value = null;
                data.value = res.data;
            }).catch(error => {
                switch (error.response.status) {
                    case 422:
                        errorData.value = error.response.data;
                        break;
                    
                    case 401:
                        message.value = error.response.message;
                        break;

                    default:
                        alert(error)
                        break;
                }
            })
    }

    return {
        get,
        errorData,
        data,
        message
    }
}