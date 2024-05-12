import { ref } from "vue"
import { useRouter } from "vue-router";
import { http } from "./http_service";

export const loginUser  = (user) => {
    const data = ref(null)
    const errorData = ref(null)
    const message = ref(null);
    const hasErrorMessage = ref(false);

    const login = async () => {
        await http().post('/auth/login', user)
            .then(res => {
                data.value = res.data;
                errorData.value = null
                message.value = null
            }).catch(error => {
                switch (error.response.status) {
                    case 422:
                        errorData.value = error.response.data
                        break;

                    case 401:
                        hasErrorMessage.value = true;
                        message.value = error.response.data.message
                        break;
                
                    default:
                        alert(error);
                        break;
                }
            })
    }

    return {
        login, data, errorData, message, hasErrorMessage
    }
}

export const logoutUser = async () => {
    const router = useRouter();
    await http().get('/auth/logout').then( () => {
        localStorage.removeItem('auth_token_default')
    })
}


export const getUserProfile = () => {
    const data = ref(null);
    const loadUser = async () => {
        await http().get('/auth/user')
            .then(res => {
                data.value = res.data
            }).catch(error => {
                localStorage.removeItem('auth_token_default')
                localStorage.removeItem('auth_remember')
            })
    }

    return {
        data, loadUser
    }
}

export const sendEmailVerificationCode = (user) => {
    const data = ref(null);
    const errorData = ref(null);
    const message = ref(null);
    const hasErrorMessage = ref(false);

    const checkEmail = async () => {
        await http().post('/auth/send-email-verification-code', user)
        .then(res => {
            data.value = res.data
        }).catch(error => {
            data.value = null
            switch (error.response.status) {
                case 404:
                    message.value = 'These credentials do not match our records.'
                    hasErrorMessage.value = true;
                    break;

                case 422:
                    errorData.value = error.response.data
                    break;

                default:
                    
                    break;
            }
        })
    }

    return {
        data, checkEmail, message, hasErrorMessage, errorData
    }
} 

export const checkVerificationCode = (params) => {

    const errorData = ref(null)

    const checkCode = async () => {
        await http().post('/auth/verification-code', params)
            .then(() => {
                errorData.value = null
            }).catch(error => {
                switch (error.response.status) {
                    case 422:
                        errorData.value = error.response.data.errors
                        break;
                
                    default:
                        alert('Please contact the administrator')
                        break;
                }
            })
    }

    return { checkCode, errorData }
}

export const userChangePassword = (params) => {
    const errorData = ref(null)
    const errorMessage = ref(null)
    const hasError = ref(false)
    const data = ref(null)

    const changePassword = async () => {
        await http().post('/auth/change-password', params)
            .then(res => {
                errorData.value = null
                errorMessage.value = null
                hasError.value = false
                data.value = res.data
            }).catch(error => {
                hasError.value = true
                switch (error.response.status) {
                    case 422:
                        errorData.value = error.response.data
                        break;

                    case 404:
                        errorMessage.value = 'These credentials do not match our records.'
                        break;
                
                    default:
                        alert('Please contact the administrator')
                        break;
                }
            })
    }

    return {
        errorData, changePassword, errorMessage, hasError, data
    }
}

export const userSignUp = (user) => {
    const data = ref(null)
    const errorData = ref(null)
    const message = ref(null)

    const signup = async () => {
        await http().post('/auth/sign-up', user)
            .then(res => {
                data.value = res.data
                errorData.value = null
                message.value = null
            }).catch(error => {
                switch (error.response.status) {
                    case 422:
                        errorData.value = error.response.data
                        break;
                
                    default:
                        message.value = 'Please contact the administrator'
                        break;
                }
            })
    }

    return {
        signup, data, errorData, message
    }
}

export const companySignUp = (user) => {
    const data = ref(null)
    const errorData = ref(null)
    const message = ref(null)

    const signup = async () => {
        await http().post('/auth/company-sign-up', user)
            .then(res => {
                data.value = res.data
                errorData.value = null
                message.value = null
            }).catch(error => {
                switch (error.response.status) {
                    case 422:
                        errorData.value = error.response.data
                        break;
                
                    default:
                        message.value = 'Please contact the administrator'
                        break;
                }
            })
    }

    return {
        signup, data, errorData, message
    }
}

export const verifyForgotToken = (params) => {
    const isTokenValid = ref(null)

    const checkForgotToken = async () => {
        await http().post('/auth/validate-forgot-token', params.value)
            .then(() => {
                isTokenValid.value = true
            }).catch(error => {
                switch (error.response.status) { 
                    case 404:
                        isTokenValid.value = false;
                        break;               
                    default:
                        alert('Please contact the administrator')
                        break;
                }
            })
    }

    return { checkForgotToken, isTokenValid }
}