import axios from 'axios'
import { isEmpty as _isEmpty } from 'lodash-es';
import { accessToken } from '@/composables/local_storage';

export default {
    createAxiosInstance() { 

        let configs = {
            baseURL: process.env.VUE_APP_BASE_URL,
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            withCredentials: true,
        };

        if (!_isEmpty(accessToken())) {
            configs = Object.assign(configs, { 
                Authorization: `Bearer ${accessToken()}`,
            })
        }

        return axios.create(configs)
    },
}