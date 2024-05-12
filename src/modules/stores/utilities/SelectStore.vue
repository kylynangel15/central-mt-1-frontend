<template>
    <Combobox 
        v-model="selectedStore" 
        by="id"
        :multiple="false">
        <ComboboxLabel 
            v-if="showLabel" 
            class="block mt-1 text-sm font-medium text-untitled-gray-700">
            Store
        </ComboboxLabel>
        <div class="relative mt-1">
            <ComboboxButton @click="handleSearch"
                class="block w-full appearance-none placeholder-untitled-gray-400 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-untitled-gray-500 sm:text-sm">
    
                <ComboboxInput
                    :placeholder="selectedStore && selectedStore.id ? '' : 'Select Store '"
                    @keyup="handleSearch" 
                    @change="query = $event.target.value"
                    class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-1 focus:ring-untitled-gray-500 sm:text-sm"
                    :displayValue="(company) => company?.name" />
                <XMarkIcon 
                    v-if="selectedStore && selectedStore.id && showLabel" 
                    @click.prevent="clearFilter"
                    class="absolute inset-y-0 mr-2 mt-2 right-0 h-5 w-5" 
                    aria-hidden="true" />
    
            </ComboboxButton>
            <TransitionRoot 
                leave="transition ease-in duration-100" 
                leaveFrom="opacity-100" 
                leaveTo="opacity-0"
                @after-leave="query = ''; showSelectedItems = true">
                <ComboboxOptions
                    v-infinite-scroll="loadMoreCompanies" 
                    :infinite-scroll-immediate-check="false"
                    infinite-scroll-watch-disabled="disableScroll"
                    class=" max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm absolute z-[900]">
                    <div v-if="stores.length == 0 && !loading"
                        class="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                    </div>
                    <div v-if="loading && query !== ''" 
                        class="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Searching.....
                    </div>
                    <ComboboxOption 
                        v-for="store in stores" 
                        as="template" 
                        :key="store.id" 
                        :value="store"
                        v-slot="{ selected, active }">
                        <li 
                            class="relative cursor-default select-none py-2 pl-10 pr-4" 
                            :class="{
                                'bg-untitled-gray-200 text-black': active,
                                'text-untitled-gray-900': !active,
                            }">
                            <span 
                                class="block truncate" 
                                :class="{
                                    'font-medium': selected ,
                                    'font-normal': !selected,
                                }">
                                {{ store.name }}
                            </span>
    
                            <span 
                                v-if="selected"
                                class="absolute inset-y-0 left-0 flex items-center pl-3" 
                                :class="{
                                    'text-untitled-gray-600': active,
                                    'text-untitled-untitled-gray-600': !active,
                                }">
                                <XMarkIcon 
                                    class="h-5 w-5" 
                                    aria-hidden="true" />
                            </span>
                        </li>
                    </ComboboxOption>
                </ComboboxOptions>
            </TransitionRoot>
        </div>
    </Combobox>
</template>
<script setup>
import { 
    Combobox, 
    ComboboxButton, 
    ComboboxInput, 
    ComboboxLabel, 
    ComboboxOption, 
    ComboboxOptions, 
    TransitionRoot 
} from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { ref, 
    defineProps, 
    defineEmits, 
    onMounted, 
    watch, 
    computed, 
} from 'vue'
import { debounce as _debounce } from 'lodash-es';
import { getStores } from '../composables/get_stores';

const props = defineProps({
    modelValue: {
        type: Object
    },
    showLabel: {
        type: Boolean,
        default: true
    },
})

const emit = defineEmits(['update:modelValue', 'clearStore', 'clearRole'])

const showLabel = computed(() => props.showLabel)

const loading = ref(true)

const selectedStore = computed({
    get() {
        return props.modelValue
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})

const stores = ref([])

const showSelectedItems = ref(true)
const query = ref('')
const hasMorePage = ref(true)

const params = ref({
    search: '',
    page: 1,
    size: 10,
})

const fetchStores = async () => {
    loading.value = true
    params.value.search = query.value
    const { load, data, hasMorePages} = getStores(params.value);
    await load();
    let companyData = stores.value.concat(data.value);
    stores.value = companyData
    hasMorePage.value = hasMorePages.value
    loading.value = false
}

const handleSearch = (e) => {
    showSelectedItems.value = e.target.value?.length > 0 ? false : true;
}

const loadMoreCompanies = () => {
    if(!hasMorePage.value) return;
    params.value.page = params.value.page + 1
}

const clearFilter = () => {
    emit('clearStore', selectedStore.value)
};

const onChangeSearchText = _debounce((value) => {
    stores.value = []
    fetchStores();
}, 500)

watch(query, 
    (val) => {
        onChangeSearchText(val);   
    })

watch(params.value, () => {
    fetchStores();
})

watch(stores, (val) => {
    if(val.length == 0) {
        selectedStore.value = {}
    }
})

onMounted(
    () => {
        fetchStores();
    })
</script>