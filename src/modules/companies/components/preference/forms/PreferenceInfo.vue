<template>
	<div class="col-span-6 sm:col-span-6">
		<label
			for="signature_name"
			class="block text-sm font-medium text-untitled-gray-700">
			Signature Name
		</label>
		<input
			type="text"
			name="signature_name"
			id="signature_name"
			v-model="preference.signature_name"
			autocomplete="given-name"
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />

		<ErrorSpanMessage v-if="errorValue && errorValue.signature_name">
			{{ errorValue.signature_name[0] }}
		</ErrorSpanMessage>
	</div>

	<div class="col-span-6 sm:col-span-6">
		<label
			for="technical_email"
			class="block text-sm font-medium text-untitled-gray-700">
			Technical Email
		</label>
		<div class="relative mt-1 rounded-md shadow-sm">
			<div
				class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<EnvelopeIcon
					class="h-5 w-5 text-untitled-gray-400"
					aria-hidden="true" />
			</div>
			<input
				type="email"
				name="technical_email"
				v-model="preference.technical_email"
				id="technical_email"
				class="block w-full rounded-md border-gray-300 pl-10 focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm"
				placeholder="you@example.com" />
		</div>
	</div>

	<div class="col-span-6 sm:col-span-6">
		<label
			for="sales_email"
			class="block text-sm font-medium text-untitled-gray-700">
			Sales Email
		</label>
		<div class="relative mt-1 rounded-md shadow-sm">
			<div
				class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<EnvelopeIcon
					class="h-5 w-5 text-untitled-gray-400"
					aria-hidden="true" />
			</div>
			<input
				type="email"
				name="sales_email"
				id="sales_email"
				v-model="preference.sales_email"
				class="block w-full rounded-md border-gray-300 pl-10 focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm"
				placeholder="you@example.com" />
		</div>
	</div>

	<div class="col-span-6 sm:col-span-6">
		<label
			for="phone_number"
			class="block text-sm font-medium text-untitled-gray-700">
			Phone Number
		</label>
		<SelectPhoneNumber v-model="phoneNumber" :phone="`${preference.phone_number ? `${preference.phone_code}${preference.phone_number}` : ''}`"/>
		<ErrorSpanMessage v-if="errorValue && errorValue.phone_number">
			{{ errorValue.phone_number[0] }}
		</ErrorSpanMessage>
	</div>

	<div class="col-span-6 sm:col-span-6">
		<label
			for="phone_number"
			class="block text-sm font-medium text-untitled-gray-700">
			Footer
		</label>
		<div class="">
			<ckeditor
				style="150px"
				:editor="editor"
				v-model="preference.footer"
				:config="editorConfig"></ckeditor>
		</div>
	</div>
	<div class="col-span-6">
		<label
			for="street-address"
			class="block text-sm font-medium text-gray-700">
			Allow overwrite
		</label>
		<SwitchToggle v-model="preference.overwrite" />
	</div>
</template>
<script>
// use normal <script> to declare options
export default {
	inheritAttrs: false,
	components: {
		SelectPhoneNumber,
		EnvelopeIcon,
		ErrorSpanMessage,
		SwitchToggle,
	},
};
</script>
<script setup>
import SelectPhoneNumber from '@/components/forms/SelectPhoneNumber.vue';
import { defineProps, computed, ref, defineEmits, watch } from 'vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EnvelopeIcon } from '@heroicons/vue/24/outline';
import ErrorSpanMessage from '@/components/ErrorSpanMessage.vue';
import SwitchToggle from '@/components/forms/SwitchToggle.vue';
const props = defineProps({
	preference: {
		type: Object,
		required: true,
	},
	errorValue: null,
	errorMessage: null,
});

const emit = defineEmits(['phoneNumber']);

const preference = computed({
	get() {
		return props.preference;
	},
	set(newValue) {
		newValue;
	},
});

const errorValue = computed(() => props.errorValue);
const errorMessage = computed(() => props.errorMessage);
const phoneNumber = ref({});

const editor = ClassicEditor;
const editorData = ref('<p>Content of the editor.</p>');
const editorConfig = ref({});

watch(phoneNumber, (val) => {
	emit('phoneNumber', val);
});
</script>
