<template>
    <div
        class=" top-0 left-0 right-0 bottom-0 w-full h-96 z-50 overflow-hidden flex flex-col items-center justify-center">
        <img class="mx-auto h-12 animate-bounce" :src="loadingImage"
            alt="RevDojo" />
        <p class="text-sm text-untitled-gray-400">
            {{ loadingMessage }}
        </p>
    </div>
</template>
<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
    loadingMessage: {
        type: String,
        default: 'Loading... Please wait'
    },
    loadingImage: {
        type: String,
        default: 'https://revdojo.com/wp-content/uploads/2022/04/logo.png'
    }
})

const loadingMessage = computed(() => props.loadingMessage)
const loadingImage = computed(() => props.loadingImage)
</script>