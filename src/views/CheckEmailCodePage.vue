<template>
    <div class="flex page h-screen">
        <div class="flex bg-white flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div class="mx-auto w-full max-w-sm lg:w-96">
                <div>
                    <EnvelopeIcon class="mx-auto bg-indigo-200 p-2 text-gray-700 rounded-full h-16 w-16"/>
                    <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Check your email
                    </h2>
                    <p class="mt-2 text-center text-sm text-gray-600">
                        We sent a password reset code to
                    </p>

                    <p class="mt-2 text-center text-sm text-gray-600">
                        {{ email }}
                    </p>
                </div>

                <div class="mt-8">
                    <div class="mt-6">
                        <div class="text-center mt-4">
                            <span class="mt-2 text-sm text-gray-600">
                                Don't receive the email?
                                <span @click="handleClickResend" class="font-bold text-xs cursor-pointer text-indigo-300">{{ loading ? 'Sending....' : 'Click to resend'}} {{ count == 0 ? '' : `after (${count} sec)`}}</span>
                            </span>
                        </div>
                        <div class="flex w-full mt-4">
                            <router-link to="/login" class="mt-2 mx-auto text-sm flex text-gray-600">
                                <ArrowLeftIcon class="mr-3 flex-shrink-0 h-6 w-6" />
                                Back to login
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="relative hidden w-0 flex-1 lg:block">
            <img
                class="absolute inset-0 h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
                alt=""
            />
        </div>
    </div>
</template>

<script setup>
import { checkVerificationCode, sendEmailVerificationCode } from '@/composables/authentication';
import {
    ArrowLeftIcon, EnvelopeIcon,
} from '@heroicons/vue/24/outline';
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const route = useRoute();
const router = useRouter();

const count = ref(60);

const user = ref({
    email: null
})
const loading = ref(false)
const errorShow = ref(false)
const errorMessage = ref(null)
const errorValue = ref(false)
const first = ref(null)
const second = ref(null)
const third = ref(null)
const fourth = ref(null)
const fifth = ref(null)
const sixth = ref(null)
const loadingContinue = ref(false)

const email = computed({
    get() {
        if(route.query.email) {
            user.value.email = route.query.email
            return route.query.email
        }

        return 'youremail@example.com'
    },
    set(newValue) {
        newValue
    }
})

const handleClickContinue = async () => {
    loadingContinue.value = true
    const params = {
        code: `${first.value}${second.value}${third.value}${fourth.value}${fifth.value}${sixth.value}`,
        email: user.value.email
    }

    const { errorData, checkCode} = checkVerificationCode(params);
    await checkCode();
    errorValue.value = errorData.value
    loadingContinue.value = false
    if(!errorValue.value) {
        let encryptedCode = encryptData(params.code)
        router.push({ name: 'New Password', query: { email: user.value.email, code: encryptedCode }})
    }
}

const handleClickResend = async () => {
    
    if(count.value != 0) return

    loading.value = true
    const { data, checkEmail, message, hasErrorMessage, errorData } = sendEmailVerificationCode(user.value);
    await checkEmail();
    errorMessage.value = message.value
    errorShow.value = hasErrorMessage.value
    errorValue.value = errorData.value
    loading.value = false
    count.value = 10
    setCountDown()
    if (!data.value) {
        return
    }
}

const setCountDown = () => {
    const timer = setTimeout(() => {
        count.value -= 1
        setCountDown()
    }, 1000)

    if (count.value == 0) {
        clearTimeout(timer)
    }
}

const isNumberKey = (evt) => {
    let charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}


onMounted(() => {
    setCountDown();

    if(!route.query.email)  {
        router.push('/login')
        return 
    }
})
</script>
