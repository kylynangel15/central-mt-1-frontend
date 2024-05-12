<template>
    <td :class="[index != 0 ? 'text-center' : 'text-left', classTd]" class="px-3 py-4 text-sm text-gray-500">
        <span :class="[clickable ? 'cursor-pointer text-untitled-gray-900 font-semibold': '', 'text-ellipsis overflow-hidden']" @click="handleClick" ><slot name="value"></slot></span>
    </td>
</template>
<script setup>
import { defineEmits, computed, defineProps } from 'vue'

const props = defineProps({
    clickable: {
        type: Boolean,
        default: false
    },
    clickableColumn: {
        type: String,
        default: null
    },
    value: {
        type: Object,
        default: () => {}
    },
    index: null,
    classTd: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['clickValue']);

const clickable = computed(() => props.clickable)

const clickableColumn = computed(() => props.clickableColumn)

const data = computed(() => props.value)

const index = computed(() => props.index)

const classTd = computed(() => props.classTd)

const handleClick = () => {
    if(!clickable.value) {
        return;
    } 
    
    emit('clickValue', {item: data.value, column: clickableColumn.value})
}
</script>