<template>
    <GlobalBreadCrumbs :pages="pages"/>
    <PageLoader v-if="loadingStore"/>
    <div class="py-6" v-if="!loadingStore">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <h1 class="text-2xl font-semibold text-untitled-gray-700">
                {{ store.name }} Details
            </h1>
            <div class="relative mt-1 py-4 rounded-md">
                <router-link
                    class="absolute text-untitled-gray-500 inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
                    :to="{ name: 'Company Details Page', params: { id: companyId }, query: { tab: 'Stores'} }">
                    <ArrowLeftIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                </router-link>
                <label class="p-10 text-sm text-untitled-gray-500">Back</label>
                <button type="button"
                    @click="handleClickEdit"
                    class="inline-flex float-right justify-center rounded-md border border-transparent h-7 bg-untitled-gray-600 py-1 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
                    Edit
                </button>
            </div>
        </div>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div class="mt-10 sm:mt-0">
                <div class="md:grid md:grid-cols-3 md:gap-6">
                    <div class="md:col-span-1">
                        <div class="px-4 sm:px-0">
                            <h3 class="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                            <p class="mt-1 text-sm text-gray-600">Use a permanent address where you can receive mail.
                            </p>
                        </div>
                    </div>
                    <div class="mt-5 md:col-span-2 md:mt-0">
                        <form >
                            <div class="overflow-hidden shadow sm:rounded-md">
                                <div class="bg-white px-4 py-5 sm:p-6" v-if="!loadingStore">
                                    <div class="grid grid-cols-6 gap-6">
                                        <div class="col-span-6 sm:col-span-6">
                                            <label for="first-name"
                                                class="block text-sm font-medium text-gray-700">Name</label>
                                            <input type="text" name="first-name" readonly v-model="store.name" id="first-name"
                                                autocomplete="given-name"
                                                placeholder="Enter store full name"
                                                class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
                                        </div>

                                        <div class="col-span-6 sm:col-span-3">
                                            <label for="last-name" class="block text-sm font-medium text-gray-700">
                                                Phone</label>
                                            <SelectPhoneNumber 
                                                v-model="phoneNumber" 
                                                :is-read-only="true"
                                                :phone="store.phone_number ? `+${store.phone_code}${store.phone_number}`: ''"/>
                                            
                                        </div>
                                        
                                        <div class="col-span-6 sm:col-span-3">
                                            <SelectCompanies v-model="store.company" 
                                            :is-read-only="true"
                                            :isDisabled="companyId ? true : false"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div class="hidden sm:block" aria-hidden="true">
                <div class="py-5">
                    <div class="border-t border-gray-200" />
                </div>
            </div>

            <div class="mt-10 sm:mt-0">
                <div class="md:grid md:grid-cols-3 md:gap-6">
                    <div class="md:col-span-1">
                        <div class="px-4 sm:px-0">
                            <h3 class="text-lg font-medium leading-6 text-gray-900">Address Information</h3>
                        </div>
                    </div>
                    <div class="mt-5 md:col-span-2 md:mt-0">
                        <form >
                            <div class="overflow-hidden shadow sm:rounded-md">
                                <div class="space-y-6 bg-white px-4 py-5 sm:p-6" v-if="!loadingStore">
                                    <div class="grid grid-cols-6 gap-6">
                                        <div class="col-span-6 sm:col-span-6">
                                            <label for="first-name"
                                                class="block text-sm font-medium text-gray-700">Address</label>
                                            <textarea type="text" readonly v-model="store.address" 
                                                placeholder="Enter full address"
                                                class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
                                        </div>

                                        <div class="col-span-6 sm:col-span-3">
                                            <label for="last-name" class="block text-sm font-medium text-gray-700">
                                                City</label>
                                                <input type="text" readonly name="city" v-model="store.city" id="city"
                                                autocomplete="given-name"
                                                class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
                                        </div>
                                        
                                        <div class="col-span-6 sm:col-span-3">
                                            <label for="last-name" class="block text-sm font-medium text-gray-700">
                                                State</label>
                                            <input type="text" name="state" readonly v-model="store.state" id="state"
                                                autocomplete="given-name"
                                                class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
                                        </div>
                                        <div class="col-span-6 sm:col-span-3">
                                            <label for="last-name" class="block text-sm font-medium text-gray-700">
                                                Country</label>
                                            <input type="text" name="country" readonly v-model="store.country" id="country"
                                                autocomplete="given-name"
                                                class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
                                        </div>
                                        
                                        <div class="col-span-6 sm:col-span-3">
                                            <label for="last-name" class="block text-sm font-medium text-gray-700">
                                                Zip </label>
                                            <input type="number" name="zip" readonly v-model="store.zip" id="zip"
                                                autocomplete="given-name"
                                                class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import ErrorSpanMessage from '@/components/ErrorSpanMessage.vue';
import SelectPhoneNumber from '@/components/forms/SelectPhoneNumber.vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import {
    defineProps,
    ref,
    computed,
    onMounted
} from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { getCompaniesById } from '../../composables/get_company_byId';
import SelectCompanies from '../../utilities/SelectCompanies.vue';
import { getStoreById } from '../../composables/store/get_store_by_id';
import PageLoader from '@/components/loader/PageLoader.vue';
import GlobalBreadCrumbs from '@/components/GlobalBreadCrumbs.vue';

const props = defineProps({
    id: null,
    storeId: null,
})

const router = useRouter();
const route = useRoute();

const storeId = computed(() => props.storeId)
const companyName = ref(null)
const companyId = computed(() => props.id)
const loadingCompany = ref(false)

const store = ref({})

const loadingStore = ref(false);
const errorValue = ref(null)
const phoneNumber = ref()


const pages = [
    {
        name: 'Companies',
        to: {
            name: 'Company Home Page',
        },
        current: false
    },
    {
        name: 'Stores',
        to: {
            name: 'Company Details Page',
            params: {
                id: companyId.value
            },
            query: {
                tab: 'Stores'
            }
        },
        current: true
    },
    {
        name: 'Details',
        to: {
            name: 'View Company Store Page',
            params: {
                id: companyId.value,
                storeId: storeId.value ? storeId.value : null
            }
        },
        current: true
    },
]

const getSpecificCompany = async () => {
    loadingCompany.value = true
    const { load, data } = getCompaniesById(companyId.value);

    await load();
    store.value.company = data.value
    loadingCompany.value = false
}

const fetchStoreById = async () => {
    loadingStore.value = true
    const { load, data} = getStoreById(storeId.value);
    await load();
    store.value = data.value;
    loadingStore.value = false
}

const handleClickEdit = () => {
    router.push({ name: 'Edit Company Store Page',
        params: {
            id: companyId.value,
            storeId: storeId.value   
        },
        query: {
            name: store.value.company.name
        }
    })
}

onMounted( async () => {
    if (route.query.name) {
        companyName.value = route.query.name
    }

    if(storeId.value) {
        await fetchStoreById();
    }

    if(!storeId.value) {
        await getSpecificCompany();
    }
})
</script>