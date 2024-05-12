<template>
	<div class="flex-1 mt-4 shadow-lg bg-white">
		<div class="mx-auto py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
			<h1
				class="text-3xl font-bold tracking-tight text-untitled-gray-500">
				Manage Account
			</h1>

			<form class="divide-y-untitled-gray-200 mt-6 space-y-8 divide-y">
				<div class="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
					<div class="sm:col-span-3">
						<label
							for="first-name"
							class="block text-sm text-untitled-gray-900">
							Name <RequiredSpan
						/></label>
						<input
							type="text"
							v-model="companyProfile.name"
							class="mt-1 block w-full rounded-md border-untitled-gray-300 text-untitled-gray-900 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
						<ErrorSpanMessage v-if="errorValue && errorValue.name">
							{{ errorValue.name[0] }}
						</ErrorSpanMessage>
					</div>
					<div class="sm:col-span-3">
						<label
							for="first-name"
							class="block text-sm text-untitled-gray-900">
							Phone</label
						>
						<global-phone-number
							v-model="phoneNumber"
							:country-code="companyProfile.phone_country"
							:value="companyProfile.phone_number" />

						<ErrorSpanMessage
							v-if="errorValue && errorValue.phone_number">
							{{ errorValue.phone_number[0] }}
						</ErrorSpanMessage>
					</div>

					<div class="sm:col-span-6">
						<label
							for="website"
							class="block text-sm text-untitled-gray-900"
							>Website <RequiredSpan
						/></label>
						<div class="mt-1 flex rounded-md shadow-sm">
							<span
								class="inline-flex items-center rounded-l-md border border-r-0 border-untitled-gray-300 bg-untitled-gray-50 px-3 text-untitled-gray-500 sm:text-sm"
								>https://</span
							>
							<input
								type="text"
								name="website"
								v-model="companyProfile.website"
								id="website"
								autocomplete="website"
								class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-untitled-gray-300 text-untitled-gray-900 focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
						</div>
						<ErrorSpanMessage
							v-if="errorValue && errorValue.website">
							{{ errorValue.website[0] }}
						</ErrorSpanMessage>
					</div>

					<div class="sm:col-span-3 relative">
						<label
							for="default_password"
							class="block text-sm text-untitled-gray-900">
							Default Password <RequiredSpan />
						</label>
						<div class="mt-1 relative">
							<input
								id="password"
								name="password"
								placeholder="Enter your password"
								v-model="companyProfile.default_password"
								:type="!isViewPassword ? 'password' : 'text'"
								autocomplete="password"
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
					</div>

					<div class="sm:col-span-3">
						<SelectCompanyType
							v-model="companyType"
							:is-required="true"
							:show-label="true"
							:is-disabled="
								companyProfile.type == 'DEFAULT' ? true : false
							" />
						<ErrorSpanMessage v-if="errorValue && errorValue.type">
							{{ errorValue.type[0] }}
						</ErrorSpanMessage>
					</div>
				</div>

				<div
					class="grid grid-cols-1 gap-y-6 pt-8 sm:grid-cols-6 sm:gap-x-6">
					<div class="sm:col-span-6">
						<h2 class="text-xl text-untitled-gray-900">
							Address Information
						</h2>
					</div>

					<div class="sm:col-span-6">
						<label
							for="description"
							class="block text-sm text-untitled-gray-900"
							>Address</label
						>
						<div class="mt-1">
							<textarea
								v-model="companyProfile.address"
								id="description"
								name="description"
								rows="4"
								class="block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
						</div>
					</div>

					<div class="sm:col-span-3">
						<label
							for="email-address"
							class="block text-sm text-untitled-gray-900">
							State
						</label>
						<input
							type="text"
							v-model="companyProfile.state"
							autocomplete="email"
							class="mt-1 block w-full rounded-md border-untitled-gray-300 text-untitled-gray-900 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
					</div>

					<div class="sm:col-span-3">
						<label
							for="phone-number"
							class="block text-sm text-untitled-gray-900">
							City
						</label>
						<input
							type="text"
							name="phone-number"
							v-model="companyProfile.city"
							id="phone-number"
							autocomplete="tel"
							class="mt-1 block w-full rounded-md border-untitled-gray-300 text-untitled-gray-900 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
					</div>

					<div class="sm:col-span-3">
						<label
							for="email-address"
							class="block text-sm text-untitled-gray-900">
							Country
						</label>
						<input
							type="text"
							v-model="companyProfile.country"
							autocomplete="email"
							class="mt-1 block w-full rounded-md border-untitled-gray-300 text-untitled-gray-900 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
						<ErrorSpanMessage
							v-if="errorValue && errorValue.country">
							{{ errorValue.country[0] }}
						</ErrorSpanMessage>
					</div>

					<div class="sm:col-span-3">
						<label
							for="language"
							class="block text-sm text-untitled-gray-900"
							>Zip Code</label
						>
						<input
							type="number"
							v-model="companyProfile.zip"
							name="language"
							id="language"
							class="mt-1 block w-full rounded-md border-untitled-gray-300 text-untitled-gray-900 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
						<ErrorSpanMessage v-if="errorValue && errorValue.zip">
							{{ errorValue.zip[0] }}
						</ErrorSpanMessage>
					</div>
					<div class="col-span-6">
						<div
							class="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
							<div class="col-span-3">
								<label
									for="street-address"
									class="block text-sm font-medium text-gray-700">
									Active
								</label>
								<SwitchToggle v-model="active" />
							</div>
							<div class="col-span-3">
								<label
									for="street-address"
									class="block text-sm font-medium text-gray-700">
									Has on demand training?
								</label>
								<SwitchToggle v-model="has_on_demand" />
							</div>
						</div>
					</div>
				</div>

				<div class="flex justify-end pt-8">
					<button
						type="button"
						:disabled="loading"
						@click="handleClickSave()"
						class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
						{{ loading ? 'Updating....' : 'Save' }}
					</button>
				</div>
			</form>
		</div>
	</div>

	<global-popup-notification
		v-if="showNotif"
		:show-notification="showNotif"
		:message="messageNotif"
		:icon="notificationIcon" />
