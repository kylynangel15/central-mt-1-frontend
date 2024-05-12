<template>
    <div class="w-full h-screen text-center">
        <img src="../../assets/404.png" class="mx-auto mt-20" alt="">
        <p class="text-untitled-gray-600 text-3xl font-bold mt-10">Oops!</p>
        <p class="text-untitled-gray-400 text-lg mt-5">Something went wrong</p>
        <p class="text-untitled-gray-400 text-sm mt-5">Don't worry, our team is here to help</p>
        <div class="w-96 items-center text-center mx-auto mt-5">
            <button type="button" class="inline-flex items-center rounded-md border border-transparent bg-untitled-gray-600 mr-2 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2" @click="handleClickDashboard">Back</button>
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const handleClickBack = () => {
    router.go(-1)
}

const handleClickDashboard = () => {
    router.push('/')       
}
</script>