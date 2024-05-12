<template>
	<PageLoader v-if="loadingUser" />
	<article v-if="!loadingUser && user && user.id" class="bg-white h-full">
		<!-- Profile header -->
		<div>
			<div>
				<img
					class="h-32 w-full object-cover lg:h-48"
					:src="
						user.cover_photo ? user.cover_photo : profile.coverImageUrl
					"
					alt="" />
			</div>
			<div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
				<div class="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
					<div class="flex">
						<img
							v-if="user && user.profile_photo"
							class="h-24 w-24 object-cover rounded-full ring-4 ring-white sm:h-32 sm:w-32"
							:src="user.profile_photo"
							alt="" />
						<UserCircleIcon
							v-else
							class="h-24 w-24 rounded-full bg-untitled-gray-100 text-untitled-gray-500 ring-4 ring-white sm:h-32 sm:w-32" />
					</div>
					<div
						class="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
						<div class="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
							<h1 class="truncate text-2xl font-bold text-gray-900">
								{{ user.name }}
							</h1>
						</div>
						<div
							class="justify-stretch mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
							<button
								type="button"
								@click="handleClickDelete"
								class="inline-flex justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-untitled-gray-500 shadow-lg mr-2 hover:bg-untitled-gray-100 focus:outline-none focus:ring-2 focus:ring-untitled-gray-400 focus:ring-offset-2">
								<TrashIcon class="w-5 mr-1" />
								Delete
							</button>
							<button
								type="button"
								class="inline-flex justify-center rounded-md border border-untitled-gray-300 bg-untitled-gray-700 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2"
								@click="handleClickEdit">
								<PencilSquareIcon
									class="text-white -ml-1 mr-2 h-5 w-5"
									aria-hidden="true" />
								<span>Edit</span>
							</button>
						</div>
					</div>
				</div>
				<div class="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
					<h1 class="truncate text-2xl font-bold text-gray-900">
						{{ user.name }}
					</h1>
				</div>
			</div>
		</div>

		<!-- Tabs -->
		<div class="mt-6 sm:mt-2 2xl:mt-5">
			<div class="border-b border-untitled-gray-200">
				<div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
					<nav class="-mb-px flex space-x-8" aria-label="Tabs">
						<a
							v-for="tab in tabs"
							:key="tab.name"
							:href="tab.href"
							:class="[
								tab.current
									? 'border-untitled-gray-500 text-gray-900'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-untitled-gray-300',
								'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
							]"
							:aria-current="tab.current ? 'page' : undefined">
							{{ tab.name }}
						</a>
					</nav>
				</div>
			</div>
		</div>

		<!-- Description list -->
		<div class="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
			<dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
				<div class="sm:col-span-1">
					<dt class="text-sm font-medium text-gray-500">Name</dt>
					<dd class="mt-1 text-sm text-gray-900">
						{{ user.name }}
					</dd>
				</div>

				<div class="sm:col-span-1">
					<dt class="text-sm font-medium text-gray-500">Phone</dt>
					<dd class="mt-1 text-sm text-gray-900">
						{{
							user.phone_number
								? `+${user.phone_code}${user.phone_number}`
								: "--"
						}}
					</dd>
				</div>

				<div class="sm:col-span-1">
					<dt class="text-sm font-medium text-gray-500">Email</dt>
					<dd class="mt-1 text-sm text-gray-900">
						{{ user.email }}
					</dd>
				</div>

				<div class="sm:col-span-1">
					<dt class="text-sm font-medium text-gray-500">Company</dt>
					<dd class="mt-1 text-sm text-gray-900">
						{{ user.company ? user.company.name : "--" }}
					</dd>
				</div>
				<div class="sm:col-span-1">
					<dt class="text-sm font-medium text-gray-500">Status</dt>
					<dd
						:class="[
							'mt-1 text-sm',
							user.status == 'ACTIVE'
								? 'bg-green-500 text-sm text-white p-1 mt-1 rounded-full w-24 text-center'
								: '',
							user.status == 'UNDER_REVIEW'
								? 'bg-yellow-600 text-sm text-white p-1 mt-1 rounded-full w-40 text-center'
								: '',
							user.status == 'INACTIVE'
								? 'bg-stone-600 text-sm text-white p-1 mt-1 rounded-full w-24 text-center'
								: '',
							user.status == 'REJECTED'
								? 'bg-red-600 text-sm text-white p-1 mt-1 w-24 rounded-full  text-center'
								: '',
						]">
						{{ replaceStatusString(user.status) }}
					</dd>
				</div>
				<div class="sm:col-span-2">
					<dt class="text-sm font-medium text-gray-500">User Roles</dt>
					<dd class="mt-1 text-sm text-gray-900">
						<div class="flex-wrap w-full mt-2">
							<span
								class="mr-2 bg-untitled-gray-400 text-xs text-white p-2 rounded-full"
								v-for="(role, index) in user.roles"
								:key="index"
								>{{ role.friendly_name }}
							</span>
						</div>
					</dd>
				</div>
			</dl>
		</div>
	</article>

	<global-delete-confirmation
		v-if="!loadingUser"
		@closeModal="handleCloseModal"
		@confirmed="handleDeleteUser"
		:selected-item="user"
		:params="user.name"
		:open-modal="openDeleteConfirmation" />

	<global-popup-notification
		v-if="showNotif"
		:show-notification="showNotif"
		:message="messageNotif" />
