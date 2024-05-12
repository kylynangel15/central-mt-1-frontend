<template>
    <TransitionRoot as="template" :show="open">
        <Dialog as="div" class="relative z-10" @close="handleClickCloseModal">
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
                            class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-2/4 xs:w-3/4 sm:max-w-7xl sm:p-6 xs:p-0">
                            <div>
                                <div class="mt-3 sm:mt-5">
                                    <div class="mt-2">
                                        <div v-if="isView">
                                            <h3 class="text-lg font-medium leading-6 text-gray-900">{{ tag.name}} details</h3>
                                            <p class="mt-1 text-sm text-gray-500"></p>
                                        </div>
                                        <div v-else>
                                            <h3 class="text-lg font-medium leading-6 text-gray-900">{{ tag && tag.id ? 'Update' : 'Create' }} Tag</h3>
                                            <p class="mt-1 text-sm text-gray-500"></p>
                                        </div>
                                        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                            <div class="sm:col-span-3">
                                                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                                                <div class="mt-1">
                                                    <input type="text" name="name" id="name" v-model="tag.name" :disabled="isView" autocomplete="given-name"
                                                        placeholder="Enter name"
                                                        class="block w-full appearance-none rounded-md border border-untitled-gray-300 px-3 py-2 placeholder-untitled-gray-400 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-untitled-gray-500 sm:text-sm" />
                                                </div>
                                                <ErrorSpanMessage v-if="errorValue && errorValue.name">
                                                    {{ errorValue.name[0] }}
                                                </ErrorSpanMessage>
                                            </div>
               
                                            <div class="sm:col-span-6">
                                                <div class="mt-1">
                                                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                                                    <div class="mt-1">
                                                        <textarea rows="4" name="description" id="description" :disabled="isView" v-model="tag.description"
                                                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-5 sm:mt-6" v-if="!isView">
                                <button type="button"
                                    class="flex w-24 float-right justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2"
                                    @click="handleClickSubmit">Submit</button>
                                
                                <button type="button"
                                    class="flex w-24 float-right justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-untitled-gray-700 shadow-lg mr-2 hover:bg-untitled-gray-100 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2"
                                    @click="handleClickCloseModal">Cancel</button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup>
import { 
    ref, 
    defineEmits, 
    computed, 
    defineProps, 
    onUpdated 
} from 'vue'

import { 
    Dialog, 
    DialogPanel, 
    DialogTitle, 
    TransitionChild, 
    TransitionRoot 
} from '@headlessui/vue'

import { CheckIcon } from '@heroicons/vue/24/outline'
import ErrorSpanMessage from '@/components/ErrorSpanMessage.vue';
import { storeTag } from '../../composables/store_tags'
import { updateTag } from '../../composables/update_tags'

const props = defineProps({
    openModal: {
        type: Boolean,
        default:false
    },
    selectedItem : {
        type: Object,
        default : null
    },
    isView: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits([
    'closeModal', 
    'storedItem', 
    'updatedItem'
])

const open = computed(() => props.openModal)
const selectedItem = computed(() => props.selectedItem)
const isView = computed(() => props.isView)

const tag = ref({})
const errorValue = ref(null);
const errorMessage = ref(null);

const handleClickCloseModal = () => {
    emit('closeModal');
}

const handleClickSubmit = async () => {

    if(tag.value.id) {
        const { update, data, errorData, message } = updateTag(tag.value);
        await update();
        if (!data.value) {
            errorValue.value = errorData.value;
            errorMessage.value = message.value
            return;
        }
        
        emit('updatedItem', data.value)
        return;
    }
    
    const { post, data, errorData, message} = storeTag(tag.value)
    await post();
    if(!data.value) {
        errorValue.value = errorData.value;
        errorMessage.value = message.value
        return;
    }

    emit('storedItem', data.value)
}

const initializeForm = () => {
    tag.value = {
        id: null,
        name: '',
        description: '',
    }

    errorValue.value = null
}

onUpdated(() => {
    if(selectedItem.value && selectedItem.value.id ) {
        tag.value = selectedItem.value
    }
    else {
        initializeForm();
    }
})
</script>