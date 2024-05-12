<template>
	<GlobalBreadCrumbs :pages="pages" />
	<div class="py-6">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<h1 class="text-2xl font-semibold text-untitled-gray-700">
				Users
				<span class="text-lg font-thin">{{
					userId ? 'Edit' : 'Create'
				}}</span>
			</h1>
			<div class="relative mt-1 py-4 rounded-md">
				<router-link
					class="absolute text-untitled-gray-500 inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
					:to="{
						name: 'Company Details Page',
						params: { id: companyId },
					}">
					<ArrowLeftIcon
						class="-ml-1 mr-2 h-5 w-5"
						aria-hidden="true" />
				</router-link>
				<label class="p-10 text-sm text-untitled-gray-500">Back</label>

				<button
					type="button"
					:disabled="loading"
					@click="handleClickSave"
					class="inline-flex float-right justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
					{{ loading ? 'Saving...' : 'Save' }}
				</button>
				<router-link
					:to="{
						name: 'Company Details Page',
						params: { id: companyId },
					}"
					class="inline-flex float-right justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-untitled-gray-500 shadow-lg mr-2 hover:bg-untitled-gray-100 focus:outline-none focus:ring-2 focus:ring-untitled-gray-400 focus:ring-offset-2">
					Cancel
				</router-link>
				<button
					type="button"
					v-if="userId"
					:disabled="loading"
					@click="handleClickPreview"
					class="inline-flex mr-2 float-right justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
					Preview
				</button>
			</div>
		</div>

		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<div class="py-4">
				<div class="p-4 h-full" v-if="!loadingUser">
					<div class="md:grid md:grid-cols-3 md:gap-6">
						<div class="md:col-span-1">
							<div class="px-4 sm:px-0">
								<h3
									class="text-lg font-medium leading-6 text-gray-900">
									Cover Photo
								</h3>
							</div>
						</div>
						<div class="mt-5 md:col-span-2 md:mt-0">
							<div class="shadow sm:rounded-md">
								<div
									class="space-y-6 shadow-lg bg-white px-4 py-5 sm:p-6">
									<div>
										<label
											class="block text-sm font-medium text-gray-700"
											>Cover Photo</label
										>
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
													:src="user.cover_photo"
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
						</div>
					</div>
				</div>
				<div class="hidden sm:block" aria-hidden="true">
					<div class="py-5">
						<div class="border-t border-gray-200" />
					</div>
				</div>
				<div class="p-4 h-full" v-if="!loadingUser">
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
							<div class="shadow sm:rounded-md">
								<div
									class="space-y-6 shadow-lg bg-white px-4 py-5 sm:p-6">
									<div>
										<label
											class="block text-sm font-medium text-gray-700"
											>Profile</label
										>
										<div
											v-if="!hasProfileImage"
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
													:src="user.profile_photo"
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
						</div>
					</div>
				</div>

				<div class="hidden sm:block" aria-hidden="true">
					<div class="py-5">
						<div class="border-t border-gray-200" />
					</div>
				</div>

				<div class="mt-10 sm:mt-0 px-4 py-4" v-if="!loadingUser">
					<div class="md:grid md:grid-cols-3 md:gap-6">
						<div class="md:col-span-1">
							<div class="px-4 sm:px-0">
								<h3
									class="text-lg font-medium leading-6 text-gray-900">
									Personal Information
								</h3>
								<p class="mt-1 text-sm text-gray-600">
									Please fill out the required fields.
								</p>
							</div>
						</div>
						<div class="mt-5 md:col-span-2 md:mt-0">
							<form action="#" method="POST">
								<div class="shadow sm:rounded-md">
									<div
										class="bg-white shadow-lg px-4 py-5 sm:p-6">
										<div class="grid grid-cols-6 gap-6">
											<div
												class="col-span-6 sm:col-span-6">
												<label
													for="first-name"
													class="block text-sm font-medium text-gray-700"
													>Name <RequiredSpan />
												</label>
												<input
													type="text"
													v-model="user.name"
													name="first-name"
													id="first-name"
													autocomplete="given-name"
													placeholder="Enter your full name"
													class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
												<ErrorSpanMessage
													v-if="
														errorValue &&
														errorValue.name
													">
													{{ errorValue.name[0] }}
												</ErrorSpanMessage>
											</div>

											<div
												class="col-span-6 sm:col-span-6">
												<label
													for="email-address"
													class="block text-sm font-medium text-gray-700"
													>Email address
													<RequiredSpan />
												</label>
												<div
													class="relative mt-1 rounded-md shadow-sm">
													<div
														class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
														<EnvelopeIcon
															class="h-5 w-5 text-gray-400"
															aria-hidden="true" />
													</div>
													<input
														type="email"
														name="email"
														v-model="user.email"
														id="email"
														class="block w-full rounded-md border-untitled-gray-300 pl-10 focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm"
														placeholder="you@example.com" />
												</div>
												<ErrorSpanMessage
													v-if="
														errorValue &&
														errorValue.email
													">
													{{ errorValue.email[0] }}
												</ErrorSpanMessage>
											</div>

											<div
												class="col-span-6 sm:col-span-3">
												<label
													for="email-address"
													class="block text-sm font-medium text-gray-700">
													Phone Number
												</label>
												<SelectPhoneNumber
													v-model="phoneNumber"
													:phone="
														user.phone_number
															? `+${user.phone_code}${user.phone_number}`
															: ''
													" />
												<ErrorSpanMessage
													v-if="
														errorValue &&
														errorValue.phone_number
													">
													{{
														errorValue
															.phone_number[0]
													}}
												</ErrorSpanMessage>
											</div>

											<div
												class="col-span-6 sm:col-span-3">
												<SelectRoles
													v-model="user.roles"
													@clearRoles="
														handleRemoveSelectedRoles
													"
													:is-required="true" />
												<ErrorSpanMessage
													v-if="
														errorValue &&
														errorValue.roles
													">
													{{ errorValue.roles[0] }}
												</ErrorSpanMessage>
											</div>

											<div
												class="col-span-6 sm:col-span-3">
												<SelectCompanies
													v-model="user.company"
													:is-required="true"
													:isDisabled="
														companyId &&
														!isAdministrator
															? true
															: false
													"
													@clearCompany="
														handleClearCompany
													" />
												<ErrorSpanMessage
													v-if="
														errorValue &&
														errorValue.company_id
													">
													{{
														errorValue.company_id[0]
													}}
												</ErrorSpanMessage>
											</div>
											<div
												class="col-span-6 sm:col-span-3"
												v-if="
													!loadingCompany ||
													(user.company &&
														user.company.id)
												">
												<SelectStore
													v-model="user.store"
													:company-id="
														parseInt(
															user.company.id
														)
													"
													@clearStore="
														handleClearStore
													" />
												<ErrorSpanMessage
													v-if="
														errorValue &&
														errorValue.store_id
													">
													{{ errorValue.store_id[0] }}
												</ErrorSpanMessage>
											</div>
											<div
												class="col-span-6 sm:col-span-3"
												v-if="userId">
												<SelectStatus
													v-model="user.status"
													:is-required="true" />
												<ErrorSpanMessage
													v-if="
														errorValue &&
														errorValue.status
													">
													{{ errorValue.status[0] }}
												</ErrorSpanMessage>
											</div>
											<div
												:class="[
													'col-span-6',
													userId
														? 'sm:col-span-3'
														: 'sm:col-span-6',
												]">
												<SelectTag
													v-model="user.tags"
													:is-multiple="true"
													:company-id="
														parseInt(
															user.company.id
														)
													"
													@clearTag="
														handleClearTag
													" />
											</div>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>

				<div class="hidden sm:block" aria-hidden="true" v-if="userId">
					<div class="py-5">
						<div class="border-t border-gray-200" />
					</div>
				</div>

				<div class="mt-10 sm:mt-0" v-if="userId && !loadingUser">
					<div class="md:grid md:grid-cols-3 md:gap-6">
						<div class="md:col-span-1">
							<div class="px-4 sm:px-0">
								<h3
									class="text-lg font-medium leading-6 text-gray-900">
									Authentication Information
								</h3>
								<p class="mt-1 text-sm text-gray-600">
									Use a permanent address where you can
									receive mail.
								</p>
							</div>
						</div>
						<div class="mt-5 md:col-span-2 md:mt-0">
							<form>
								<div class="shadow sm:rounded-md">
									<div class="bg-white px-4 py-5 sm:p-6">
										<div class="grid grid-cols-6 gap-6">
											<div
												class="col-span-6 sm:col-span-6">
												<label
													for="first-name"
													class="block text-sm font-medium text-gray-700"
													>New Password
												</label>
												<div
													class="relative mt-1 rounded-md shadow-sm">
													<div
														class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
														<LockClosedIcon
															class="h-5 w-5 text-gray-400"
															aria-hidden="true" />
													</div>
													<input
														:type="
															showNewPassword
																? 'text'
																: 'password'
														"
														v-model="user.password"
														name="password"
														id="password"
														class="block w-full rounded-md border-untitled-gray-300 pl-10 focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm"
														placeholder="Enter your password" />
													<div
														class="absolute inset-y-0 right-0 flex items-center pr-3">
														<component
															:is="passwordIcon"
															@click="
																handleClickViewPassword
															"
															class="h-5 w-5 text-gray-400 cursor-pointer"
															aria-hidden="true" />
													</div>
												</div>
												<ErrorSpanMessage
													v-if="
														errorValue &&
														errorValue.password
													">
													{{ errorValue.password[0] }}
												</ErrorSpanMessage>
											</div>

											<div
												class="col-span-6 sm:col-span-6">
												<label
													for="email-address"
													class="block text-sm font-medium text-gray-700">
													Confirm Password
												</label>
												<div
													class="relative mt-1 rounded-md shadow-sm">
													<div
														class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
														<LockClosedIcon
															class="h-5 w-5 text-gray-400"
															aria-hidden="true" />
													</div>
													<input
														:type="
															showPasswordConfirmation
																? 'text'
																: 'password'
														"
														v-model="
															user.confirm_password
														"
														name="confirm_password"
														id="confirm_password"
														class="block w-full rounded-md border-untitled-gray-300 pl-10 focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm"
														placeholder="Confirm your password" />
													<div
														class="absolute inset-y-0 right-0 flex items-center pr-3">
														<component
															:is="
																passwordConfirmationIcon
															"
															@click="
																handleClickViewPasswordConfirmation
															"
															class="h-5 w-5 text-gray-400 cursor-pointer"
															aria-hidden="true" />
													</div>
												</div>
												<ErrorSpanMessage
													v-if="
														errorValue &&
														errorValue.confirm_password
													">
													{{
														errorValue
															.confirm_password[0]
													}}
												</ErrorSpanMessage>
											</div>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>

			<div class="px-4 pb-3 text-right sm:px-6">
				<router-link
					:to="{
						name: 'Company Details Page',
						params: { id: companyId },
					}"
					class="inline-flex justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-untitled-gray-500 shadow-lg mr-2 hover:bg-untitled-gray-100 focus:outline-none focus:ring-2 focus:ring-untitled-gray-400 focus:ring-offset-2">
					Cancel
				</router-link>
				<button
					type="button"
					:disabled="loading"
					@click="handleClickSave"
					class="inline-flex justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
					{{ loading ? 'Saving...' : 'Save' }}
				</button>
			</div>
		</div>
	</div>

	<global-popup-notification
		v-if="showNotif"
		:show-notification="showNotif"
		:message="messageNotif" />
