<template>
    <TransitionRoot as="template" :show="open">
        <Dialog as="div" class="relative z-10">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel
                            class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div class="sm:flex sm:items-start">
                                <div
                                    class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
                                </div>
                                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <DialogTitle as="h3" class="text-lg leading-6 text-gray-900">
                                        {{ dialogTitle }}
                                    </DialogTitle>
                                    <div class="mt-2">
                                        <p class="text-sm text-gray-500">{{ message }} {{ params }} ?</p>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button type="button"
                                    class="flex w-24 ml-3 float-right justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2"
                                    @click="handleClickDelete">{{deleteLabel}}</button>
                                <button type="button"
                                    class="mt-3  inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                                    @click="handleCloseModal" ref="cancelButtonRef">Cancel</button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    openModal: {
        type: Boolean,
        default: false
    },
    selectedItem: null,
    message: {
        type: String,
        default: 'Are you sure you want to delete this '
    },
    params: {
        type: String,
        default: null
    },
    dialogTitle: {
        type: String,
        default: 'Delete Confirmation'
    },
    deleteLabel: {
        type: String,
        default: 'Delete'
    }
})

const emit = defineEmits(['closeModal', 'confirmed'])
const open = computed(() => props.openModal)
const selectedItem = computed(() => props.selectedItem)
const message = computed(() => props.message)
const params = computed(() => props.params)
const dialogTitle = computed(() => props.dialogTitle)
const deleteLabel = computed(() => props.deleteLabel)

const handleCloseModal = () => {
    emit('closeModal')
}

const handleClickDelete = () => {
    emit('confirmed', selectedItem.value)
}
</script>