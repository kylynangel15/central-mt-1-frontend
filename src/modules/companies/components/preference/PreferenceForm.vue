<template>
	<div class="xs:mt-0">
		<div class="md:grid md:grid-cols-1 md:gap-6">
			<div class="md:col-span-1">
				<div class="px-4 sm:px-0 text-untitled-gray-600">
					<h3
						class="text-lg font-medium leading-6 text-untitled-gray-900">
						Company Preference
					</h3>
					<p class="mt-1 text-sm text-untitled-gray-600">
						Customize the look of your email notifications and more.
					</p>
				</div>
			</div>
			<div class="mt-5 md:col-span-2 md:mt-0">
				<div>
					<div class="shadow sm:rounded-md">
						<div class="bg-white px-4 py-5 sm:p-6">
							<div class="mb-5">
								<div class="sm:hidden">
									<label for="tabs" class="sr-only"
										>Select a tab</label
									>
									<!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
									<select
										id="tabs"
										name="tabs"
										class="block w-full rounded-md border-gray-300 focus:border-untitled-gray-500 focus:ring-untitled-gray-500">
										<option
											v-for="tab in tabs"
											:key="tab.name"
											:selected="tab.current">
											{{ tab.name }}
										</option>
									</select>
								</div>
								<div class="hidden md:block">
									<div class="border-b border-gray-200">
										<nav
											class="isolate  -mb-px flex space-x-8"
											aria-label="Tabs">
											<span
												v-for="tab in tabs"
												:key="tab.name"
												@click="
													handleClickTag(tab.name)
												"
												:class="[
													tab.current
														? 'border-untitled-gray-500 text-untitled-gray-600'
														: 'border-transparent text-untitled-gray-500 hover:text-untitled-gray-700 hover:border-gray-300',
													'group cursor-pointer inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm',
												]"
												:aria-current="
													tab.current
														? 'page'
														: undefined
												">
												<component
													:is="tab.icon"
													:class="[
														tab.current
															? 'text-untitled-gray-500'
															: 'text-untitled-gray-400 group-hover:text-untitled-gray-500',
														'-ml-0.5 mr-2 h-5 w-5',
													]"
													aria-hidden="true" />
												<span>{{ tab.name }}</span>
											</span>
										</nav>
									</div>
								</div>
							</div>
							<div class="grid grid-cols-6 gap-6">
								<keep-alive>
									<component
										:is="
											componentList[
												tabs.find(
													(tab) => tab.current == true
												).componentName
											]
										"
										:preference="preference"
										:errorValue="errorValue"
										:errorMessage="errorMessage"
                                        :company-profile="companyProfile"
										@phoneNumber="handelPhoneNumber" />
								</keep-alive>
							</div>
						</div>
						<div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
							<button
								@click="handleClickReset"
								type="button"
								:loadingSaving="loadingSaving"
								class="inline-flex mr-2 justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-untitled-gray-500 shadow-sm hover:bg-untitled-gray-50 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
								Reset
							</button>
							<button
								:disabled="loadingSaving"
								@click="handleClickSave"
								type="button"
								class="inline-flex justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
								{{ loadingSaving ? 'Saving...' : 'Save' }}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<global-popup-notification
		v-if="showNotif"
		:show-notification="showNotif"
		:message="messageNotif" />
	<global-delete-confirmation
		@closeModal="handleCloseModal"
		@confirmed="handleDeleteCompany"
		:selected-item="selectedItem"
        :dialog-title="'Reset Preference'"
        :delete-label="'Reset'"
        :message="'Are you sure you want to reset this company preference'"
		:open-modal="openDeleteConfirmation" />
</template>
<script setup>
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { ref, defineProps, computed, defineAsyncComponent, defineEmits } from 'vue';
import {
	MapPinIcon,
	PhotoIcon,
	ClipboardDocumentIcon,
	LinkIcon,
} from '@heroicons/vue/20/solid';
import { storePreference } from '../../composables/preference/store_preference';
import { updatePreference } from '../../composables/preference/update_preference';
import { deletePreference } from '../../composables/preference/delete_preference';
const props = defineProps({
	preference: {
		type: Object,
		default: () => {},
	},
	companyId: {
		type: Number,
		required: true,
	},
    companyProfile: {
        type: Object,
        default: () => {},
        required: true,
    }
});

const emit = defineEmits(['resetPreference', 'createdForm'])

const preference = computed({
	get() {
		return props.preference;
	},
	set(newValue) {
		newValue;
	},
});

const tabs = ref([
	{
		name: 'Info',
		href: '#',
		icon: ClipboardDocumentIcon,
		current: true,
		componentName: 'preferenceInfo',
	},
	{
		name: 'Address',
		href: '#',
		icon: MapPinIcon,
		current: false,
		componentName: 'preferenceAddress',
	},
	{
		name: 'Links',
		href: '#',
		icon: LinkIcon,
		current: false,
		componentName: 'preferenceLinks',
	},
	{
		name: 'Image',
		href: '#',
		icon: PhotoIcon,
		current: false,
		componentName: 'preferenceImage',
	},
]);
const phoneNumber = ref({});
const errorValue = ref(null);
const errorMessage = ref(null);
const loadingSaving = ref(false);
const showNotif = ref(false);
const messageNotif = ref(null);
const companyProfile = computed(() => props.companyProfile)
const preferenceable_id = computed({
	get() {
		return props.companyId;
	},
	set(newValue) {
		newValue;
	},
});
const selectedItem = ref(null)
const openDeleteConfirmation = ref(false)

