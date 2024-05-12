<template>
	<div>
		<div class="relative mt-1 rounded-md shadow-sm">
			<div class="absolute inset-y-0 left-0 flex items-center">
				<label for="country" class="sr-only">Country</label>
				<PhoneCountryList
					v-model="countryPhoneNumber"
					:default-country="countryCode ? countryCode : defaultCountryCode" />
			</div>
			<input
				type="text"
				class="block w-full rounded-md border-gray-300 pl-32 focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm"
				v-model="phone_number"
				@input="handleInput"
				@keydown="handleKeyPress"
				placeholder="Phone number" />
		</div>
	</div>
</template>
<script setup>
// used libraries
// * libphonenumber-js vue-country-flag-next vue3-infinite-scroll-better

import { computed, ref, onMounted, watch } from 'vue';
import PhoneCountryList from './PhoneCountryList.vue';
import parsePhoneNumber, {
	AsYouType,
	isPossiblePhoneNumber,
	isValidPhoneNumber,
	validatePhoneNumberLength,
} from 'libphonenumber-js';
const props = defineProps({
	modelValue: null,
	defaultCountryCode: {
		type: String,
		default: 'US',
	},
	value: {
		type: String,
		default: '',
	},
	countryCode: {
		type: String,
		default: null
	}
});

const emit = defineEmits(['update:modelValue']);

const phone = computed({
	get() {
		return props.modelValue;
	},
	set(newValue) {
		emit('update:modelValue', newValue);
	},
});
const defaultCountryCode = computed(() => props.defaultCountryCode);
const countryCode = computed(() => props.countryCode)
const value = computed(() => props.value);

const countryPhoneNumber = ref(null);
const phone_number = ref(value.value);
const phoneNumberData = ref({
	valid: false,
	formattedNumber: null,
	number: null,
	countryCode: null,
	phone_code: null,
});

const handleInput = (event) => {	 
	if(event) {
		const input = event.target.value.replace(/\D/g, '');
		phone_number.value = input
		if(!input) return;
	}
	
	formatNumber();
};

const handleKeyPress = (event) => {
	// phone.value.valid = true
	if(event.key === 'Delete' || event.key === 'Backspace') {
		formatNumber()
	}
}

const formatNumber = () => {
	let phoneNumber = parsePhoneNumber(
		`+${countryPhoneNumber.value.phone}${phone_number.value}`
	);

	if(phone_number.value && phone_number.value.includes('+')) {
		phoneNumber = parsePhoneNumber(phone_number.value);
	}

	phone.value.countryCode = countryPhoneNumber.value.countryCode
	phone.value.phone_code = countryPhoneNumber.value.phone
	if (!phoneNumber) {
		phone.value.valid = false
		return
	}
	phone.value.valid = true
	phoneNumberData.value.countryCode = countryPhoneNumber.value.countryCode;
	phoneNumberData.value.number = phoneNumber.formatNational();
	phoneNumberData.value.phone_code = countryPhoneNumber.value.phone

	// Valid number
	if (
		isValidPhoneNumber(
			phoneNumber.formatNational(),
			countryPhoneNumber.value.countryCode
		) === true
	) {
		phone_number.value = phoneNumber.formatInternational();
		phoneNumberData.value.formattedNumber = phoneNumber.formatInternational();
		phoneNumberData.value.valid = true;
		phone.value = phoneNumberData.value;
		return;
	}

	phoneNumberData.value.valid = false
	phone.value = phoneNumberData.value;
	return;
};

onMounted(() => {
	formatNumber();
});

watch(countryPhoneNumber, () => {
	if(phone_number.value && phone_number.value.includes('+')){
		phone_number.value = parsePhoneNumber(phone_number.value).formatNational()
	}
	handleInput();
});
</script>