</template>
<script setup>
import SelectPhoneNumber from '@/components/forms/SelectPhoneNumber.vue';
import ProfileUploader from '@/components/uploader/ProfileUploader.vue';
import SelectRoles from '@/modules/roles/utilities/SelectRoles.vue';
import {
	defineProps,
	computed,
	ref,
	onMounted,
	watch,
} from 'vue';
import SelectCompanies from '../../utilities/SelectCompanies.vue';
import { storeUser } from '../../composables/user/store_user';
import ErrorSpanMessage from '@/components/ErrorSpanMessage.vue';
import { useRoute, useRouter } from 'vue-router';
import {
	ArrowLeftIcon,
	EnvelopeIcon,
	EyeIcon,
	LockClosedIcon,
	EyeSlashIcon,
} from '@heroicons/vue/24/outline';
import { getUser } from '../../composables/user/get_user';
import { getCompaniesById } from '../../composables/get_company_byId';
import { useAdminSettingStore } from '@/store/useAdminSettingStore';
import { HomeIcon } from '@heroicons/vue/20/solid';
import SelectStore from '../store/utilities/SelectStore.vue';
import { updateUser } from '../../composables/user/update_user';
import GlobalBreadCrumbs from '@/components/GlobalBreadCrumbs.vue';
import SelectStatus from '../../utilities/user/SelectStatus.vue';
import RequiredSpan from '@/components/RequiredSpan.vue';
import SelectTag from '@/modules/tags/utilities/SelectTag.vue';

