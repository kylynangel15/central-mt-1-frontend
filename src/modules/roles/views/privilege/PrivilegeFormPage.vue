<template>
	<GlobalBreadCrumbs :pages="pages" />
	<PageLoader v-if="loading" />
	<div class="py-6" v-else>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<h1 class="text-2xl font-semibold text-untitled-gray-700">
				Privilege
				<span class="text-lg font-thin">{{
					privilegeId ? 'Edit' : 'Create'
				}}</span>
			</h1>
			<div class="relative mt-1 py-4 rounded-md">
				<button
					type="button"
					v-if="privilegeId"
					:disabled="loading"
					@click="handleClickPreview"
					class="inline-flex pb-1 float-right justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
					Preview
				</button>
				<router-link
					class="absolute text-untitled-gray-500 inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
					:to="{ name: 'Roles Home Page', query: { name: 'privileges'} }">
					<ArrowLeftIcon
						class="-ml-1 mr-2 h-5 w-5"
						aria-hidden="true" />
				</router-link>
				<label class="p-10 text-sm text-untitled-gray-500">Back</label>
			</div>
		</div>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<div class="hidden sm:block" aria-hidden="true">
				<div class="py-5">
					<div class="border-t border-gray-200" />
				</div>
			</div>

			<div class="mt-10 sm:mt-0">
				<div class="md:grid md:grid-cols-3 md:gap-6">
					<div class="md:col-span-1">
						<div class="px-4 sm:px-0">
							<h3
								class="text-lg font-medium leading-6 text-gray-900">
								Privilege Information
							</h3>
							<p class="mt-1 text-sm text-gray-600">
								Use a permanent address where you can receive
								mail.
							</p>
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
												Action name <RequiredSpan />
											</label>
											<input
												type="text"
												name="first-name"
												v-model="privilege.action_name"
												id="first-name"
												autocomplete="given-name"
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
											<ErrorSpanMessage
												v-if="
													errorValue &&
													errorValue.action_name
												">
												{{ errorValue.action_name[0] }}
											</ErrorSpanMessage>
										</div>

										<div class="col-span-6 sm:col-span-3">
											<label
												for="last-name"
												class="block text-sm font-medium text-gray-700">
												System Name <RequiredSpan />
											</label>
											<input
												type="text"
												v-model="privilege.system_name"
												name="last-name"
												id="last-name"
												autocomplete="family-name"
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
											<ErrorSpanMessage
												v-if="
													errorValue &&
													errorValue.system_name
												">
												{{ errorValue.system_name[0] }}
											</ErrorSpanMessage>
										</div>
										<div class="col-span-6">
											<SelectApp
												v-model="privilege.app"
												@clearFeature="
													handleClearApp
												" />
											<ErrorSpanMessage
												v-if="
													errorValue &&
													errorValue.app_feature_id
												">
												{{
													errorValue.app_feature_id[0]
												}}
											</ErrorSpanMessage>
										</div>
										<div class="col-span-5">
											<SelectFeature
												v-model="privilege.app_feature"
												:app-id="privilege.app && privilege.app.id ? parseInt(privilege.app.id) : null"
												@clearFeature="
													handleClearFeature
												" />
											<ErrorSpanMessage
												v-if="
													errorValue &&
													errorValue.app_feature_id
												">
												{{
													errorValue.app_feature_id[0]
												}}
											</ErrorSpanMessage>
										</div>
										<div
											class="col-span-1 flex items-center justify-center">
											<button
												type="button"
												@click="handleClickAddFeature"
												class="inline-flex items-center mt-5 rounded border border-transparent bg-untitled-gray-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
												Add feature
											</button>
										</div>

										<div class="col-span-6">
											<label
												for="description"
												class="block text-sm font-medium text-gray-700">
												Parent Privilege
											</label>
											<SelectPrivilege
												v-model="
													privilege.parent_privilege
												"
												:featureId="privilege.app_feature ? parseInt(privilege.app_feature.id) : null"
												:privilege-id="
													privilegeId
														? parseInt(privilegeId)
														: 0
												"
												:show-label="false"
												@clearPrivilege="
													handleClearParentPrivilege
												" />
										</div>
										<div class="col-span-6">
											<label
												for="description"
												class="block text-sm font-medium text-gray-700">
												Description
											</label>
											<textarea
												rows="4"
												type="text"
												v-model="privilege.description"
												name="description"
												id="description"
												autocomplete="description"
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
										</div>
										<div class="col-span-6">
											<label
												for="error_msg"
												class="block text-sm font-medium text-gray-700">
												Error Message
											</label>
											<textarea
												rows="4"
												type="text"
												v-model="privilege.error_msg"
												name="error_msg"
												id="error_msg"
												autocomplete="error_msg"
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
										</div>

										<div class="col-span-6">
											<label
												for="error_msg"
												class="block text-sm font-medium text-gray-700">
												Super Admin
											</label>

											<SwitchToggle
												v-model="
													privilege.is_superadmin
												" />
										</div>

										<div class="col-span-6">
											<label
												for="error_msg"
												class="block text-sm font-medium text-gray-700">
												Status
											</label>

											<SwitchToggle
												v-model="privilege.status" />
										</div>
									</div>
								</div>
								<div
									class="bg-gray-50 px-4 py-3 text-right sm:px-6">
									<button
										type="button"
										@submit="savePrivilege()"
										@click="savePrivilege()"
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
					<div class="border-t border-gray-200" />
				</div>
			</div>
		</div>
	</div>

	<global-popup-notification
		v-if="showNotification"
		:show-notification="showNotification"
		:message="messageNotification" />

	<AddFeatureModal
		v-if="openAddFeatureModal"
		:open-modal="openAddFeatureModal"
		@close-modal="handleCloseModal"
		@addFeature="handleAddFeature" />
