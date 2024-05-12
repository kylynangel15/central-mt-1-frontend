<template>
    <th :class="[customClass, index != 0 ? 'text-center' : 'text-left' ]" class="py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">
        <span :class="['group inline-flex ', sortable ? ' cursor-pointer' : '']" @click="handleClickSort">
            <slot name="th-title" ></slot>
            <span v-if="sortable" class="ml-2 flex-none rounded text-gray-400 ">
                <!-- <ChevronDownIcon /> -->
                <component :is="sort == 'asc' ? ChevronUpIcon : ChevronDownIcon" class="h-5 w-5" aria-hidden="true" ></component>
            </span>
        </span>
    </th>
</template>
<script setup>
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline';
import { defineProps, computed, defineEmits, ref } from 'vue';

const props = defineProps({
    sortable: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        default: null
    },
    class: {
        type: String,
        default: null
    },
    index: null,
    prop: {
        type: String,
        default: null
    }
})

const emit = defineEmits(['sort'])

const sortable = computed(() => props.sortable)
const name = computed(() => props.name)
const prop = computed(() => props.prop)
const customClass = computed(() => props.class)
const sort = ref('asc');

const handleClickSort = () => {
    if(!sortable.value) return 
    if (sort.value == 'asc') {
        sort.value = 'desc'
    }
    else {
        sort.value = 'asc'
    }
    emit('sort', {label: name.value, prop : prop.value, sortBy: sort.value})
}
</script>