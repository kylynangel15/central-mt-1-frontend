<template>
    <Combobox 
        v-model="selectedRoles" 
        by="id"
        :multiple="isMultiple">
        <ComboboxLabel 
            v-if="showLabel" 
            class="block mt-1 text-sm font-medium text-untitled-gray-700">
            Roles <RequiredSpan v-if="isRequired"/>
        </ComboboxLabel>
        <div class="relative mt-1">
            <div class="absolute z-[10] flex flex-col">
                <p v-if="showSelectedItems" class=" flex items-center ml-5 mt-1 max-h-[2rem] h-[2rem] text-sm">
                    {{ displaySelectedItem() }}
                </p>
            </div>
            <ComboboxButton @click="handleSearch"
                class="block w-full appearance-none placeholder-untitled-gray-400 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-untitled-gray-500 sm:text-sm">
    
                <ComboboxInput
                    :placeholder="selectedRoles && selectedRoles.length > 0 ? '' : 'Select Roles '"
                    @keyup="handleSearch" 
                    @change="query = $event.target.value"
                    class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-1 focus:ring-untitled-gray-500 sm:text-sm"
                    :displayValue="(role) => role?.friendly_name" />
                <XMarkIcon 
                    v-if="selectedRoles && selectedRoles.length > 0 && showLabel" 
                    @click.prevent="clearFilter"
                    class="absolute inset-y-0 ml-4 mr-2 mt-2 right-0 h-5 w-5" 
                    aria-hidden="true" />
    
            </ComboboxButton>
            <TransitionRoot 
                leave="transition ease-in duration-100" 
                leaveFrom="opacity-100" 
                leaveTo="opacity-0"
                @after-leave="query = ''; showSelectedItems = true">
                <ComboboxOptions
                    class=" max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm absolute z-[900]">
                    <div v-if="roles.length === 0 && query !== '' && !loadingRoles"
                        class="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                    </div>
                    <div v-if="loadingRoles && query !== ''" 
                        class="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Searching.....
                    </div>
                    <ComboboxOption 
                        v-for="role in roles.filter(role => {
                            if(!isAdministrator) {
                                return role.name != 'super-admin'
                            } 
                            return role
                        })" 
                        as="template" 
                        :key="role.id" 
                        :value="role"
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
                                {{ role.friendly_name }}
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
    onBeforeMount, 
    watch, 
    computed, 
    defineAsyncComponent
} from 'vue'
import { getRoles } from '../composables/get_roles';
import { debounce as _debounce } from 'lodash-es';
import { useRoleStore } from '../store/useRoleStore';
import { useAdminSettingStore } from '@/store/useAdminSettingStore';
import RequiredSpan from '@/components/RequiredSpan.vue';

const SelectComboBox = defineAsyncComponent({
    loader: () => import('@/components/forms/SelectComboBox.vue')
})


const adminSettingStore = useAdminSettingStore();

const props = defineProps({
    modelValue: {
        type: Array
    },
    showLabel: {
        type: Boolean,
        default: true
    },
    isMultiple: {
        type: Boolean,
        default: true
    },
    isRequired: {
        type: Boolean,
        default: false,
        required: false
    }
})

const emit = defineEmits(['update:modelValue', 'clearRoles', 'clearRole'])

const isAdministrator = computed(() => adminSettingStore.isAdministrator)

const roleStore = useRoleStore()

const showLabel = computed(() => props.showLabel)

const loadingRoles = ref(true)

const isRequired = computed(() => props.isRequired)

const totalSelected = ref(0)
const selectedRoles = computed({
    get() {
        return props.modelValue
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})
const showSelected = ref(false)
const roles = computed(() => roleStore.roles)
const showSelectedItems = ref(true)
const errorApi = ref(false)
const query = ref('')
const fetchRoles = async () => {
    loadingRoles.value = true
    const params = {
        search: query.value,
        page: 1,
        size: 20,
    }

    const { load, data} = getRoles(params);
    await load();
    roleStore.setRoles(data.value);
    loadingRoles.value = false
}

const handleSearch = (e) => {
    showSelectedItems.value = e.target.value?.length > 0 ? false : true;
}

const displaySelectedItem = () => {
    
    if(!selectedRoles.value) return

    const totalSelectedItem = selectedRoles.value.length + 1;

    totalSelected.value = totalSelectedItem;

    if (!selectedRoles.value.length) return;

    if (selectedRoles.value.length <= 2) {
        return selectedRoles.value.map((item) => item.friendly_name).join(",");
    } else {
        return (
            selectedRoles.value
                .map((item) => item.friendly_name)
                .slice(0, 2)
                .join(" , ") + ` +${totalSelectedItem - 2}`
        );
    }
};

const clearFilter = () => {
    emit('clearRoles', selectedRoles.value)
};

const onChangeSearchText = _debounce((value) => {
    fetchRoles();
}, 500)

watch(query, 
    (val) => {
        onChangeSearchText(val);   
    })


onBeforeMount(
    () => {
        fetchRoles();
    })


</script>