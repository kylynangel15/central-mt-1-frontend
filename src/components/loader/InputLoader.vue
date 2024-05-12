<template>
    <div class="p-2 w-full h-10 border-untitled-gray-500 text-sm text-untitled-gray-700">
        <span class="mx-auto">{{ message }}</span>
    </div>
</template>
<script setup>
import { computed, defineProps, ref } from 'vue';
const props = defineProps({
    message: {
        type: String,
        default: 'Loading... Please wait..'
    }
})

const message = computed(() => props.message)
</script>