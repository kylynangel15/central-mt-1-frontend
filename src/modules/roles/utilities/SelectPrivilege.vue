<template>
    <Combobox 
        v-model="selectedPrivilege" 
        by="id"
        :disabled="isDisabled"
        :multiple="false">
        <ComboboxLabel 
            v-if="showLabel" 
            class="block mt-1 text-sm font-medium text-untitled-gray-700">
            Privilege
        </ComboboxLabel>
        <div class="relative mt-1">
            <ComboboxButton @click="handleSearch"
                class="block w-full appearance-none placeholder-untitled-gray-400 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-untitled-gray-500 sm:text-sm">
    
                <ComboboxInput
                    :placeholder="selectedPrivilege && selectedPrivilege.id ? '' : 'Select Privilege '"
                    @keyup="handleSearch" 
                    @change="query = $event.target.value"
                    class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-1 focus:ring-untitled-gray-500 sm:text-sm"
                    :displayValue="(feature) => feature?.action_name" />
                <XMarkIcon 
                    v-if="selectedPrivilege && selectedPrivilege.id && showLabel && !isDisabled" 
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
                    v-infinite-scroll="loadMorePrivileges" 
                    :infinite-scroll-immediate-check="false"
                    infinite-scroll-watch-disabled="disableScroll"
                    class=" max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm absolute z-[900]">
                    <div v-if="privileges.length == 0 && !loading"
                        class="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                    </div>
                    <div v-if="loading && query !== ''" 
                        class="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Searching.....
                    </div>
                    <ComboboxOption 
                        v-for="feature in privileges.filter(
							(obj, index, self) =>
								index ===
								self.findIndex(
									(t) =>
										JSON.stringify(t) ===
										JSON.stringify(obj)
								)
						)" 
                        as="template" 
                        :key="feature.id" 
                        :value="feature"
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
                                {{ feature.action_name }}
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
import { getPrivileges } from '../composables/privilege/get_privileges';

const props = defineProps({
    modelValue: {
        type: Object
    },
    showLabel: {
        type: Boolean,
        default: true
    },
    privilegeId: {
        type: Number,
        default: null,
    },
    isDisabled: {
        type: Boolean,
        default: false
    },
    featureId: {
        type: Number,
        default: null,
    }
})

const emit = defineEmits(['update:modelValue', 'clearPrivilege'])

const showLabel = computed(() => props.showLabel)

const loading = ref(true)
const selectedPrivilege = computed({
    get() {
        return props.modelValue
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})
const featureId = computed(() => props.featureId)
const isDisabled = computed(() => props.isDisabled)
const privileges = ref([])
const showSelectedItems = ref(true)
const query = ref('')
const hasMorePage = ref(true)
const privilegeId = computed(() => props.privilegeId)

const params = ref({
    search: '',
    page: 1,
    size: 10,
})

const fetchPrivileges = async () => {
    loading.value = true
    params.value.search = query.value
    params.value.app_feature_id = featureId.value
    params.value.filter_parent = featureId.value ? 'true' : 'false'
    const { load, data, hasLastPage} = getPrivileges(params.value);
    await load();
    let privilegeData = privileges.value.concat(data.value);
    privileges.value = privilegeData.filter(privilege => privilege.id != privilegeId.value)
    hasMorePage.value = hasLastPage.value
    loading.value = false
}

const handleSearch = (e) => {
    showSelectedItems.value = e.target.value?.length > 0 ? false : true;
}

const loadMorePrivileges = () => {
    if(!hasMorePage.value) return;
    params.value.page = params.value.page + 1
}

const clearFilter = () => {
    emit('clearPrivilege', selectedPrivilege.value)
};

const onChangeSearchText = _debounce((value) => {
    privileges.value = []
    fetchPrivileges();
}, 500)

watch(query, 
    (val) => {
        onChangeSearchText(val);   
    })

watch(params.value, () => {
    fetchPrivileges();
})

watch(featureId, () => {
    privileges.value = []
    fetchPrivileges();
    emit('clearPrivilege')
})

onMounted(
    () => {
        fetchPrivileges();
    })
</script>