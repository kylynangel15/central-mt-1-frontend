<template>
    <TransitionRoot as="template" :show="open">
        <Dialog 
            as="div" 
            class="relative z-10" 
            @close="handleClickCloseModal">
            <TransitionChild 
                as="template" 
                enter="ease-out duration-300" 
                enter-from="opacity-0" 
                enter-to="opacity-100"
                leave="ease-in duration-200" 
                leave-from="opacity-100" 
                leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>
            
            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild 
                        as="template" 
                        enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100" 
                        leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel
                            class="transform rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-5/12 xs:w-3/4  sm:max-w-7xl sm:p-6 xs:p-0">
                            <DialogTitle 
                                v-if="isView" 
                                as="h3" 
                                class="text-lg font-medium leading-6 text-gray-900">
                                <h3 class="text-lg font-medium leading-6 text-gray-900">{{
                                    user.friendly_name
                                    }} details</h3>
                                <p class="mt-1 text-sm text-gray-500"></p>
                            </DialogTitle>
                            <DialogTitle 
                                v-else 
                                as="h3" 
                                class="text-lg font-medium leading-6 text-gray-900">
                                <h3 class="text-lg font-medium leading-6 text-gray-900">
                                    {{ user && user.id ? 'Edit' : 'Create' }} User
                                </h3>
                                <p class="mt-1 text-sm text-gray-500"></p>
                            </DialogTitle>
                            <div class="mt-3 sm:mt-5">
                                <div class="mt-2">
                                    <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-1">
                                        <div class="sm:col-span-3">
                                            <label 
                                                for="name" 
                                                class="block text-sm font-medium text-gray-700">
                                                Name
                                            </label>
                                            <div class="mt-1">
                                                <input 
                                                    type="text" 
                                                    name="name" 
                                                    id="name" 
                                                    v-model="user.name"
                                                    :disabled="user.default || isView" 
                                                    autocomplete="given-name"
                                                    placeholder="Enter your full name"
                                                    class="block w-full appearance-none rounded-md border border-untitled-gray-300 px-3 py-2 placeholder-untitled-gray-400 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-untitled-gray-500 sm:text-sm" />
                                            </div>
                                            <ErrorSpanMessage 
                                                v-if="errorValue && errorValue.name">
                                                {{ errorValue.name[0] }}
                                            </ErrorSpanMessage>
                                        </div>
                                        <div class="sm:col-span-3">
                                            <label 
                                                for="name" 
                                                class="block text-sm font-medium text-gray-700">
                                                Email
                                            </label>
                                            <div class="mt-1">
                                                <input 
                                                    type="email" 
                                                    name="email" 
                                                    id="email" 
                                                    v-model="user.email" 
                                                    :disabled="user.default || isView"
                                                    autocomplete="given-name" 
                                                    placeholder="example@gmail.com"
                                                    class="block w-full appearance-none rounded-md border border-untitled-gray-300 px-3 py-2 placeholder-untitled-gray-400 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-untitled-gray-500 sm:text-sm" />
                                            </div>
                                            <ErrorSpanMessage v-if="errorValue && errorValue.email">
                                                {{ errorValue.email[0] }}
                                            </ErrorSpanMessage>
                                        </div>
                                        <div class="sm:col-span-3">
                                            <div class="mt-1">
                                                <SelectRoles 
                                                    v-model="user.roles" 
                                                    @clearRoles="handleRemoveSelectedRoles"
                                                    @clearRole="handleRemoveSelectedRole"/>
                                            </div>
                                            <ErrorSpanMessage v-if="errorValue && errorValue.roles">
                                                {{ errorValue.roles[0] }}
                                            </ErrorSpanMessage>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2" 
                                v-if="!isView">
                                <button 
                                    type="button"
                                    :disabled="loading"
                                    class="flex w-24 float-right justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2"
                                    @click="handleClickSubmit">
                                    Submit
                                </button>

                                <button 
                                    type="button"
                                    :disabled="loading"
                                    class="flex w-24 float-right justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-untitled-gray-700 shadow-lg mr-2 hover:bg-untitled-gray-100 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2"
                                    @click="handleClickCloseModal">
                                    Cancel
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup>
import { ref, defineEmits, onBeforeMount, computed, defineProps, toRefs, defineAsyncComponent } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import ErrorSpanMessage from '@/components/ErrorSpanMessage.vue';
import InputLoader from '@/components/loader/InputLoader.vue';
import { storeUser } from '@/modules/companies/composables/user/store_user';
import { updateUser } from '@/modules/companies/composables/user/update_user';

const SelectRoles = defineAsyncComponent({
    loader: () => import('@/modules/roles/utilities/SelectRoles.vue'),
    loadingComponent: InputLoader,
})

const props = defineProps({
    openModal: {
        type: Boolean,
        default: false
    },
    selectedItem: {
        type: Object,
        default: null
    },
    isView: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['closeModal', 'storedUser', 'updatedUser'])

const open = computed(() => props.openModal)

const selectedItem = computed({
    get() {
        return props.selectedItem
    },
    set(newValue) {
        newValue
    }
})

const user = ref({
    id: null,
    name: '',
    roles: []
})

const errorValue = ref(null);
const errorMessage = ref(null);
const loading = ref(false);
const isView = computed(() => props.isView)

const handleClickCloseModal = () => {
    emit('closeModal');
}

const handleClickSubmit = async () => {

    loading.value = true
        
    if(user.value && user.value.id) {
        const {post, data, errorData, message} = updateUser(user.value);
        await post();
        if(!data.value) {
            errorValue.value = errorData.value
            errorMessage.value = message.value
            loading.value = false
            return
        }

        loading.value = false
        emit('updatedUser', data.value);
        return;
    }

    const { post, data, message, errorData } = storeUser(user.value);
    await post();
    loading.value =  false
    if(!data.value) {
        errorValue.value = errorData.value
        errorMessage.value = message.value
        loading.value = false
        return 
    }

    emit('storedUser', data.value)
}

const initializeForm = () => {
    user.value = {
        id: null,
        name: '',
        roles: []
    }

    errorValue.value = null
}

const handleRemoveSelectedRoles = (role) => {
    if(!selectedItem.value) return

    let index = selectedItem.value.roles.findIndex(r => r.id == role.id);
    selectedItem.value.roles.splice(index, 1);
    user.value.roles = []
}

const handleRemoveSelectedRole = (role) => {
    const { roles } = toRefs(user.value);
    let index = roles.value.findIndex(r => r.id == role.id);
    roles.value.splice(index, 1);
    
}

onBeforeMount(() => {
    if (selectedItem.value && selectedItem.value.id) {
        user.value = props.selectedItem
    }
    else {
        initializeForm();
    }
})
</script>