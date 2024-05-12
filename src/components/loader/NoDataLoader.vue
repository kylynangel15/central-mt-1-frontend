<template>
    <div
        class=" top-0 left-0 right-0 bottom-0 w-full h-96 z-50 overflow-hidden flex flex-col items-center justify-center">
        <EnvelopeOpenIcon class="mx-auto text-untitled-gray-500 h-12" />
        <p class="text-sm text-untitled-gray-400">
            {{ noDataMessage }}
        </p>
    </div>
</template>
<script setup>
import { EnvelopeOpenIcon } from '@heroicons/vue/24/outline';
import { defineProps, computed } from 'vue';

const props = defineProps({
    noDataMessage: {
        type: String,
        default: 'No data'
    }
})

const noDataMessage = computed(() => props.noDataMessage)

</script>