<template>
    <div class="flex page h-screen">
        <div class="flex bg-white flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div class="mx-auto w-full max-w-sm lg:w-96">
                <div>
                    <CheckCircleIcon class="mx-auto bg-green-200 p-2 text-gray-700 rounded-full h-16 w-16" />
                    <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Account Under Review
                    </h2>
                    <p class="mt-2 text-center text-sm text-gray-500">
                        We will send you an email of confirmation or you may contact our <span class="text-gray-900 cursor-pointer">Support Team</span>
                    </p>
                </div>

                <div class="mt-8">
                    <div class="mt-6">
                        <div class="text-center mt-4">
                            <div>
                                <button @click="handleClickLogin" type="button"
                                    class="flex w-full justify-center rounded-md border border-transparent bg-untitled-gray-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
                                    Complete
                                </button>
                            </div>
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
            <!-- <img
        class="absolute inset-0 h-full w-full object-cover"
        src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
        alt=""
      /> -->
        </div>
    </div>
</template>

<script setup>
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/vue/24/outline';



const handleClickLogin = () => {
    
}
</script>
