<template>
    <PageLoader v-if="loadingDomain"/>
    <div class="flex-1 mt-8 xs:mt-2" v-else>
        <div class="mx-auto py-2 lg:py-4">

            <div class="mt-10 sm:mt-0">
                <div class="md:grid md:grid-cols-3 md:gap-6">
                    <div class="md:col-span-1">
                        <div class="px-4 sm:px-0 text-untitled-gray-600">
                            <h3 class="text-lg font-medium leading-6 text-gray-900">Site Domain Settings</h3>
                            <p class="mt-1 text-sm text-gray-600">This is the default subdomain connected to your
                                RevDojo site -- all the apps connected to your account can get a customize subdomain.
                            </p>
                        </div>
                    </div>
                    <div class="mt-5 md:col-span-2 md:mt-0" v-if="!loadingDomain">
                        <div>
                            <div class="overflow-hidden shadow sm:rounded-md">
                                <div class="bg-white px-4 py-5 sm:p-6">
                                    <div class="py-2 flex mb-5 " v-if="companyDomain.name">
                                        <ComputerDesktopIcon class="mr-1.5 h-8 w-8 flex-shrink-0 text-gray-400 mr-2"
                                            aria-hidden="true" />
                                        <span
                                            class="text-sm text-untitled-gray-500 inline-block align-middle">{{ companyDomain.domain }}
                                        </span> &nbsp;
                                        <span class="text-sm text-untitled-gray-500 inline-block align-middle"> RevDojo
                                            domain is connected </span>
                                    </div>
                                    <div class="border rounded-xl border-untitled-gray-400 py-5">
                                        <div class="border-b border-untitled-gray-400 px-5 py-4">
                                            <span class="text-untitled-gray-600 font-semibold">Subdomain</span>
                                        </div>
                                        <div class="px-2 py-2">
                                            <div class="overflow-hidden bg-white sm:rounded-md">
                                                <ul role="list" class="divide-y divide-gray-200">
                                                    <li>
                                                        <span class="block hover:bg-gray-50">
                                                            <div class="flex items-center px-4 py-4 sm:px-6">
                                                                <div class="flex min-w-0 flex-1 items-center">
                                                                    <div
                                                                        class="min-w-0 flex-1 px-4 md:grid md:grid-cols-4 md:gap-4">
                                                                        <div class="flex col-span-3">
                                                                            <p class="truncate mr-2 text-sm font-medium text-untitled-gray-600"
                                                                                ref="url">
                                                                                {{ companyDomain.name ?
                                                                                    companyDomain.domain : 'Create custom domain'}}
                                                                            </p>
                                                                            <ClipboardDocumentListIcon
                                                                                @click="handleClickCopy"
                                                                                class="w-7 cursor-pointer text-untitled-gray-400" />
                                                                        </div>
                                                                        <div class="hidden md:block">
                                                                            <div>
                                                                                <p
                                                                                    class="text-sm text-white bg-blue-400 w-32 text-center rounded-lg">
                                                                                    RevDojo Domain
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                    <button type="button" @click="handleClickDomain"
                                        class="inline-flex justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">Change
                                        subdomain</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="hidden sm:block" aria-hidden="true">
                <div class="py-5">
                    <div class="border-t border-gray-200" />
                </div>
            </div>
        </div>
    </div>
    <CompanyDomainModal v-if="showModalDomain" :company-domain="companyDomain" :company-profile="companyProfile"
        @closeModal="handleCloseModal" @updatedDomain="handleUpdatedDomain" :open-modal="showModalDomain" />


    <global-popup-notification v-if="showNotif" :show-notification="showNotif" :message="messageNotif" />
</template>
<script>
// use normal <script> to declare options
export default {
    inheritAttrs: false,
}
</script>
<script setup>
import {
    CheckCircleIcon,
    ChevronRightIcon,
    ComputerDesktopIcon,
    EnvelopeIcon,
    PencilSquareIcon,
    ClipboardDocumentListIcon
} from '@heroicons/vue/20/solid'
import useClipboard from 'vue-clipboard3'

import {
    ref,
    computed,
    defineProps,
    onMounted
} from 'vue'
import { getDomain } from '../../composables/domain/get_domain';
import CompanyDomainModal from '../modal/CompanyDomainModal.vue';
import PageLoader from '@/components/loader/PageLoader.vue';

const props = defineProps({
    companyId: {
        type: Number,
        default: null
    },
    companyProfile: {
        type: Object,
        default: () => { }
    }
})

const { toClipboard } = useClipboard()

const companyId = computed(() => props.companyId)
const companyProfile = computed(() => props.companyProfile)
const showModalDomain = ref(false)
const companyDomain = ref({})
const loadingDomain = ref(false)
const showNotif = ref(false)
const messageNotif = ref(null)
const handleClickDomain = () => {
    showModalDomain.value = true
}

const handleCloseModal = () => {
    showModalDomain.value = false
}

const handleUpdatedDomain = (domain) => {
    showModalDomain.value = false
    companyDomain.value = domain
    notification('Successfully created!')
}

const fetchCompanyDomain = async () => {
    loadingDomain.value = true
    const { load, data } = getDomain(companyId.value);
    await load();
    companyDomain.value = data.value
    loadingDomain.value = false
}

const notification = (message) => {
    messageNotif.value = message
    showNotif.value = true
    setTimeout(() => {
        showNotif.value = false
    }, 2000)
}

const handleClickCopy = async () => {
    await toClipboard(companyDomain.value.domain)
    notification(`You just copied this url ${companyDomain.value.domain}`)
}

onMounted(async () => {
    await fetchCompanyDomain()
})
</script>