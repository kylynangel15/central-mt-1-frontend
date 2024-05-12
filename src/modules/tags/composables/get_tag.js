import { http } from "@/composables/http_service";
import { ref } from "vue";

export const getTag = (id) => {
    const data = ref(null);

    const load = async () => {
        await http().get(`/tags/${id}`)
            .then(res => {
                data.value = res.data;
            }).catch(error => {
                switch (error.response.status) {
                    case 401:
                        alert(error.response.message)
                        break;
                
                    default:
                        alert(error)
                        break;
                }
            })
    }

    return {
        load, data
    }
}