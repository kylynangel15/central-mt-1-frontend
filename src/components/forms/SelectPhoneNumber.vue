<template>
    <VueTelInput 
        :value="phone" 
        @input="onInput" 
        :disabled="isReadOnly"
        mode="international"
        default-country="us"
        :dropdownOptions="{
          showFlags: true,
          showDialCodeInSelection: true,
        }"></VueTelInput>
</template>
<script setup>
import { onMounted, ref, defineProps, defineEmits, computed } from 'vue';
import { VueTelInput } from 'vue3-tel-input'
import 'vue3-tel-input/dist/vue3-tel-input.css'

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => {}
    },
    phone: {
        type: String,
        default: ''
    },
    isReadOnly: {
        type: Boolean,
        default: false,
        required: false
    }
})

const emit = defineEmits(['update:modelValue', 'removePhone', 'addPhoneNumber'])

const phone = computed({
    get() {
        return props.phone
    },
    set(value) {
        value    
    }
});
const result = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value)
    }
})

const isReadOnly = computed(() => props.isReadOnly)

const onInput = (phone, phoneObject, input) => {

    if (phoneObject?.formatted) {
        result.value = phoneObject;
    }

    if(!phone) {
        result.value = {}
        emit('removePhone')
    }
}


</script>