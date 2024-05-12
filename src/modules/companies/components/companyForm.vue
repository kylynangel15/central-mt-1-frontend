<template>
	<div
		class="rounded-md bg-white w-full col-span-7 border-1 shadow-lg border-gray-200">
		<div class="mt-4 px-3 grid grid-cols-3 gap-4">
			<div class="border-4 rounded-lg border-gray-500"></div>
			<div
				:class="form2ndPage ? 'border-gray-500' : 'border-gray-200'"
				class="border-4 rounded-lg"></div>
			<div
				:class="form3ndPage ? 'border-gray-500' : 'border-gray-200'"
				class="border-4 rounded-lg"></div>
		</div>
		<div v-if="!form2ndPage">
			<!-- form1 -->
			<form>
				<div class="px-8 my-4">
					<label
						for="name"
						class="block text-sm font-medium text-gray-700"
						>Name <RequiredSpan />
					</label>
					<div class="mt-1">
						<input
							type="text"
							v-model="company.name"
							name="name"
							id="name"
							class="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
							placeholder="Enter your company"
							required />
					</div>
					<ErrorSpanMessage v-if="errorValue && errorValue.name">
						{{ errorValue.name[0] }}
					</ErrorSpanMessage>
				</div>
				<div class="px-8 my-4">
					<label
						for="website"
						class="block text-sm font-medium text-gray-700"
						>Website</label
					>
					<div class="mt-1">
						<input
							type="text"
							v-model="company.website"
							name="website"
							id="website"
							class="block w-full rounded-md shadow-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
							placeholder="https://www.yourwebsite.com" />
					</div>
					<ErrorSpanMessage v-if="errorValue && errorValue.website">
						{{ errorValue.website[0] }}
					</ErrorSpanMessage>
				</div>
				<div class="px-8 my-4">
					<label
						for="default_password"
						class="block text-sm font-medium text-gray-700">
						Default Password
					</label>
					<div class="mt-1 relative">
						<input
							id="password"
							name="password"
							:type="!isShowPassword ? 'password' : 'text'"
							autocomplete="current-password"
							v-model="company.default_password"
							placeholder="Enter your password"
							class="block w-full appearance-none rounded-md border border-untitled-gray-300 px-3 py-2 placeholder-untitled-gray-400 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-untitled-gray-500 sm:text-sm" />
						<div
							class="absolute inset-y-0 right-0 flex items-center pr-3">
							<component
								:is="viewPasswordIcon"
								@click="handleCLickViewPassword"
								class="h-5 w-5 text-untitled-gray-500 cursor-pointer"
								aria-hidden="true" />
						</div>
					</div>
					<ErrorSpanMessage
						v-if="errorValue && errorValue.default_password">
						{{ errorValue.default_password[0] }}
					</ErrorSpanMessage>
				</div>
				<div class="px-8 my-4">
					<label
						for="type"
						class="block text-sm font-medium text-gray-700"
						>Company Type <RequiredSpan
					/></label>
					<div class="mt-1">
						<SelectCompanyType
							v-model="company.type"
							:show-label="false"
							:is-required="true" />
					</div>
					<ErrorSpanMessage v-if="errorValue && errorValue.type">
						{{ errorValue.type[0] }}
					</ErrorSpanMessage>
				</div>
				<div class="px-8 my-4">
					<label
						for="phone"
						class="block text-sm font-medium text-gray-700"
						>Phone</label
					>
					<div class="mt-1">
						<global-phone-number v-model="company.phoneNumber"/>
					</div>
					<ErrorSpanMessage
						v-if="errorValue && errorValue.phone_number">
						{{ errorValue.phone_number[0] }}
					</ErrorSpanMessage>
				</div>
				<div class="px-8 my-4">
					<label
						for="phone"
						class="block text-sm font-medium text-gray-700">
							Has on demand training?
					</label>
					<div class="mt-1">
						<SwitchToggle v-model="company.has_on_demand"/>
					</div>
					<ErrorSpanMessage
						v-if="errorValue && errorValue.has_on_demand">
						{{ errorValue.has_on_demand[0] }}
					</ErrorSpanMessage>
				</div>
                <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">

					<button
						type="button"
						@click="handleClickContinue"
						class="inline-flex justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
						Continue
					</button>
				</div>
			</form>
		</div>

		<!-- form2 -->
		<div v-if="form2ndPage && !form3ndPage">
			<form>
				<div class="px-8 my-4">
					<label
						for="address"
						class="block text-sm font-medium text-gray-700"
						>Address</label
					>
					<div class="mt-1">
						<input
							type="text"
							v-model="company.address"
							name="address"
							id="address"
							class="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
							placeholder="Enter your Address"
							required />
					</div>
					<ErrorSpanMessage v-if="errorValue && errorValue.address">
						{{ errorValue.address[0] }}
					</ErrorSpanMessage>
				</div>
				<div class="px-8 my-4">
					<label
						for="state"
						class="block text-sm font-medium text-gray-700"
						>state</label
					>
					<div class="mt-1">
						<input
							type="text"
							v-model="company.state"
							name="state"
							id="state"
							class="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
							placeholder="Enter your State"
							required />
					</div>
					<ErrorSpanMessage v-if="errorValue && errorValue.state">
						{{ errorValue.state[0] }}
					</ErrorSpanMessage>
				</div>
				<div class="px-8 my-4">
					<label
						for="city"
						class="block text-sm font-medium text-gray-700"
						>City</label
					>
					<div class="mt-1">
						<input
							type="text"
							v-model="company.city"
							name="city"
							id="city"
							class="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
							placeholder="Enter your City"
							required />
					</div>
					<ErrorSpanMessage v-if="errorValue && errorValue.city">
						{{ errorValue.city[0] }}
					</ErrorSpanMessage>
				</div>
				<div class="px-8 my-4">
					<label
						for="country"
						class="block text-sm font-medium text-gray-700"
						>Country</label
					>
					<div class="mt-1">
						<input
							type="text"
							v-model="company.country"
							name="country"
							id="country"
							class="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
							placeholder="Enter your Country"
							required />
					</div>
					<ErrorSpanMessage v-if="errorValue && errorValue.country">
						{{ errorValue.country[0] }}
					</ErrorSpanMessage>
				</div>
				<div class="px-8 my-4">
					<label
						for="zip"
						class="block text-sm font-medium text-gray-700"
						>Zip Code</label
					>
					<div class="mt-1">
						<input
							type="number"
							v-model="company.zip"
							name="zip"
							id="zip"
							class="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
							placeholder="Enter your Zip Code"
							required />
					</div>
					<ErrorSpanMessage v-if="errorValue && errorValue.zip">
						{{ errorValue.zip[0] }}
					</ErrorSpanMessage>
				</div>
				<div class="px-8 my-4">
					<SwitchGroup as="div" class="flex items-center">
						<Switch
							v-model="company.active"
							:class="[
								company.active ? 'bg-green-700' : 'bg-gray-200',
								'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
							]">
							<span
								aria-hidden="true"
								:class="[
									company.active
										? 'translate-x-5'
										: 'translate-x-0',
									'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
								]" />
						</Switch>
						<SwitchLabel as="span" class="ml-3">
							<span class="text-sm font-medium text-gray-900"
								>Status</span
							>
							<span class="text-sm font-bold text-gray-900"
								>:
								{{
									company.active ? 'Active' : 'Inactive'
								}}</span
							>
						</SwitchLabel>
					</SwitchGroup>
				</div>
                <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
					<button
						type="button"
						@click="backToFirstPage"
						class="inline-flex justify-center bg-white border shadow-sm hover:text-white rounded-md border border-transparent text-untitled-gray-500 mr-2 py-2 px-4 text-sm font-medium hover:bg-untitled-gray-400 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
						Back
					</button>

					<button
						type="button"
						@click="handleClickContinueThirdPage"
						class="inline-flex justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
						Continue
					</button>
				</div>
			</form>
		</div>

		<div v-if="form3ndPage">
			<div class="px-4 mt-5">
				<h3
					class="text-lg font-semibold leading-6 text-untitled-gray-500">
					Create initial company admin
				</h3>
			</div>
			<form>
				<div class="px-8 my-4">
					<label
						for="address"
						class="block text-sm font-medium text-gray-700"
						>User Name</label>
					<div class="mt-1">
						<input
							type="text"
							v-model="company.user_name"
							name="user_name"
							id="user_name"
							class="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
							placeholder="Enter user full name"
							required />
					</div>
					<ErrorSpanMessage v-if="errorValue && errorValue.user_name">
						{{ errorValue.user_name[0] }}
					</ErrorSpanMessage>
				</div>
				<div class="px-8 my-4">
					<label
						for="state"
						class="block text-sm font-medium text-gray-700"
						>User Email </label>
					<div class="mt-1">
						<input
							type="email"
							v-model="company.user_email"
							name="user_email"
							id="user_email"
							class="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
							placeholder="Enter user email"
							required />
					</div>
					<ErrorSpanMessage
						v-if="errorValue && errorValue.user_email">
						{{ errorValue.user_email[0] }}
					</ErrorSpanMessage>
				</div>
				<div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
					<button
						type="button"
						@click="handleClickCancel"
						class="inline-flex justify-center bg-white border shadow-sm hover:text-white rounded-md border border-transparent text-untitled-gray-500 mr-2 py-2 px-4 text-sm font-medium hover:bg-untitled-gray-400 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
						Cancel
					</button>

					<button
						type="button"
						@click="backToSecondPage"
						class="inline-flex justify-center bg-white border shadow-sm hover:text-white rounded-md border border-transparent text-untitled-gray-500 mr-2 py-2 px-4 text-sm font-medium hover:bg-untitled-gray-400 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
						Back
					</button>

					<button
						type="button"
						:disabled="loadingSave"
						@click="save"
						class="inline-flex justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
						{{ loadingSave ? 'Saving..' : 'Save' }}
					</button>
				</div>
			</form>
		</div>
	</div>
	<global-popup-notification
		v-if="showNotif"
		:show-notification="showNotif"
		:message="messageNotif" />
