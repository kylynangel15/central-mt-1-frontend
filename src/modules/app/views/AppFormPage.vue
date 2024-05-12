<template>
	<GlobalBreadCrumbs :pages="pages" />
	<div class="py-6">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 xs:mb-4 mb-8">
			<button
				type="button"
				:disabled="loadingSave"
				@click="saveApp()"
				class="inline-flex mr-2 float-right justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
				{{ loadingSave ? 'Saving...' : 'Save' }}
			</button>
			<router-link
				:to="{ name: 'App Home Page' }"
				class="inline-flex float-right justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-untitled-gray-500 shadow-lg mr-2 hover:bg-untitled-gray-100 focus:outline-none focus:ring-2 focus:ring-untitled-gray-400 focus:ring-offset-2">
				Cancel
			</router-link>
			<button
				type="button"
				v-if="appId"
				:disabled="loading"
				@click="handleClickPreview"
				class="inline-flex float-right justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 mr-2 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
				Preview
			</button>

			<h1 class="text-2xl font-semibold text-gray-900">
				App
				<span class="text-lg font-thin">{{
					appId ? 'Edit' : 'Create'
				}}</span>
			</h1>
			<div class="relative mt-1 py-1 rounded-md">
				<router-link
					class="absolute text-untitled-gray-500 inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
					:to="{ name: 'App Home Page' }">
					<ArrowLeftIcon
						class="-ml-1 mr-2 h-5 w-5"
						aria-hidden="true" />
				</router-link>
				<label class="pl-10 text-sm text-untitled-gray-500">Back</label>
			</div>
		</div>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<div>
				<div class="md:grid md:grid-cols-3 md:gap-6">
					<div class="md:col-span-1">
						<div class="px-4 sm:px-0">
							<h3
								class="text-lg font-medium leading-6 text-gray-900">
								Thumbnail Photo
							</h3>
						</div>
					</div>
					<div class="mt-5 md:col-span-2 md:mt-0">
						<form action="#" method="POST">
							<div
								class="shadow sm:overflow-hidden sm:rounded-md">
								<div
									class="space-y-6 bg-white px-4 py-5 sm:p-6">
									<div>
										<label
											class="block text-sm font-medium text-gray-700"
											>Thumbnail Photo
										</label>
										<div
											v-if="!hasCoverImage"
											class="mt-1 flex w-full mx-auto rounded-md px-6 pt-5 pb-6">
											<ProfileUploader
												@file="handleCoverPhoto"
												:label="'Drop your cover photo or click to browse your computer'"
												@removeFile="
													handleRemoveCoverPhoto
												" />
										</div>
										<div v-else>
											<div
												class="mt-1 flex aspect-w-96 max-h-80 mx-auto rounded-md px-6 pt-5 pb-6">
												<img
													class="object-cover w-full mx-auto"
													:src="app.thumbnail_photo"
													alt="" />
											</div>
											<div
												class="aspect-w-96 mx-auto text-center">
												<button
													@click="
														handleClickChangeCoverPhoto
													"
													class="inline-flex justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
													Change Cover Photo
												</button>
											</div>
										</div>
									</div>
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
			<div>
				<div class="md:grid md:grid-cols-3 md:gap-6">
					<div class="md:col-span-1">
						<div class="px-4 sm:px-0">
							<h3
								class="text-lg font-medium leading-6 text-gray-900">
								Profile
							</h3>
						</div>
					</div>
					<div class="mt-5 md:col-span-2 md:mt-0">
						<form action="#" method="POST">
							<div
								class="shadow sm:overflow-hidden sm:rounded-md">
								<div
									class="space-y-6 bg-white px-4 py-5 sm:p-6">
									<div>
										<label
											class="block text-sm font-medium text-gray-700"
											>Profile</label
										>
										<div
											v-if="!hasProfilePhoto"
											class="mt-1 flex w-96 mx-auto rounded-md px-6 pt-5 pb-6">
											<ProfileUploader
												:label="'Drop your profile photo or click to browse your computer'"
												@file="handleProfileFile"
												@removeFile="
													handleRemoveFile
												" />
										</div>
										<div v-else>
											<div
												class="mt-1 flex aspect-w-96 max-h-80 mx-auto rounded-md px-6 pt-5 pb-6">
												<img
													class="object-cover w-96 mx-auto"
													:src="app.profile_photo"
													alt="" />
											</div>
											<div
												class="aspect-w-96 mx-auto text-center">
												<button
													@click="
														handleClickChangeProfile
													"
													class="inline-flex justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
													Change Profile
												</button>
											</div>
										</div>
									</div>
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

			<div class="mt-10 sm:mt-0">
				<div class="md:grid md:grid-cols-3 md:gap-6">
					<div class="md:col-span-1">
						<div class="px-4 sm:px-0">
							<h3
								class="text-lg font-medium leading-6 text-gray-900">
								App Information
							</h3>
							<p class="mt-1 text-sm text-gray-600">
								Please fill out the required fields.
							</p>
						</div>
					</div>
					<div class="mt-5 md:col-span-2 md:mt-0">
						<form>
							<div class="overflow-hidden shadow sm:rounded-md">
								<div class="bg-white px-4 py-5 sm:p-6">
									<div class="grid grid-cols-6 gap-6">
										<div class="col-span-6 sm:col-span-3">
											<label
												for="first-name"
												class="block text-sm font-medium text-gray-700"
												>Name <RequiredSpan
											/></label>
											<input
												type="text"
												v-model="app.name"
												placeholder="Enter app name"
												name="first-name"
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
												Version
											</label>
											<input
												type="text"
												placeholder="Enter app version"
												v-model="app.version"
												name="last-name"
												id="last-name"
												autocomplete="family-name"
												class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
											<ErrorSpanMessage
												v-if="
													errorValue &&
													errorValue.version
												">
												{{ errorValue.version[0] }}
											</ErrorSpanMessage>
										</div>

										<div class="col-span-6 sm:col-span-6">
											<label
												for="email-address"
												class="block text-sm font-medium text-gray-700">
												Redirect <RequiredSpan />
											</label>
											<input
												type="text"
												placeholder="Enter redirect link"
												v-model="app.redirect"
												name="email-address"
												id="email-address"
												autocomplete="email"
												class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
											<ErrorSpanMessage
												v-if="
													errorValue &&
													errorValue.redirect
												">
												{{ errorValue.redirect[0] }}
											</ErrorSpanMessage>
										</div>

										<div
											class="col-span-6 sm:col-span-6"
											v-if="!appId">
											<label
												for="country"
												class="block text-sm font-medium text-gray-700"
												>Company
											</label>
											<span
												class="text-xs py-2 text-untitled-gray-500">
												<input
													type="checkbox"
													v-model="selectAll"
													name=""
													id=""
													class="my-2 bg-untitled-gray-50" />
												Select All Company?
											</span>
											<SelectCompanies
												v-if="!selectAll"
												v-model="app.companies"
												:show-label="false"
												@clearCompany="
													handleClearCompany
												"
												:show-all-company="true"
												:is-multiple="true" />
											<ErrorSpanMessage
												v-if="
													errorValue &&
													errorValue.companies
												">
												{{ errorValue.companies[0] }}
											</ErrorSpanMessage>
										</div>
										<div class="col-span-6">
											<label
												for="street-address"
												class="block text-sm font-medium text-gray-700">
												Secret <RequiredSpan />
											</label>
											<input
												type="text"
												placeholder="Enter app secret"
												v-model="app.secret"
												name="street-address"
												id="street-address"
												autocomplete="street-address"
												class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
											<ErrorSpanMessage
												v-if="
													errorValue &&
													errorValue.secret
												">
												{{ errorValue.secret[0] }}
											</ErrorSpanMessage>
										</div>

										<div class="col-span-6">
											<label
												for="street-address"
												class="block text-sm font-medium text-gray-700">
												Description
											</label>
											<textarea
												rows="4"
												placeholder="Enter app description"
												v-model="app.description"
												name="street-address"
												id="street-address"
												autocomplete="street-address"
												class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
											<ErrorSpanMessage
												v-if="
													errorValue &&
													errorValue.description
												">
												{{ errorValue.description[0] }}
											</ErrorSpanMessage>
										</div>
										<div class="col-span-6">
											<label
												for="street-address"
												class="block text-sm font-medium text-gray-700">
												Active
											</label>
											<SwitchToggle v-model="app.active"/>
										</div>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>

				<div
					class=" py-3 text-right">
					<router-link
						:to="{ name: 'App Home Page' }"
						class="inline-flex justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-untitled-gray-500 shadow-lg mr-2 hover:bg-untitled-gray-100 focus:outline-none focus:ring-2 focus:ring-untitled-gray-400 focus:ring-offset-2">
						Cancel
					</router-link>

					<button
						type="button"
						:disabled="loadingSave"
						@click="saveApp()"
						class="inline-flex justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
						{{ loadingSave ? 'Saving...' : 'Save' }}
					</button>
				</div>
			</div>

			<div class="hidden sm:block" aria-hidden="true">
				<div class="py-5">
					<div class="border-t border-untitled-gray-200" />
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
import { ref, onMounted, computed, defineProps, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeApp } from '../composables/store_apps';
import { updateApp } from '../composables/update_apps';
import { loadAppById } from '../composables/get_app_by_id';
import ProfileUploader from '@/components/uploader/ProfileUploader.vue';
import GlobalBreadCrumbs from '@/components/GlobalBreadCrumbs.vue';
import SelectCompanies from '@/modules/companies/utilities/SelectCompanies.vue';
import RequiredSpan from '@/components/RequiredSpan.vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import SwitchToggle from '@/components/forms/SwitchToggle.vue';

