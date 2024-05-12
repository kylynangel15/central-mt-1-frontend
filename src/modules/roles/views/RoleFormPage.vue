<template>
	<GlobalBreadCrumbs :pages="pages" />
	<PageLoader v-if="loadingRole" />
	<div class="py-6" v-else>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<h1 class="text-2xl font-semibold text-untitled-gray-700">
				Roles
				<span class="text-lg font-thin">{{
					roleId ? 'Edit' : 'Create'
				}}</span>
			</h1>
			<div class="relative mt-1 py-4 rounded-md">
				<button
					type="button"
					v-if="roleId"
					:disabled="loadingRole"
					@click="handleClickPreview"
					class="inline-flex pb-1 float-right justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
					Preview
				</button>
				<router-link
					class="absolute text-untitled-gray-500 inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
					:to="{ name: 'Roles Home Page' }">
					<ArrowLeftIcon
						class="-ml-1 mr-2 h-5 w-5"
						aria-hidden="true" />
				</router-link>
				<label class="p-10 text-sm text-untitled-gray-500">Back</label>
			</div>
		</div>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<div class="mt-10 sm:mt-0">
				<div class="md:grid md:grid-cols-3 md:gap-6">
					<div class="md:col-span-1">
						<div class="px-4 sm:px-0">
							<h3
								class="text-lg font-medium leading-6 text-gray-900">
								Role Information
							</h3>
						</div>
					</div>
					<div class="mt-5 md:col-span-2 md:mt-0">
						<form action="#" method="POST">
							<div class="overflow-hidden shadow sm:rounded-md">
								<div class="bg-white px-4 py-5 sm:p-6">
									<div class="grid grid-cols-6 gap-6">
										<div class="col-span-6 sm:col-span-3">
											<label
												for="first-name"
												class="block text-sm font-medium text-gray-700">
												System Name <RequiredSpan />
											</label>
											<input
												type="text"
												name="first-name"
												v-model="role.name"
												id="first-name"
												autocomplete="given-name"
												class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
											<ErrorSpanMessage
												v-if="
													errorValue &&
													errorValue.name
												">
												{{ errorValue.name[0] }}
											</ErrorSpanMessage>
										</div>

										<div class="col-span-6 sm:col-span-3">
											<label
												for="last-name"
												class="block text-sm font-medium text-gray-700">
												Friendly Name <RequiredSpan />
											</label>
											<input
												type="text"
												name="last-name"
												id="last-name"
												v-model="role.friendly_name"
												autocomplete="family-name"
												class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
											<ErrorSpanMessage
												v-if="
													errorValue &&
													errorValue.friendly_name
												">
												{{
													errorValue.friendly_name[0]
												}}
											</ErrorSpanMessage>
										</div>

										<div class="col-span-6">
											<label
												for="street-address"
												class="block text-sm font-medium text-gray-700">
												Description
											</label>
											<textarea
												row="4"
												type="text"
												v-model="role.description"
												name="street-address"
												id="street-address"
												autocomplete="street-address"
												class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
										</div>
										<div class="col-span-6">
											<div
												class="col-span-6"
												v-if="!defaultRole">
												<label
													for="street-address"
													class="block text-sm font-medium text-gray-700">
													Set as Global Role?
												</label>
												<SwitchToggle
													v-model="globalRole" />
											</div>
											<div class="col-span-6" v-else>
												<label
													for="street-address"
													class="block text-sm font-medium text-gray-700">
													Default
												</label>
												<SwitchToggle
													v-model="defaultRole"
													disabled />
											</div>
										</div>
									</div>
								</div>
								<div
									class="bg-gray-50 px-4 py-3 text-right sm:px-6">
									<button
										type="button"
										@click="handleClickSave"
										class="inline-flex justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
										Save
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>

			<div class="hidden sm:block" aria-hidden="true">
				<div class="py-5">
					<div class="border-t border-untitled-gray-200" />
				</div>
			</div>

			<GlobalWarningAlert
				v-if="errorValue && errorValue.privileges"
				:title="getTitlePrivilege()"
				:message="errorValue.privileges[0]"
				class="mb-5" />

			<div class="mt-10 sm:mt-0">
				<div class="px-4 sm:px-0">
					<h3 class="text-lg font-medium leading-6 text-gray-900">
						App Feature Privileges
					</h3>
					<p class="mt-1 text-sm text-gray-600">
						Lorem ipsum dolor, sit amet consectetur adipisicing
						elit. Explicabo in, harum fugiat aut voluptatibus illo
						eligendi
					</p>
				</div>
				<div class="px-4 sm:px-0">
					<RoleAppList
						v-if="!loadingRole"
						:role-id="roleId"
						@change-privilege="handleChangePrivilege"
						:role="role"
						@setPrivileges="handleSetPrivileges" />
				</div>
			</div>
		</div>
	</div>

	<global-popup-notification
		v-if="showNotif"
		:show-notification="showNotif"
		:message="messageNotif" />
