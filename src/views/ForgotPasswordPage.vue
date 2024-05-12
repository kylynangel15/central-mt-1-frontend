<template>
    <div class="flex page h-screen">
        <div class="flex bg-white flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div class="mx-auto w-full max-w-sm lg:w-96">
                <div>
                    <KeyIcon class="mx-auto bg-indigo-200 p-2 text-gray-700 rounded-full h-16 w-16"/>
                    <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Forgot Password
                    </h2>
                    <p class="mt-2 text-center text-sm text-gray-600">
                        No worries, we'll send you reset instruction.
                    </p>
                </div>

                <div class="mt-8">
                    <div class="my-5 border-red-500 border px-3 py-2 bg-red-500 text-white" v-if="errorShow">
                        {{ errorMessage }}
                    </div>
                    <div class="mt-6">
                        <form class="space-y-6">
                            <div>
                                <label for="email" class="block text-sm font-medium text-untitled-gray-700">Email
                                    address</label>
                                <div class="mt-1">
                                    <input id="email" name="email" placeholder="Enter your email address" v-model="user.email" type="email"
                                        autocomplete="email"
                                        class="block w-full appearance-none rounded-md border border-untitled-gray-300 px-3 py-2 placeholder-untitled-gray-400 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-untitled-gray-500 sm:text-sm" />
                                </div>
                                <ErrorSpanMessage v-if="errorValue && errorValue.email">
                                    {{ errorValue.email[0] }}
                                </ErrorSpanMessage>
                            </div>
                            

                            <div>
                                <button @click="handleClickResetPassword" type="button"
                                    class="flex w-full justify-center rounded-md border border-transparent bg-untitled-gray-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
                                    {{ loading ? 'Checking...' : 'Reset Password'}}
                                </button>
                            </div>
                        </form>
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
            <!-- <img
        class="absolute inset-0 h-full w-full object-cover"
        src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
        alt=""
      /> -->
        </div>
    </div>
</template>

<script setup>
import ErrorSpanMessage from '@/components/ErrorSpanMessage.vue';
import { sendEmailVerificationCode } from '@/composables/authentication';
import {
  ArrowLeftIcon,
  KeyIcon
} from '@heroicons/vue/24/outline';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const user = ref({
    email: null
})
const errorShow = ref(false)
const errorMessage = ref(null)
const errorValue = ref(null)
const loading = ref(false)

const handleClickResetPassword = async () => {
    loading.value = true
    const { data, checkEmail, message, hasErrorMessage, errorData } = sendEmailVerificationCode( user.value);
    await checkEmail();
    errorMessage.value = message.value
    errorShow.value = hasErrorMessage.value
    errorValue.value = errorData.value
    loading.value = false
    if(!data.value) {
        return
    }

    router.push({name: 'Check Email', query: {email: data.value.email}})
}

</script>
