<template>
    <TransitionRoot as="template" :show="open">
        <Dialog as="div" class="relative z-10" @close="handleCloseModal()">
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
                            <div>
                                <div class="mt-3 sm:mt-5">
                                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">Edit your
                                        default {{companyProfile.name}} domain</DialogTitle>
                                    <div class="mt-5">
                                        <div class="mt-1 flex rounded-md shadow-sm">
                                            <input type="text" v-model="domain.name" name="company-website" id="company-website"
                                                class="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm"
                                                placeholder="Enter a new default subdomain " />
                                            <span
                                                class="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">{{  companyDomain && companyDomain.id ? companyDomain.tenant_domain : '' }}</span>

                                        </div>
                                        <p class="mt-5 text-xs text-gray-500" id="email-description">We recommend using
                                            the name of your business or something related to your niche.</p>
                                        <ErrorSpanMessage v-if="errorValue && errorValue.name">
                                            {{ errorValue.name[0] }}
                                        </ErrorSpanMessage>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                <button type="button"
                                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-untitled-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                    @click="saveDomain()">Save</button>
                                <button type="button"
                                    class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                                    @click="handleCloseModal()" ref="cancelButtonRef">Cancel</button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
  
<script setup>
import { ref, computed, defineProps, defineEmits, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { CheckIcon } from '@heroicons/vue/24/outline'
import { updateDomain } from '../../composables/domain/update_domain';
import ErrorSpanMessage from '@/components/ErrorSpanMessage.vue';

const props = defineProps({
    openModal: {
        type: Boolean,
        default: false
    },
    companyProfile: {
        type: Object,
        default: () => {}
    },
    companyDomain: {
        type: Object,
        default: () => {},
        required: true
    }
})

const emit = defineEmits(['closeModal', 'updatedDomain'])

const open = computed(() => props.openModal)

const companyProfile = computed({
    get() {
        return props.companyProfile
    },
    set(newValue) {
        newValue
    }
})

const companyDomain = computed(() => props.companyDomain)

const domain = ref({...companyDomain.value})

const errorValue = ref(null)
const errorMessage = ref(null)

const handleCloseModal = () => {
    emit('closeModal')
}

const saveDomain = async () => {

    const { update, data, errorData, message } = updateDomain(domain.value.id, domain.value)
    await update();
    errorValue.value = errorData.value
    errorMessage.value = message.value

    if(!data.value) {
        return
    }

    emit('updatedDomain', data.value);
}

onMounted(() => {
    if(companyDomain.value) {
        domain.value = {...companyDomain.value}
    }
})
</script>