const props = defineProps({
	id: null,
	userId: null,
});


const route = useRoute();
const router = useRouter();

const adminSettingStore = useAdminSettingStore();

const companyId = computed(() => props.id);
const userId = computed(() => props.userId);
const companyName = ref(null);
const loadingCompany = ref(true);

const phoneNumber = ref({});

const user = ref({
	roles: [],
	company: {},
	phoneNumber: '',
	profile_photo: null,
	name: '',
	company_id: null,
	phone_number: '',
	phone_code: '',
	phone_country: '',
	status: 'ACTIVE',
	store: {},
	cover_photo: null,
	tags: [],
});
const isAdministrator = computed(() => adminSettingStore.isAdministrator);
const loadingUser = ref(false);
const showNotif = ref(false);
const messageNotif = ref(null);

const errorValue = ref(null);
const errorMessage = ref(null);
const loading = ref(false);

const showNewPassword = ref(false);
const showPasswordConfirmation = ref(false);
const passwordIcon = ref(EyeIcon);
const passwordConfirmationIcon = ref(EyeIcon);

const pages = [
	{
		name: 'Companies',
		to: {
			name: 'Company Home Page',
		},
		current: false,
	},
	{
		name: 'Users',
		to: {
			name: 'Company Details Page',
			params: {
				id: companyId.value,
			},
			query: {
				tab: 'Users',
			},
		},
		current: true,
	},
	{
		name: userId.value ? 'Edit' : 'Create',
		to: {
			name: userId.value
				? 'Edit Company User Page'
				: 'Create Company User Page',
			params: {
				id: companyId.value,
				userId: userId.value ? userId.value : null,
			},
		},
		current: true,
	},
];