</template>
<script setup>
import { defineProps, ref, computed, onMounted, watch } from "vue";
import { PencilSquareIcon, UserCircleIcon } from "@heroicons/vue/20/solid";
import { useRouter } from "vue-router";
import PageLoader from "@/components/loader/PageLoader.vue";
import { TrashIcon } from "@heroicons/vue/24/outline";
import { useEmitter } from "@/composables/useEmitter";
import { getUser } from '../composables/get_user'
import { deleteUser } from '../composables/delete_user'

const props = defineProps({
	userId: {
		type: Number,
		required: true,
	},
});

const router = useRouter();
const emitter = useEmitter;
const user = ref({});
const openDeleteConfirmation = ref(false);

const profile = {
	coverImageUrl:
		"https://www.sportanddev.org/sites/default/files/styles/spor_banner_cropped_style/public/default_images/default-organization-cover_1.png?itok=uhQ_5F9k",
};

const messageNotif = ref("");
const showNotif = ref(false);
const tabs = [
	{ name: "Profile", href: "#", current: true },
	{ name: "Activity Logs", href: "#", current: false },
	{ name: "Sync Logs", href: "#", current: false },
];

const userId = computed(() => props.userId);
const loadingUser = ref(false);

const handleClickEdit = () => {
	router.push({
		name: "User Edit Page",
		params: {
			id: userId.value,
		},
	});
};

const fetchUserById = async () => {
	loadingUser.value = true;
	const { load, data } = getUser(userId.value);
	await load();
	user.value = data.value;
	loadingUser.value = false;
};

const replaceStatusString = (status) => {
	return status.replace("_", " ");
};

const handleClickDelete = () => {
	openDeleteConfirmation.value = true;
};

const handleCloseModal = () => {
	openDeleteConfirmation.value = false;
};

const handleDeleteUser = async (user) => {
	openDeleteConfirmation.value = false;
	const { data, trash } = deleteUser(user);
	await trash();
	notification("Successfully deleted!");
	// emit to user list main file
	emitter.emit("changeUserPreview", user.id);
};

const notification = (message) => {
	messageNotif.value = message;
	showNotif.value = true;

	setTimeout(() => {
		showNotif.value = false;
	}, 2000);
};

onMounted(async () => {
	await fetchUserById();
});

watch(userId, async () => {
	await fetchUserById();
});
</script>
