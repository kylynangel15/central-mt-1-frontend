<template>
    <Combobox as="div" 
        :modelValue="modelValue" 
        by="id"
        multiple>
        <ComboboxLabel class="block text-sm font-medium text-untitled-gray-700">
            {{  label }}
        </ComboboxLabel>
        <div class="relative mt-1">
            <div :class="[query ? '' : '']" class="absolute z-[10] flex flex-col">
                <p v-if="showSelectedItems" class=" flex items-center ml-5 mt-1 max-h-[2rem] h-[2rem] text-sm">
                    {{ displaySelectedItem() }}
                </p>
            </div>
            <ComboboxInput  
                @keyup="handleSearch"
                :placeholder="selectedItem.length ? '' : 'Type to search'"
                class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-1 focus:ring-untitled-gray-500 sm:text-sm"
                @change="handelChangeQuery" 
                :displayValue="(item) => item?.name" />
            <ComboboxButton 
                @click="handleSearch"
                class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                <ChevronUpDownIcon v-if="showSelectedItems && selectedItem.length == 0" class="h-5 w-5 text-gray-400" aria-hidden="true" />
                <XCircleIcon v-if="selectedItem.length" @click.prevent="clearFilter" class="z-[100] cursor-pointer text-untitled-gray-500 absolute inset-y-0 mr-2 mt-2 right-0 h-5 w-5"
                    aria-hidden="true" />
            </ComboboxButton>
            <div v-if="items.length === 0 && query !== '' && !loading"
                class="absolute text-sm w-full bg-white border-untitled-gray-400 shadow-sm cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
            </div>
            <div v-if="loading && query !== ''" class="absolute text-sm w-full bg-white cursor-default select-none py-2 px-4 text-gray-700">
                Searching.....
            </div>
            <ComboboxOptions v-if="items.length > 0"
                class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
               
                <ComboboxOption v-for="item in items" :key="item.id" :value="item" as="template"
                    v-slot="{ active, selected }">
                    <li @click="handleClick"
                        :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-untitled-gray-600 text-white' : 'text-gray-900']">
                        <span :class="['block truncate', selected && 'font-semibold']">
                            {{ item.name }}
                        </span>
            
                        <span v-if="selected"
                            :class="['absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-untitled-gray-600']">
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                    </li>
                </ComboboxOption>
            </ComboboxOptions>
        </div>
    </Combobox>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue'
import {
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
ComboboxLabel,
ComboboxButton,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon, XCircleIcon } from '@heroicons/vue/24/outline';
import { debounce as _debounce } from 'lodash-es';

const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    items: {
        type: Array,
        default: () => []
    },
    modelValue: {
        type: Array,
        default: () => []
    },
    showSelectedItems: {
        type: Boolean,
        default: false
    },
    label : {
        type: String,
        required: true
    },
    query: {
        type: String
    }
})

const emit = defineEmits(['update:modelValue', 'typing', 'query', 'clearFilter'])

const items = computed(() => props.items)
const showSelectedItems = computed({
    get() {
        return props.showSelectedItems
    },
    set(newValue) {
        newValue
    }
});
const query = computed(() => props.query)
const totalSelected = ref(0)
const loading = computed(() => props.loading)
const label = computed(() => props.label)

const selectedItem = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});

const handleClick = () => {
    emit('typing')
}

const handelChangeQuery = (event) => {
    query.value = event.target.value
}

const displaySelectedItem = () => {
    const totalSeletedItem = selectedItem.value.length + 1;

    totalSelected.value = totalSeletedItem;

    if (!selectedItem.value.length) return;

    if (selectedItem.value.length <= 2) {
        return selectedItem.value.map((item) => item.name).join(",");
    } else {
        return (
            selectedItem.value
                .map((item) => item.name)
                .slice(0, 3)
                .join(" , ") + ` +${totalSeletedItem - 3}`
        );
    }
};

const handleSearch = (e) => {
    emit('query', e.target.value)
    onChangeSearchText()
}

const onChangeSearchText = _debounce(() => {
    showSelectedItems.value = true
    
}, 1500)

const clearFilter = () => {
    query.value = '';
    emit('clearFilter')
}



</script>