const hasProfileImage = ref(false);
const hasCoverImage = ref(false);

const handleProfileFile = (file) => {
	user.value.profile_photo = file[0];
};

const handleCoverPhoto = (file) => {
	user.value.cover_photo = file[0];
};

const handleRemoveFile = () => {
	user.value.profile_photo = null;
};

const handleRemoveCoverPhoto = () => {
	user.value.cover_photo = null;
};

const handleRemoveSelectedRoles = () => {
	user.value.roles = [];
};

const handleClickSave = async () => {
	if (userId.value) {
		await editUser();
		return;
	}

	await createUser();
};

const handleClickPreview = () => {
	router.push({
		name: 'View Company User Page',
		params: {
			id: user.value.company.id,
			userId: userId.value,
		},
	});
};

const createUser = async () => {
	loading.value = true;
	user.value.phone_number = phoneNumber.value.formatted

	if (companyId.value) {
		user.value.company_id = companyId.value;
	}

	if (phoneNumber.value && phoneNumber.value.nationalNumber) {
		user.value.phone_number = phoneNumber.value.nationalNumber;
		user.value.phone_code = phoneNumber.value.countryCallingCode;
		user.value.phone_country = phoneNumber.value.countryCode;
	}

	const form = initializeForm();

	const { post, data, errorData, message } = storeUser(form);
	await post();
	loading.value = false;
	errorValue.value = errorData.value;
	errorMessage.value = message.value;
	if (!data.value) {
		return;
	}

	notification('Successfully added!');

	if (data.value.profile_photo) {
		hasProfileImage.value = true;
	}

	if (data.value.cover_photo) {
		hasCoverImage.value = true;
	}

	router.push({
		name: 'Edit Company User Page',
		params: {
			id: companyId.value,
			userId: data.value.id,
		},
	});
};