const componentList = {
	preferenceInfo: defineAsyncComponent(() =>
		import('../preference/forms/PreferenceInfo.vue')
	),
	preferenceAddress: defineAsyncComponent(() =>
		import('../preference/forms/PreferenceAddress.vue')
	),
	preferenceLinks: defineAsyncComponent(() =>
		import('../preference/forms/PreferenceLinks.vue')
	),
	preferenceImage: defineAsyncComponent(() =>
		import('../preference/forms/PreferenceImage.vue')
	),
};

const handleClickTag = (name) => {
	tabs.value = tabs.value.map((tab) => {
		if (tab.name === name) {
			tab.current = true;
		} else {
			tab.current = false;
		}
		return tab;
	});
};

const handleClickSave = () => {
	if (preference.value.id && !preference.value.default_preference) {
		editPreference();
		return;
	}

	createPreference();
};

const handleClickReset = () => {
    selectedItem.value = preference.value
    openDeleteConfirmation.value = true

};

const handleCloseModal = () => {
    openDeleteConfirmation.value = false
}

const handleDeleteCompany = async () => {
    const {trash} = deletePreference(preference.value.id);
    await trash()
	notification('Successfully reset!');
    openDeleteConfirmation.value = false
    emit('resetPreference')
}

const createPreference = async () => {
	loadingSaving.value = true;

	preference.value.phone_number = phoneNumber.value.formatted

	if (phoneNumber.value && phoneNumber.value.nationalNumber) {
		preference.value.phone_number = phoneNumber.value.nationalNumber;
		preference.value.phone_code = phoneNumber.value.countryCallingCode;
		preference.value.phone_country = phoneNumber.value.countryCode;
	}

	const form = initializeForm();
	const { post, errorData, message, data } = storePreference(form);
	await post();

	errorValue.value = errorData.value;
	errorMessage.value = message.value;
	loadingSaving.value = false;

	if (!data.value) {
		return;
	}

    emit('createdForm', data.value)

	notification('Successfully created!');
};

const editPreference = async () => {
	loadingSaving.value = true;
	preference.value.phone_number = phoneNumber.value.formatted
	
	if (phoneNumber.value && phoneNumber.value.nationalNumber) {
		preference.value.phone_number = phoneNumber.value.nationalNumber;
		preference.value.phone_code = phoneNumber.value.countryCallingCode;
		preference.value.phone_country = phoneNumber.value.countryCode;
	}

	const form = initializeForm();
	const { update, errorData, message, data } = updatePreference(
		form,
		preference.value.id
	);
	await update();

	errorValue.value = errorData.value;
	errorMessage.value = message.value;
	loadingSaving.value = false;

	if (!data.value) {
		return;
	}

	notification('Successfully updated!');
};

const handelPhoneNumber = (val) => {
	phoneNumber.value = val;
};

const notification = (message) => {
	messageNotif.value = message;
	showNotif.value = true;
	setTimeout(() => {
		showNotif.value = false;
	}, 2000);
};

const initializeForm = () => {
	const formData = new FormData();
	formData.append(
		'signature_name',
		preference.value.signature_name ? preference.value.signature_name : ''
	);
	formData.append(
		'technical_email',
		preference.value.technical_email ? preference.value.technical_email : ''
	);
	formData.append(
		'sales_email',
		preference.value.sales_email ? preference.value.sales_email : ''
	);
	formData.append(
		'footer',
		preference.value.footer ? preference.value.footer : ''
	);
	formData.append(
		'phone_number',
		preference.value.phone_number ? preference.value.phone_number : ''
	);
	formData.append(
		'phone_code',
		preference.value.phone_code ? preference.value.phone_code : ''
	);
	formData.append(
		'phone_country',
		preference.value.phone_country ? preference.value.phone_country : ''
	);
	formData.append(
		'linkedin',
		preference.value.linkedin ? preference.value.linkedin : ''
	);
	formData.append(
		'facebook',
		preference.value.facebook ? preference.value.facebook : ''
	);
	formData.append(
		'youtube',
		preference.value.youtube ? preference.value.youtube : ''
	);
	formData.append(
		'address',
		preference.value.address ? preference.value.address : ''
	);
	formData.append('city', preference.value.city ? preference.value.city : '');
	formData.append(
		'state',
		preference.value.state ? preference.value.state : ''
	);
	formData.append('zip', preference.value.zip ? preference.value.zip : '');
	formData.append(
		'country',
		preference.value.country ? preference.value.country : ''
	);
	formData.append(
		'logo_photo',
		preference.value.logo_photo ? preference.value.logo_photo : ''
	);
	formData.append(
		'favicon_photo',
		preference.value.favicon_photo ? preference.value.favicon_photo : ''
	);
	formData.append('overwrite', preference.value.overwrite ? 1 : 0);
	formData.append('preferenceable_type', 'Admin\\Company\\Models\\Company');
	formData.append(
		'preferenceable_id',
		preferenceable_id.value ? preferenceable_id.value : ''
	);

	if (!preference.value.default_preference && preference.value.id) {
		formData.append('id', preference.value.id);
		formData.append('_method', 'PUT');
	}

	return formData;
};
</script>
