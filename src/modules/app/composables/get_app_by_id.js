import { http } from "@/composables/http_service";
import { ref } from "vue";

export const loadAppById = (id) => {
    
    const data = ref(null);
    
    const load = async () => {
        await http().get(`/apps/${id}`)
            .then(res => {
                data.value = res.data;
            }).catch(error => {
                alert(error)
            })
    }

    return {
        data, 
        load
    }
}