<template>
    <div
        class=" top-0 left-0 right-0 bottom-0 w-full h-96 z-50 overflow-hidden flex flex-col items-center justify-center">
        <ExclamationCircleIcon class="mx-auto text-red-600 h-12 animate-bounce" />
        <p class="text-sm text-red-400">
            {{ errorMessage }}
        </p>
    </div>
</template>
<script setup>
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline';
import { defineProps, computed } from 'vue';

const props = defineProps({
    errorMessage: {
        type: String,
        default: 'Some Error occured, Please contact the administrator'
    }
})

const errorMessage = computed(() => props.errorMessage)

</script>