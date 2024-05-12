<template>
	<div class="col-span-6">
		<label
			for="address"
			class="block text-sm font-medium text-untitled-gray-700">
			Address
		</label>
		<textarea
			rows="4"
			type="text"
			name="address"
			v-model="preference.address"
			id="address"
			autocomplete="address"
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
	</div>

	<div class="col-span-6 sm:col-span-6 lg:col-span-3">
		<label
			for="city"
			class="block text-sm font-medium text-untitled-gray-700">
			City
		</label>
		<input
			type="text"
			name="city"
			v-model="preference.city"
			id="city"
			autocomplete="address-level2"
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
	</div>

	<div class="col-span-6 sm:col-span-3 lg:col-span-3">
		<label
			for="region"
			class="block text-sm font-medium text-untitled-gray-700">
			State
		</label>
		<input
			type="text"
			name="region"
			v-model="preference.state"
			id="region"
			autocomplete="address-level1"
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
	</div>

	<div class="col-span-6 sm:col-span-3 lg:col-span-3">
		<label
			for="postal-code"
			class="block text-sm font-medium text-untitled-gray-700">
			Zip
		</label>
		<input
			type="number"
			name="postal-code"
			id="postal-code"
			v-model="preference.zip"
			autocomplete="postal-code"
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
	</div>
	<div class="col-span-6 sm:col-span-3">
		<label
			for="country"
			class="block text-sm font-medium text-untitled-gray-700">
			Country
		</label>
		<input
			type="text"
			name="country"
			v-model="preference.country"
			id="country"
			autocomplete="country"
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
	</div>
</template>
<script>
// use normal <script> to declare options
export default {
	inheritAttrs: false,
};
</script>
<script setup>
import { defineProps, computed, ref } from 'vue';
const props = defineProps({
	preference: {
		type: Object,
		required: true,
	},
    errorValue: null,
    errorMessage: null,
});

const errorValue = computed(() => props.errorValue)
const errorMessage = computed(() => props.errorMessage)

const preference = computed({
	get() {
		return props.preference;
	},
	set(newValue) {
		newValue;
	},
});
</script>