const props = defineProps({
	id: null,
});

const router = useRouter();

const appId = computed(() => props.id);

const showNotif = ref(false);
const messageNotif = ref(null);

const loadingSave = ref(false);
const loading = ref(false);
const selectAll = ref(false);
const app = ref({
	id: '',
	name: '',
	version: '',
	secret: '',
	description: '',
	profile_photo: null,
	thumbnail_photo: null,
	companies: [],
	redirect: '',
	active: false
});

const hasProfilePhoto = ref(false);
const hasCoverImage = ref(false);
const errorValue = ref(null);
const errorMessage = ref(null);

const pages = computed({
	get() {
		return [
			{
				name: 'Apps',
				to: {
					name: 'App Home Page',
				},
				current: false,
			},
			{
				name: appId.value ? 'Edit' : 'Create',
				to: {
					name: appId.value ? 'Edit App Page' : 'Create App Page',
					params: {
						id: appId.value,
					},
				},
				current: false,
			},
		];
	},
	set(newValue) {
		newValue;
	},
});

const saveApp = () => {
	if (appId.value) {
		editApp();
		return;
	}

	createApp();
};

const createApp = async () => {
	loadingSave.value = true;
	const form = initializeForm();
	const { post, data, errorData, message } = storeApp(form);
	await post();
	errorValue.value = errorData.value;
	errorMessage.value = message.value;
	loadingSave.value = false;
	if (!data.value) {
		return;
	}
	notification('Successfully added!');

	router.push({ name: 'View App Page', params: { id: data.value.id } });
};

