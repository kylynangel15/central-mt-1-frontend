<template>
	<li
		:class="[
			active ? 'text-white bg-untitled-gray-600' : 'text-gray-900',
			'relative cursor-default select-none py-2 pl-3 pr-9',
		]">
		<div class="flex items-center">
			<country-flag
				class="inline-block h-2 w-2 flex-shrink-0"
				:country="country.countryCode"
				size="small" />
			<span
				:class="[
					selected ? 'font-semibold' : 'font-normal',
					'ml-3 block truncate',
				]">
				{{ country.name }}
			</span>
		</div>

		<span
			v-if="selected"
			:class="[
				active ? 'text-white' : 'text-untitled-gray-600',
				'absolute inset-y-0 right-0 flex items-center pr-4',
			]">
			<CheckIcon class="h-5 w-5" aria-hidden="true" />
		</span>
	</li>
</template>
<script setup>
import { CheckIcon } from '@heroicons/vue/24/outline';
import { computed } from 'vue';
import CountryFlag from 'vue-country-flag-next';

const props = defineProps({
	country: {
		type: Object,
		default: () => {},
	},
	selected: {
		type: Boolean,
		default: false,
	},
	active: null,
});

const country = computed(() => props.country);
const active = computed(() => props.active);
const selected = computed(() => props.selected);
</script>
