<template>
	<Menu as="div" class="relative inline-block mx-auto text-left">
		<div>
			<MenuButton class="inline-flex w-full justify-center rounded-md">
				<EllipsisVerticalIcon
					class="-mr-1 ml-2 h-5 w-5"
					aria-hidden="true" />
			</MenuButton>
		</div>

		<transition
			enter-active-class="transition ease-out duration-100"
			enter-from-class="transform opacity-0 scale-95"
			enter-to-class="transform opacity-100 scale-100"
			leave-active-class="transition ease-in duration-75"
			leave-from-class="transform opacity-100 scale-100"
			leave-to-class="transform opacity-0 scale-95">
			<MenuItems
				class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
				<div class="py-1">
					<MenuItem v-slot="{ active }">
						<a
							type="button"
							@click="handleClickView(scope)"
							:class="[
								active
									? 'bg-untitled-gray-100 text-untitled-gray-900'
									: 'text-untitled-gray-700',
								'group flex items-center px-4 py-2 text-md',
							]">
							<EyeIcon
								class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
								aria-hidden="true" />
							View
						</a>
					</MenuItem>
					<MenuItem v-slot="{ active }">
						<a
							type="button"
							@click="handleClickEdit(scope)"
							:class="[
								active
									? 'bg-untitled-gray-100 text-untitled-gray-900'
									: 'text-untitled-gray-700',
								'group flex items-center px-4 py-2 text-md',
							]">
							<PencilSquareIcon
								class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
								aria-hidden="true" />
							Edit
						</a>
					</MenuItem>
				</div>
				<div class="py-1" v-administrator>
					<MenuItem v-slot="{ active }">
						<a
							type="button"
							@click="handleClickDelete(scope)"
							:class="[
								active
									? 'bg-untitled-gray-100 text-untitled-gray-900'
									: 'text-untitled-gray-700',
								'group flex items-center px-4 py-2 text-md',
							]">
							<TrashIcon
								class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
								aria-hidden="true" />
							Delete
						</a>
					</MenuItem>
				</div>
			</MenuItems>
		</transition>
	</Menu>
</template>

<script setup>
import { useAdminSettingStore } from '@/store/useAdminSettingStore';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import {
	EllipsisVerticalIcon,
	EyeIcon,
	PencilSquareIcon,
	TrashIcon,
} from '@heroicons/vue/20/solid';

import { defineEmits, defineProps, computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
	scope: {
		type: Object,
		required: true,
	},
});

const emit = defineEmits(['deleteAction']);

const adminSettingStore = useAdminSettingStore()

const router = useRouter();

const selected = computed(() => props.scope);

const handleClickEdit = (item) => {
	router.push({ name: 'Edit App Page', params: { id: item.id } });
};

const handleClickView = (item) => {
	router.push({ name: 'View App Page', params: { id: item.id } });
};

const handleClickDelete = () => {
	emit('deleteAction', selected.value);
};
</script>