</template>
<script setup>
import ErrorSpanMessage from '@/components/ErrorSpanMessage.vue';
import GlobalBreadCrumbs from '@/components/GlobalBreadCrumbs.vue';
import RequiredSpan from '@/components/RequiredSpan.vue';
import SelectUsers from '@/modules/companies/components/User/utilities/SelectUsers.vue';
import SelectCompanies from '@/modules/companies/utilities/SelectCompanies.vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { defineProps, computed, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeRole } from '../composables/store_role';
import { getRole } from '../composables/get_role';
import { updateRole } from '../composables/update_role';
import PageLoader from '@/components/loader/PageLoader.vue';
import SwitchToggle from '@/components/forms/SwitchToggle.vue';
import RoleAppList from '../components/privilege/RoleAppList.vue';
import GlobalWarningAlert from '@/components/GlobalWarningAlert.vue';

const props = defineProps({
	id: null,
});

const router = useRouter();

const roleId = computed(() => props.id);
const pages = [
	{
		name: 'Roles',
		to: {
			name: 'Roles Home Page',
		},
		current: false,
	},
	{
		name: roleId.value ? 'Edit' : 'Create',
		to: {
			name: roleId.value ? 'Edit Role Page' : 'Create Role Page',
			params: {
				id: roleId.value ? roleId.value : null,
			},
		},
		current: true,
	},
];

const role = ref({
	name: '',
	friendly_name: '',
	description: '',
	company: {},
	company_id: '',
	users: [],
	default: false,
	default: 0,
	privileges: [],
});

const privileges = ref([]);

const defaultRole = ref(false);
const globalRole = ref(false);

const errorValue = ref(null);
const errorMessage = ref(null);
const loadingRole = ref(false);
const showNotif = ref(false);
const messageNotif = ref(null);

const handleClearCompany = () => {
	role.value.company = {};
	role.value.company_id = '';
	role.value.users = [];
};

const handleClearUsers = () => {
	role.value.users = [];
};

const handleClickPreview = () => {
	router.push({ name: 'View Role Page', params: { id: roleId.value } });
};

const handleClickSave = () => {
	if (roleId.value) {
		editRole();
		return;
	}

	createRole();
};

const createRole = async () => {
	role.value.users = role.value.users.map((user) => user.id);
	role.value.company_id = role.value.company.id;
	defaultRole.value ? (role.value.default = 1) : (role.value.default = 0);
	globalRole.value ? (role.value.global = 1) : (role.value.global = 0);
	const { post, data, errorData, message } = storeRole(role.value);
	await post();
	errorValue.value = errorData.value;
	errorMessage.value = message.value;

	if (!data.value) {
		return;
	}
	notification('Successfully added!');
	router.push({ name: 'View Role Page', params: { id: data.value.id } });
};

const editRole = async () => {
	role.value.company_id =
		role.value.company && role.value.company.id
			? role.value.company.id
			: '';
	defaultRole.value ? (role.value.default = 1) : (role.value.default = 0);
	globalRole.value ? (role.value.global = 1) : (role.value.global = 0);
	const { post, data, errorData, message } = updateRole(role.value);
	await post();
	errorValue.value = errorData.value;
	errorMessage.value = message.value;

	if (!data.value) {
		return;
	}
	notification('Successfully updated!');
};

const getRoleById = async () => {
	loadingRole.value = true;
	const { load, data } = getRole(roleId.value);
	await load();
	role.value = data.value;
	data.value.default
		? (defaultRole.value = true)
		: (defaultRole.value = false);
	data.value.global ? (globalRole.value = true) : (globalRole.value = false);
	loadingRole.value = false;
};

const handleChangePrivilege = (privilegeId) => {};

const handleSetPrivileges = (privilegesData) => {};

const notification = (message) => {
	messageNotif.value = message;
	showNotif.value = true;
	setTimeout(() => {
		showNotif.value = false;
	}, 2000);
};

const getTitlePrivilege = () => {
	if (errorValue.value && errorValue.value.privileges) {
		return 'Privileges';
	}
};

onMounted(async () => {
	if (roleId.value) {
		await getRoleById();
	}
});
</script>
