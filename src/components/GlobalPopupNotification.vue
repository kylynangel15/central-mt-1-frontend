<template>
    <!-- Global notification live region, render this permanently at the end of the document -->
    <div aria-live="assertive" class="mt-20 pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6">
        <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
            <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
            <transition enter-active-class="transform ease-out duration-300 transition"
                enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
                leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <div v-if="show"
                    class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <div class="p-4">
                        <div class="flex items-start">
                            <div class="flex-shrink-0" v-if="icon === 'Check'">
                                <CheckCircleIcon class="h-6 w-6 text-green-400" aria-hidden="true" />
                            </div>
                            <div class="flex-shrink-0" v-if="icon === 'Error'">
                                <ExclamationTriangleIcon class="h-6 w-6 text-green-400" aria-hidden="true" />
                            </div>
                            <div class="ml-3 w-0 flex-1 pt-0.5">
                                <p 
                                :class="[
												icon === 'Check'
													? 'text-gray-900'
													: 'text-red-400',
												'text-sm font-medium',
											]">
                                    {{ message }}
                                </p>
                                <p class="mt-1 text-sm text-gray-500">{{ subMessage }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, computed, onMounted } from 'vue'
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
    showNotification: {
        type: Boolean,
        default: false
    },
    message: {
        type: String,
        default: null
    },
    subMessage: {
        type: String,
        default: null
    },
    icon: {
        type: String,
        default: 'Check'
    },
})

const showNotification = computed(() => props.showNotification)

const show = ref(showNotification.value)
const message = computed(() => props.message)
const subMessage = computed(() => props.subMessage)

const handleCloseNotification = () => {
    setTimeout(() => {
        show.value = false
    }, 2000)
}

onMounted(() => {
    handleCloseNotification();
})
</script>