const editUser = async () => {
	loading.value = true;
	user.value.phone_number = phoneNumber.value.formatted

	if (companyId.value) {
		user.value.company_id = companyId.value;
	}

	if (phoneNumber.value.nationalNumber) {
		user.value.phone_number = phoneNumber.value.nationalNumber;
		user.value.phone_code = phoneNumber.value.countryCallingCode;
		user.value.phone_country = phoneNumber.value.countryCode;
	}

	const form = initializeForm();

	const { update, data, errorData, message } = updateUser(form, userId.value);
	await update();
	loading.value = false;

	errorValue.value = errorData.value;
	errorMessage.value = message.value;
	if (!data.value) {
		return;
	}

	if (data.value.profile_photo) {
		hasProfileImage.value = true;
	}

	if (data.value.cover_photo) {
		hasCoverImage.value = true;
	}

	// user.value = data.value;

	userId.value = data.value.id;

	notification('Successfully updated!');
};

const handleClearStore = () => {
	user.value.store = {};
	user.value.store_id = '';
};

const handleClearCompany = () => {
	user.value.company = {};
	user.value.company_id = '';
	user.value.store = {};
	user.value.store_id = '';
};

const initializeForm = () => {
	const formData = new FormData();

	formData.append('name', user.value.name);
	formData.append('id', userId.value ? userId.value : '');
	formData.append(
		'roles',
		user.value.roles.length > 0 ? JSON.stringify(user.value.roles) : ''
	);
	formData.append('email', user.value.email ? user.value.email : '');
	formData.append(
		'phone_number',
		user.value.phone_number ? user.value.phone_number : ''
	);
	formData.append(
		'phone_code',
		user.value.phone_code ? user.value.phone_code : ''
	);
	formData.append(
		'phone_country',
		user.value.phone_country ? user.value.phone_country : ''
	);
	formData.append(
		'profile_photo',
		user.value.profile_photo ? user.value.profile_photo : ''
	);
	formData.append(
		'cover_photo',
		user.value.cover_photo ? user.value.cover_photo : ''
	);
	formData.append('status', user.value.status ? user.value.status : '');
	formData.append(
		'tags',
		user.value.tags.length > 0 ? JSON.stringify(user.value.tags) : ''
	);
	formData.append(
		'company_id',
		user.value.company && user.value.company.id
			? user.value.company.id
			: companyId.value
	);
	formData.append(
		'store_id',
		user.value.store && user.value.store.id ? user.value.store.id : ''
	);

	if (userId.value) {
		formData.append(
			'password',
			user.value.password ? user.value.password : ''
		);
		formData.append(
			'confirm_password',
			user.value.confirm_password ? user.value.confirm_password : ''
		);
		formData.append('_method', 'PUT');
	}

	return formData;
};

const fetchUserById = async () => {
	loadingUser.value = true;
	const { load, data } = getUser(userId.value);
	await load();
	user.value = data.value;
	loadingUser.value = false;
};

const notification = (message) => {
	messageNotif.value = message;
	showNotif.value = true;
	setTimeout(() => {
		showNotif.value = false;
	}, 2000);
};

const getSpecificCompany = async () => {
	loadingCompany.value = true;
	const { load, data } = getCompaniesById(companyId.value);

	await load();
	loadingCompany.value = false;
	user.value.company = data.value;
};

const handleClickViewPassword = () => {
	showNewPassword.value = !showNewPassword.value;

	if (showNewPassword.value) {
		passwordIcon.value = EyeSlashIcon;
	} else {
		passwordIcon.value = EyeIcon;
	}
};

const handleClickViewPasswordConfirmation = () => {
	showPasswordConfirmation.value = !showPasswordConfirmation.value;

	if (showPasswordConfirmation.value) {
		passwordConfirmationIcon.value = EyeSlashIcon;
	} else {
		passwordConfirmationIcon.value = EyeIcon;
	}
};

const handleClearTag = () => {
	user.value.tags = [];
};

const handleClickChangeProfile = () => {
	hasProfileImage.value = false;
};

const handleClickChangeCoverPhoto = () => {
	hasCoverImage.value = false;
};

onMounted(async () => {

	if (route.query.name) {
		companyName.value = route.query.name;
	}

	if (!userId.value) {
		await getSpecificCompany();
	}

	if (userId.value) {
		await fetchUserById();
	}

	if (typeof user.value.profile_photo === 'string') {
		hasProfileImage.value = true;
	}

	if (typeof user.value.cover_photo === 'string') {
		hasCoverImage.value = true;
	}
});

watch(userId, () => {
	fetchUserById();
});
</script>
