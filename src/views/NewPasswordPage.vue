<template>
    <div class="flex h-screen page">
        <div class="flex bg-white flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div class="mx-auto w-full max-w-sm lg:w-96">
                <div v-if="isForgotTokenValid === true">
                    <KeyIcon class="mx-auto bg-indigo-200 p-2 text-gray-700 rounded-full h-16 w-16" />
                    <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Password Reset
                    </h2>
                    <p class="mt-2 text-center text-sm text-gray-600">
                        Your new password must be different to previous used password.
                    </p>
                </div>
                <div v-if="isForgotTokenValid === false">
                    <KeyIcon class="mx-auto bg-indigo-200 p-2 text-gray-700 rounded-full h-16 w-16" />
                    <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Password Reset
                    </h2>
                    <p class="mt-2 text-center text-sm text-gray-600">
                        The link you have entered has already been used for a password reset request. Please request a
                        new link or contact support for assistance.
                    </p>
                </div>             
                <div class="mt-8" v-if="isForgotTokenValid === true">

                    <div class="my-5 border-red-500 border px-3 py-2 bg-red-500 text-white" v-if="message">
                        {{ message }}
                    </div>

                    <div class="my-5 border-red-500 border px-3 py-2 bg-red-500 text-white"
                        v-if="errorValue && errorValue.email">
                        {{ errorValue.email[0] }}
                    </div>
                    <div class="mt-6">
                        <form class="space-y-6">
                            <div>
                                <label for="email" class="block text-sm font-medium text-untitled-gray-700">
                                    Password
                                </label>
                                <div class="mt-1 relative">
                                    <input id="password" name="password" placeholder="Enter your password"
                                        v-model="user.password" :type="!isViewPassword ? 'password' : 'text'" autocomplete="password"
                                        class="block w-full appearance-none rounded-md border border-untitled-gray-300 px-3 py-2 placeholder-untitled-gray-400 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-untitled-gray-500 sm:text-sm" />
                                    <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <component :is="viewPasswordIcon" @click="handleCLickViewPassword"
                                            class="h-5 w-5 text-untitled-gray-500 cursor-pointer" aria-hidden="true" />
                                    </div>
                                </div>

                                <SubLabelSpan>
                                    Must be at least 8 characters
                                </SubLabelSpan>
                                <ErrorSpanMessage v-if="errorValue && errorValue.password">
                                    {{ errorValue.password[0] }}
                                </ErrorSpanMessage>
                            </div>

                            <div>
                                <label for="email" class="block text-sm font-medium text-untitled-gray-700">
                                    Password Confirmation
                                </label>
                                <div class="mt-1">
                                    <input id="confirm_password" name="confirm_password"
                                        placeholder="Confirm your password" v-model="user.confirm_password"
                                        type="password" autocomplete="confirm_password"
                                        class="block w-full appearance-none rounded-md border border-untitled-gray-300 px-3 py-2 placeholder-untitled-gray-400 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-untitled-gray-500 sm:text-sm" />
                                </div>
                                <ErrorSpanMessage v-if="errorValue && errorValue.confirm_password">
                                    {{ errorValue.confirm_password[0] }}
                                </ErrorSpanMessage>
                            </div>

                            <div>
                                <button @click="handleClickResetPassword" type="button"
                                    class="flex w-full justify-center rounded-md border border-transparent bg-untitled-gray-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
                                    {{ loading ? 'loading...' : 'Reset Password' }}
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
import SubLabelSpan from '@/components/SubLabelSpan.vue';
import { userChangePassword, verifyForgotToken } from '@/composables/authentication';
import {
    ArrowLeftIcon,
    KeyIcon
} from '@heroicons/vue/24/outline';
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from "@websanova/vue-auth";
import { useStore } from 'vuex';
import { useUserStore } from "@/modules/companies/store/user/useUserStore";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import { useAdminSettingStore } from '@/store/useAdminSettingStore';
const router = useRouter();
const route = useRoute();
const store = useStore();

const adminStore = useAdminSettingStore();
const auth = useAuth();
const userStore = useUserStore();
const viewPasswordIcon = ref(EyeIcon);
const isViewPassword = ref(false)
const user = ref({
    id: null,
    email: null,
    password: null,
    confirm_password: null,
    forgot_token: null
})
const errorShow = ref(false)
const message = ref(null)
const errorValue = ref(null)
const loading = ref(false)
const isForgotTokenValid = ref(null);
const params = ref({
    id: route.query.id,
    forgot_token: route.query.forgot_token,
    email: route.query.email
});
onMounted( async () => {
    const {checkForgotToken, isTokenValid } = verifyForgotToken(params);
    await checkForgotToken();
    isForgotTokenValid.value = isTokenValid.value;
})

const handleClickResetPassword = async () => {
    loading.value = true

    user.value.email = route.query.email ? route.query.email : null
    user.value.id = route.query.id ? route.query.id : null
    user.value.forgot_token = route.query.forgot_token ? route.query.forgot_token : null

    const { changePassword, errorData, errorMessage, hasError, data } = userChangePassword(user.value);
    await changePassword();
    errorValue.value = errorData.value
    message.value = errorMessage.value
    loading.value = false
    if (hasError.value) {
        return
    }

    auth.user(data.value.user);
    auth.token(null, data.value.access_token, false);
    auth.remember(JSON.stringify(auth.user()));
    userStore.setUser(JSON.parse(auth.remember()))
    adminStore.setLoginUser(JSON.parse(auth.remember()))
    router.push("/");
}

const handleCLickViewPassword = () => {
    isViewPassword.value = !isViewPassword.value

    if (isViewPassword.value) {
        viewPasswordIcon.value = EyeSlashIcon
        return;
    }

    viewPasswordIcon.value = EyeIcon;
}

</script>