const editApp = async () => {
	loadingSave.value = true;
	const form = initializeForm();
	const { update, data, errorData, message } = updateApp(form, appId.value);
	await update();
	errorValue.value = errorData.value;
	errorMessage.value = message.value;
	loadingSave.value = false;
	if (!data.value) {
		return;
	}
	notification('Successfully updated!');
};

const initializeForm = () => {
	let formData = new FormData();
	formData.append(
		'profile_photo',
		app.value.profile_photo ? app.value.profile_photo : ''
	);
	formData.append(
		'thumbnail_photo',
		app.value.thumbnail_photo ? app.value.thumbnail_photo : ''
	);
	formData.append('name', app.value.name ? app.value.name : '');
	formData.append('version', app.value.version ? app.value.version : '');
	formData.append(
		'companies',
		app.value.companies ? app.value.companies : ''
	);
	formData.append('secret', app.value.secret ? app.value.secret : '');
	formData.append(
		'description',
		app.value.description ? app.value.description : ''
	);
	formData.append('redirect', app.value.redirect ? app.value.redirect : '');
	formData.append('active', app.value.active ? 1 : 0);

	if (selectAll.value) {
		formData.append('companies', 'all');
	}

	if (!appId.value && !selectAll.value) {
		formData.append(
			'companies',
			app.value.companies.length > 0
				? JSON.stringify(app.value.companies)
				: ''
		);
	}

	if (appId.value) {
		formData.append('id', appId.value);
		formData.append('_method', 'PUT');
	}

	return formData;
};

const getAppById = async () => {
	loading.value = true;
	const { load, data } = loadAppById(appId.value);
	await load();
	app.value = data.value;
	app.value.active = data.value.active ? true : false
	loading.value = false;
};

const handleProfileFile = (file) => {
	app.value.profile_photo = file[0];
};

const handleRemoveFile = () => {
	app.value.profile_photo = null;
};

const handleClickChangeProfile = () => {
	hasProfilePhoto.value = false;
};

const handleCoverPhoto = (file) => {
	app.value.thumbnail_photo = file[0];
};

const handleRemoveCoverPhoto = () => {
	app.value.thumbnail_photo = '';
};

const handleClickChangeCoverPhoto = () => {
	hasCoverImage.value = false;
};

const handleClearCompany = () => {
	app.value.companies = [];
};

const notification = (message) => {
	messageNotif.value = message;
	showNotif.value = true;
	setTimeout(() => {
		showNotif.value = false;
	}, 2000);
};

const handleClickPreview = () => {
	router.push({ name: 'View App Page', params: { id: appId.value } });
};

onMounted(async () => {
	if (appId.value) {
		await getAppById();
		
		if(app.value.active == 1) {
			app.value.active = true
		}
	}

	if (typeof app.value.profile_photo === 'string') {
		hasProfilePhoto.value = true;
	}

	if (typeof app.value.thumbnail_photo === 'string') {
		hasCoverImage.value = true;
	}
});

watch(appId, () => {
	getAppById();
});
</script>