</template>

<script>
// use normal <script> to declare options
export default {
	inheritAttrs: false,
	components: { ErrorSpanMessage, RequiredSpan, SwitchToggle },
};
</script>

<script setup>
import ErrorSpanMessage from '@/components/ErrorSpanMessage.vue';
import SelectPhoneNumber from '@/components/forms/SelectPhoneNumber.vue';
import { useEmitter } from '@/composables/useEmitter';
import { set } from 'lodash-es';
import { defineProps, computed, ref, defineEmits } from 'vue';
import { updateCompany } from '../../composables/update_company';
import SelectCompanyType from '../../utilities/SelectCompanyType.vue';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
import RequiredSpan from '@/components/RequiredSpan.vue';
import SwitchToggle from '@/components/forms/SwitchToggle.vue';

const props = defineProps({
	companyProfile: {
		type: Object,
		default: null,
	},
	companyId: {
		type: Number,
		default: null,
	},
});

const emit = defineEmits(['updatedCompany']);

const emitter = useEmitter;

const companyProfile = computed({
	get() {
		return { ...props.companyProfile };
	},
	set(value) {
		value;
	},
});
const active = ref(companyProfile.value.active ? true : false);
const has_on_demand = ref(companyProfile.value.has_on_demand ? true : false);

const companyType = ref(companyProfile.value.type);

const viewPasswordIcon = ref(EyeIcon);
const isViewPassword = ref(false);

const phoneNumber = ref({});
const errorValue = ref(null);
const errorMessage = ref(null);
const showNotif = ref(false);
const messageNotif = ref(null);
const loading = ref(false);
const notificationIcon = ref('Check');
const handleClickSave = async () => {
	loading.value = true;

	companyProfile.value.phone_number = phoneNumber.value.formatted;

	if (phoneNumber.value && phoneNumber.value.number) {
		companyProfile.value.phone_number = phoneNumber.value.number;
		companyProfile.value.phone_code = phoneNumber.value.phone_code;
		companyProfile.value.phone_country = phoneNumber.value.countryCode;
	}

	companyProfile.value.type = companyType.value;
	companyProfile.value.active = active.value ? 1 : 0;
	companyProfile.value.has_on_demand = has_on_demand.value ? 1 : 0;

	const { update, data, errorData, message } = updateCompany(
		companyProfile.value.id,
		companyProfile.value
	);
	await update();

	loading.value = false;
	if (!data.value) {
		errorValue.value = errorData.value;
		errorMessage.value = message.value;
		notificationIcon.value = 'Error';
		notification(message.value);
		return;
	}
	errorValue.value = null;
	errorMessage.value = null;
	notificationIcon.value = 'Check';
	notification('Successfully updated!');
	emit('updatedCompany', data.value);

	// emit to home page
	emitter.emit('UPDATED_COMPANY', data.value);
};

const handleAddPhoneNumber = (number) => {
	companyProfile.value.phone_number = number;
};

const handleRemovePhoneNumber = () => {
	companyProfile.value.phone_number = null;
};

const notification = (message) => {
	messageNotif.value = message;
	showNotif.value = true;
	setTimeout(() => {
		showNotif.value = false;
	}, 2000);
};

const handleCLickViewPassword = () => {
	isViewPassword.value = !isViewPassword.value;

	if (isViewPassword.value) {
		viewPasswordIcon.value = EyeSlashIcon;
		return;
	}

	viewPasswordIcon.value = EyeIcon;
};
</script>
