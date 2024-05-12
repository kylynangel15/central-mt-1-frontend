<template>
	<Listbox as="div" v-model="selectedCountry">
		<div class="relative w-full" :class="[selectedCountry ? 'mt-2' : '']">
			<ListboxButton
				@click="handleClickSelectCountry"
				:class="[selectedCountry ? 'h-full' : 'py-4 -mt-1']"
				class="relative w-28 border-r h-9 border-untitled-gray-400 cursor-default rounded-l-md bg-white pl-3 text-left shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-1 focus:ring-untitled-gray-500 sm:text-sm">
				<span
					class="flex items-center text-untitled-gray-500"
					v-if="selectedCountry">
					<country-flag
						class="inline-block h-2 w-2 flex-shrink-0"
						:country="selectedCountry.countryCode"
						size="small" />
					<span class="block truncate"
						>{{ selectedCountry.countryCode }} +{{
							selectedCountry.phone
						}}</span
					>
				</span>
				<span
					class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
					<ChevronUpDownIcon
						class="h-5 w-3 text-gray-400"
						aria-hidden="true" />
				</span>
			</ListboxButton>

			<transition
				leave-active-class="transition ease-in duration-100"
				leave-from-class="opacity-100"
				:on-leave="handleLeaveCancelled"
				leave-to-class="opacity-0">
				<ListboxOptions
					class="absolute w-96 z-10 max-h-60 overflow-y-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
					v-infinite-scroll="loadMoreCompanies"
					:infinite-scroll-immediate-check="false"
					infinite-scroll-watch-disabled="disableScroll">
					<input
						type="text"
						placeholder="Search country"
						v-model="query"
						v-if="showSearch"
						class="block w-full border-gray-300 focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
					<ListboxOption
						as="template"
						v-for="country in countryData"
						:key="country.id"
						:value="country"
						v-slot="{ active, selected }">
						<PhoneCountry
							:country="country"
							:selected="selected"
							:active="active" />
					</ListboxOption>
					<div class="w-full p-4 text-center items-center justify-center" v-if="countryData.length == 0 && query != ''">
						<span class="text-untitled-gray-500 text-sm">No Countries Available</span>
					</div>
				</ListboxOptions>
			</transition>
		</div>
	</Listbox>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid';
import { countries as countryList } from './countries';
import CountryFlag from 'vue-country-flag-next';
import {
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
} from '@headlessui/vue';
import PhoneCountry from './PhoneCountry.vue';

const props = defineProps({
	defaultCountry: {
		type: String,
		default: 'US',
	},
	modelValue: {
		type: Object,
		default: () => {},
	},
});

const emit = defineEmits(['update:modelValue']);

const countries = ref(countryList);
const defaultCountry = computed(() => props.defaultCountry);
const currentPage = ref(1);
const maxPerPage = ref(10);

const query = ref('');
const selectedCountry = computed({
	get() {
		return props.modelValue;
	},
	set(newValue) {
		emit('update:modelValue', newValue);
	},
});
const oldCountries = ref([]);

const filteredCountries = computed(() =>
	query.value === ''
		? countries.value.slice(
				maxPerPage.value * (currentPage.value - 1),
				maxPerPage.value * currentPage.value
		  )
		: countries.value
				.filter((country) => {
					return country.name
						.toLowerCase()
						.includes(query.value.toLowerCase());
				})
				.slice(
					maxPerPage.value * (currentPage.value - 1),
					maxPerPage.value * currentPage.value
				)
);

const countryData = ref(filteredCountries.value);

const totalCountries = computed(() => countries.value.length);

const showSearch = ref(false);

const findCountryByDefault = () => {
	selectedCountry.value = countries.value.find(
		(country) =>
			country.countryCode.toLowerCase() ===
			defaultCountry.value.toLowerCase()
	);
};

const handleClickSelectCountry = () => {
	showSearch.value = true;
};

const handleLeaveCancelled = () => {
	showSearch.value = false;
	query.value = '';
	currentPage.value = 1;
};

const loadMoreCompanies = () => {
	oldCountries.value = countryData.value;
	currentPage.value++;
	let oldData = oldCountries.value.concat(filteredCountries.value);
	countryData.value = oldData;
};

onMounted(() => {
	findCountryByDefault();
});

watch(query, () => {
	countries.value = countryList
	currentPage.value = 1;
	countryData.value = filteredCountries.value;
});
</script>
