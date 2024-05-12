import { http } from "@/composables/http_service";
import { ref } from "vue"

export const updateCompany = (id,params) => {
    const message = ref('');
    const data = ref(null)
    const errorData = ref(null);

    const update = async () => {
        await http().put('/company/'+id,null, {params})
        .then(res => {
                
            errorData.value = null;
                message.value = null;
                data.value = res.data;

            }).catch(error => {
                switch (error.response.status) {
                    case 422:
                        message.value = '';
                        Object.keys(error.response.data).forEach(key => {
                            message.value += error.response.data[key] + '\n'
                          });
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