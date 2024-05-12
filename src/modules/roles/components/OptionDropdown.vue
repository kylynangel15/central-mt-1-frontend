<template>
    <Menu as="div" class="relative inline-block mx-auto text-left">
        <div>
            <MenuButton
                class="inline-flex w-full justify-center rounded-md ">
                <EllipsisVerticalIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
            </MenuButton>
        </div>

        <transition enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <MenuItems
                class="absolute right-0 z-[10000] mt-2 w-40 origin-top-right divide-y divide-untitled-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                    <MenuItem v-slot="{ active }">
                    <a type="button"
                        @click="handleClickView"
                        :class="[active ? 'bg-untitled-gray-100 text-untitled-gray-900' : 'text-untitled-gray-700', 'group flex items-center px-4 py-2 text-md']">
                        <EyeIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                        View
                    </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                    <a type="button"
                        @click="handleClickEdit"
                        :class="[active ? 'bg-untitled-gray-100 text-untitled-gray-900' : 'text-untitled-gray-700', 'group flex items-center px-4 py-2 text-md']">
                        <PencilSquareIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                        Edit
                    </a>
                    </MenuItem>
                </div>
                <div class="py-1" v-administrator v-if="hideDelete">
                    <MenuItem v-slot="{ active }">
                    <a type="button"
                        @click="handleClickDelete"
                        :class="[active ? 'bg-untitled-gray-100 text-untitled-gray-900' : 'text-untitled-gray-700', 'group flex items-center px-4 py-2 text-md']">
                        <TrashIcon class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                        Delete
                    </a>
                    </MenuItem>
                </div>
            </MenuItems>
        </transition>
    </Menu>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { EllipsisVerticalIcon, EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/20/solid'

import { defineEmits , defineProps, computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    scope: {
        type: Object,
        required: true
    }
})

const scope = computed(() => props.scope)

const hideDelete = computed(() => props.scope.default==0);

const emit = defineEmits(['viewAction', 'editAction', 'deleteAction'])

const router = useRouter()

const handleClickEdit = () => {
    router.push({ name: 'Edit Role Page', params: { id: scope.value.id }})
}

const handleClickView = () => {
    router.push({ name: 'View Role Page', params: { id: scope.value.id }})
}

const handleClickDelete = () => {
    emit('deleteAction', scope.value)
}
</script>