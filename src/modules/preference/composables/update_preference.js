import { http, httpServer } from "@/composables/http_service";
import { ref } from "vue"

export const updatePreference = (preference, id) => {
   const message = ref(null)
   const data = ref(null)
   const errorData = ref(null)
    const update = async () => {
        await httpServer().post(`/preferences/${id}`, preference)
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
        update,
        errorData,
        data,
        message
    }
}