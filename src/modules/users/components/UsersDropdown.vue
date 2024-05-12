<template>
	<Menu as="div" class="relative inline-block text-left">
		<div>
			<MenuButton
				class="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100">
				<EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
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
							@click="handleClickViewUser(scope)"
							:class="[
								active
									? 'bg-gray-100 text-gray-900'
									: 'text-gray-700',
								'group flex items-center px-4 py-2 text-sm cursor-pointer',
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
									? 'bg-gray-100 text-gray-900'
									: 'text-gray-700',
								'group flex items-center px-4 py-2 text-sm cursor-pointer',
							]">
							<PencilSquareIcon
								class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
								aria-hidden="true" />
							Edit
						</a>
					</MenuItem>
				</div>
				<div class="py-1">
					<MenuItem v-slot="{ active }">
						<a
							@click="handleSendWelcome(scope)"
							:class="[
								active
									? 'bg-gray-100 text-gray-900'
									: 'text-gray-700',
								'group flex items-center px-4 py-2 text-sm cursor-pointer',
							]">
							<EnvelopeIcon
								class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
								aria-hidden="true" />
							Send Welcome Email
						</a>
					</MenuItem>
				</div>
				<div class="py-1">
					<MenuItem v-slot="{ active }">
						<a
							@click="handleClickDelete(scope)"
							:class="[
								active
									? 'bg-gray-100 text-gray-900'
									: 'text-gray-700',
								'group flex items-center px-4 py-2 text-sm cursor-pointer',
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

	<global-delete-confirmation
		@closeModal="handleCloseModal"
		@confirmed="handleClickDeleteUser"
		:selected-item="selectedItem"
		:params="itemName"
		:open-modal="openDeleteConfirmation" />

	<global-popup-notification
		v-if="showNotification"
		:show-notification="showNotification"
		:message="messageNotification" />
</template>
<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { PencilSquareIcon, TrashIcon, EllipsisVerticalIcon, EyeIcon, EnvelopeIcon } from '@heroicons/vue/24/outline';
import { computed, defineProps, defineEmits, ref } from 'vue';
import { useRouter } from 'vue-router';
import { deleteUser } from '../composables/delete_user';
import { sendWelcomeEmail } from '../composables/send_welcome_email'

const props = defineProps({
    scope: {
        type: Object,
        required: true,
    }
})
const emit = defineEmits(['fetchUsers'])
const router = useRouter();
const scope = computed(() => props.scope)
const openDeleteConfirmation = ref(false)
const selectedItem = ref(null)
const itemName = ref(null)
const showNotification = ref(false)
const messageNotification = ref('')

const handleClickDelete = () => {
	itemName.value = scope.value.name
	selectedItem.value = scope.value
	openDeleteConfirmation.value = true
}

const handleClickEdit = () => {
    router.push({ name: 'User Edit Page', params: { id : scope.value.id}})
}

const handleClickViewUser = () => {
	router.push({ name: 'User View Page', params: { id : scope.value.id}})
}

const handleSendWelcome = async () => {
	const { send, data } = sendWelcomeEmail(scope.value.id);
	await send();
	notification('Successfully send welcome invite');
}

const handleCloseModal = () => {
	openDeleteConfirmation.value = false;
};

const handleClickDeleteUser = async (scope) => {
	const { trash, data } = deleteUser(scope);
	await trash();
	notification('Successfully deleted!');
	handleCloseModal();
	emit('fetchUsers')
};

const notification = (message) => {
	messageNotification.value = message;
	showNotification.value = true;
	setTimeout(() => {
		showNotification.value = false;
	}, 2000);
};
</script>