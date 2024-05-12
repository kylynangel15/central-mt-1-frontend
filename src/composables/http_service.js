import axios from 'axios'
import { accessToken } from './local_storage'


export function http() {
    return axios.create({
        baseURL: '/api/admin',
        headers: {
            Authorization: 'Bearer ' + accessToken()
        }
    })
}

export function httpServer() {
    return axios.create({
        baseURL: '/api/admin',
        headers: {
            Authorization: 'Bearer '+ accessToken(),
            'Content-Type': 'multipart/form-data'
        },
    })
}