</template>
<script setup>
import MazPhoneNumberInput from 'maz-ui/components/MazPhoneNumberInput';
import { ref, onMounted, defineProps, defineEmits, toRefs } from 'vue';
import { getCompaniesById } from '../composables/get_company_byId';
import { updateCompany } from '../composables/update_company';
import { storeCompany } from '../composables/store_company';
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue';
import SelectCompanyType from '../utilities/SelectCompanyType.vue';
import { useRouter } from 'vue-router';
import ErrorSpanMessage from '@/components/ErrorSpanMessage.vue';
import SelectPhoneNumber from '@/components/forms/SelectPhoneNumber.vue';
import { useEmitter } from '@/composables/useEmitter';
import RequiredSpan from '@/components/RequiredSpan.vue';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
import SwitchToggle from '@/components/forms/SwitchToggle.vue';

const props = defineProps({
	companyIdParam: {
		type: Number,
	},
	isUpdate: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['backToHome']);
const emitter = useEmitter;

const router = useRouter();
const messageNotif = ref(null);
const showNotif = ref(false);
const form2ndPage = ref(false);
const company = ref({
	name: '',
	website: '',
	address: '',
	city: '',
	country: '',
	default_password: '',
	type: '',
	state: '',
	status: true,
	phoneCountry: null,
	phoneNumber: null,
	zip: null,
	phoneNumber: {},
	active: true,
	user_name: '',
	user_email: '',
	has_on_demand: false
});

const errorValue = ref({});
const errorMessage = ref(null);

const form3ndPage = ref(false);
const loadingSave = ref(false);
const isShowPassword = ref(false);
const viewPasswordIcon = ref(EyeIcon);

const handleClickContinue = () => {
	if (!formValidation()) return;

	form2ndPage.value = true;
};
const handleClickCancel = () => {
	router.push({ name : 'Company Home Page'})
};

const handleClickContinueThirdPage = () => {
	form3ndPage.value = true;
};

const backToFirstPage = () => {
    form2ndPage.value = false
	form3ndPage.value = false;
}

const backToSecondPage = () => {
    form2ndPage.value = true
	form3ndPage.value = false;
}

const formValidation = () => {
	const { phoneNumber, website, type } = toRefs(company.value);

	let isValidForm = true;

	if (
		!(
			website.value.substring(0, 8) === 'https://' ||
			website.value.substring(0, 7) === 'http://' ||
			website.value === ''
		)
	) {
		errorValue.value.website = ['Please input valid website.'];
		isValidForm = false;
	} else {
		errorValue.value.website = [];
	}

	if (Object.keys(type.value).length === 0) {
		errorValue.value.type = ['The company type field is required.'];
		isValidForm = false;
	} else {
		errorValue.value.type = [];
	}
	
	if((!company.value.phoneNumber.valid && company.value.phoneNumber.number) ||  (/[a-zA-Z]/.test(company.value.phoneNumber.formattedNumber) && company.value.phoneNumber.formattedNumber !== undefined)) {
		errorValue.value.phone_number = ['Country Code and Phone Number are invalid, Please input valid number']
		isValidForm = false
	}
	else {
		errorValue.value.phone_number = []
	}

	return isValidForm;
};

const handleCLickViewPassword = () => {
	isShowPassword.value = !isShowPassword.value;

	if (isShowPassword.value) {
		viewPasswordIcon.value = EyeSlashIcon;
		return;
	}

	viewPasswordIcon.value = EyeIcon;
};

const save = async () => {
	await createCompany(company.value);
};
const createCompany = async (company) => {
	company.phone_number = company.phoneNumber.nationalNumber;
	company.phone_code = company.phoneNumber.phone_code;
	company.phone_country = company.phoneNumber.countryCode;
	loadingSave.value = true;
	const { post, errorData, message, data } = storeCompany(company);
	await post();
	loadingSave.value = false;
	errorValue.value = errorData.value;
	errorMessage.value = message.value;

	if (errorValue.value && errorValue.value.name) {
		form3ndPage.value = false;
		form2ndPage.value = false;
	}

	if(errorValue.value && errorValue.value.phone_number && errorValue.value.phone_number.length) {
		form3ndPage.value = false;
		form2ndPage.value = false;
	}

	if (
		errorValue.value &&
		errorValue.value.user_name &&
		!errorValue.value.name && !errorValue.value.phone_number
	) {
		form3ndPage.value = true;
	}

	if (!data.value) {
		return;
	}

	notification('Successfully created!');
	emitter.emit('NEW_COMPANY', data.value);
	initialize();
	router.push({ name: 'Company Home Page' });
};

const initialize = async () => {
	company.value = {
		name: '',
		website: '',
		address: '',
		city: '',
		country: '',
		default_password: '',
		type: '',
		state: '',
		status: true,
		phoneCountry: null,
		phoneNumber: null,
		zip: null,
		phoneNumber: {},
		status: true,
	};
};

const notification = (message) => {
	messageNotif.value = message;
	showNotif.value = true;
	setTimeout(() => {
		showNotif.value = false;
	}, 2000);
};
onMounted(() => {});
</script>
