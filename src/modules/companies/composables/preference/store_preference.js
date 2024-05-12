import { http, httpServer } from "@/composables/http_service";
import { ref } from "vue"

export const storePreference = (preference) => {
   const message = ref(null)
   const data = ref(null)
   const errorData = ref(null)
    const post = async () => {
        await httpServer().post('/preferences', preference)
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
        post,
        errorData,
        data,
        message
    }
}