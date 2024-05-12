<template>
    <div class="flex h-screen page">
        <div class="flex bg-white flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div class="mx-auto w-full max-w-sm lg:w-96">
                <div>
                    <CheckCircleIcon class="mx-auto bg-indigo-200 p-2 text-gray-700 rounded-full h-16 w-16" />
                    <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Password Reset
                    </h2>
                    <p class="mt-2 text-center text-sm text-gray-600">
                        Your new password has been successfully reset.
                    </p>
                </div>

                <div class="mt-8">
                    <div class="mt-6">
                        <form class="space-y-6">
                            <div>
                                <router-link to="/login" type="button"
                                    class="flex w-full justify-center rounded-md border border-transparent bg-untitled-gray-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
                                    Back to Login
                                </router-link>
                            </div>
                        </form>
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
import {
    ArrowLeftIcon,
    CheckCircleIcon
} from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleClickResetPassword = async () => {
    

    router.push({ name: 'Login' })
}

</script>