</template>
<script setup>
import SwitchToggle from '@/components/forms/SwitchToggle.vue';
import GlobalBreadCrumbs from '@/components/GlobalBreadCrumbs.vue';
import PageLoader from '@/components/loader/PageLoader.vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { defineProps, computed, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getPrivilege } from '../../composables/privilege/get_privilege';
import { storePrivilege } from '../../composables/privilege/store_privilege';
import { updatePrivilege } from '../../composables/privilege/update_privilege';
import { notificationMessage } from '@/composables/notifications';
import ErrorSpanMessage from '@/components/ErrorSpanMessage.vue';
import SelectFeature from '@/modules/app/utilities/SelectFeature.vue';
import SelectPrivilege from '../../utilities/SelectPrivilege.vue';
import RequiredSpan from '@/components/RequiredSpan.vue';
import AddFeatureModal from '@/modules/app/components/feature/AddFeatureModal.vue';
import { useEmitter } from '@/composables/useEmitter';
import SelectApp from '@/modules/app/utilities/SelectApp.vue'

const props = defineProps({
	id: null,
});

const router = useRouter();
const emitter = useEmitter;
const privilegeId = computed(() => props.id);
const loading = ref(false);
const loadingSave = ref(false);
const privilege = ref({
	action_name: '',
	system_name: '',
	description: '',
	error_msg: '',
	status: '',
	app_feature: {},
	status: true,
	is_superadmin: false,
	parent_privilege: {},
	app: {}
});
const errorValue = ref(null);
const errorMessage = ref(null);
const showNotification = ref(false);
const messageNotification = ref(null);
const openAddFeatureModal = ref(false);
const pages = [
	{
		name: 'Roles / Privileges',
		to: {
			name: 'Roles Home Page',
		},
		current: false,
	},
	{
		name: privilegeId.value ? 'Edit' : 'Create',
		to: {
			name: privilegeId.value
				? 'Edit Privilege Page'
				: 'Create Privilege Page',
			params: {
				id: privilegeId.value ? privilegeId.value : null,
			},
		},
		current: true,
	},
];

const savePrivilege = () => {
	if (privilege.value && privilege.value.id && privilegeId.value) {
		editPrivilege();
		return;
	}

	createPrivilege();
};

const createPrivilege = async () => {
	loadingSave.value = true;
	privilege.value.app_feature_id =
		privilege.value.app_feature && privilege.value.app_feature.id
			? privilege.value.app_feature.id
			: null;
	privilege.value.privilege_id =
		privilege.value.parent_privilege && privilege.value.parent_privilege.id
			? privilege.value.parent_privilege.id
			: null;
	privilege.value.is_superadmin = privilege.value.is_superadmin ? 1 : 0;
	const { post, data, errorData, message } = storePrivilege(privilege.value);
	await post();
	loadingSave.value = false;
	errorValue.value = errorData.value;
	errorMessage.value = message.value;

	if (!data.value) {
		return;
	}
	notification(notificationMessage.add);
	router.push({ name: 'Edit Privilege Page', params: { id: data.value.id } });
};

const editPrivilege = async () => {
	loadingSave.value = true;
	privilege.value.app_feature_id =
		privilege.value.app_feature && privilege.value.app_feature.id
			? privilege.value.app_feature.id
			: null;
	privilege.value.privilege_id =
		privilege.value.parent_privilege && privilege.value.parent_privilege.id
			? privilege.value.parent_privilege.id
			: null;
	privilege.value.is_superadmin = privilege.value.is_superadmin ? 1 : 0;
	const { update, data, errorData, message } = updatePrivilege(
		privilege.value,
		privilegeId.value
	);
	await update();
	loadingSave.value = false;
	errorValue.value = errorData.value;
	errorMessage.value = message.value;

	if (!data.value) {
		return;
	}

	notification(notificationMessage.update);
};

const fetchPrivilege = async () => {
	loading.value = true;
	const { load, data } = getPrivilege(privilegeId.value);
	await load();
	privilege.value = data.value;
	privilege.value.status = privilege.value.status ? true : false;
	privilege.value.is_superadmin = privilege.value.is_superadmin
		? true
		: false;
	loading.value = false;
};

const notification = (message) => {
	messageNotification.value = message;
	showNotification.value = true;
	setTimeout(() => {
		showNotification.value = false;
	}, 2000);
};

const handleClearFeature = () => {
	privilege.value.app_feature = {};
};

const handleClearApp = () => {
	privilege.value.app = {}
}

const handleClearParentPrivilege = () => {
	privilege.value.parent_privilege = {};
};

const handleClickPreview = () => {
	router.push({
		name: 'View Privilege Page',
		params: { id: privilegeId.value },
	});
};

const handleClickAddFeature = () => {
	openAddFeatureModal.value = true;
};

const handleCloseModal = () => {
	openAddFeatureModal.value = false;
};

const handleAddFeature = (feature) => {
	openAddFeatureModal.value = false;
	emitter.emit('ADD_FEATURE', feature)
}

onMounted(async () => {
	if (privilegeId.value) {
		await fetchPrivilege();
	}
});
</script>
