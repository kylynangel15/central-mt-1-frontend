<template>
    <Listbox 
      as="div" 
      v-model="selected">
        <ListboxLabel 
          class="block text-sm font-medium text-gray-700" 
          v-if="showLabel">
            Status
        </ListboxLabel>
        <div class="relative mt-1">
          <ListboxButton class="relative h-10 w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-1 focus:ring-untitled-gray-500 sm:text-sm">
            <span class="block truncate text-sm text-untitled-gray-500">
              {{ selected ? replaceStatusString(selected) : 'Select Status' }}
            </span>
            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon 
                class="h-5 w-5 text-gray-400" 
                aria-hidden="true" />
            </span>
          </ListboxButton>
    
          <transition 
            leave-active-class="transition ease-in duration-100" 
            leave-from-class="opacity-100" 
            leave-to-class="opacity-0">
              <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <ListboxOption 
                    as="template" 
                    v-for="person in status" 
                    :key="person.id" 
                    :value="person" 
                    v-slot="{ active, selected }">
                      <li :class="[active ? 'text-white bg-untitled-gray-600' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                        <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                          {{ replaceStatusString(person) }}
                        </span>
          
                        <span 
                          v-if="selected" 
                          :class="[active ? 'text-white' : 'text-untitled-gray-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                          <CheckIcon 
                            class="h-5 w-5" 
                            aria-hidden="true" />
                        </span>
                      </li>
                  </ListboxOption>
              </ListboxOptions>
          </transition>
        </div>
    </Listbox>
  </template>
  
  <script setup>
import { ref, defineProps, computed, defineEmits } from 'vue'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

  const props = defineProps({
    showLabel: {
        type: Boolean,
        default: true
    },
    modelValue: {
        type: String,
        default: ''
    },
  })

  const emit = defineEmits(['update:modelValue'])

  const showLabel = computed(() => props.showLabel);
  
  const status = ref(['ALL', 'HAS ON DEMAND', "DOESN'T HAVE ON DEMAND TRAINING"])
  
  const selected = computed({
    get() {
        return props.modelValue
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
  })


const replaceStatusString = (status) => {
  if(!status) return;
  let string = status.replace('_', " ").toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1)
}
  </script>