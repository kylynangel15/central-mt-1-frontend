<template>
	<Combobox
		v-model="selectedUser"
		by="id"
		:disabled="isDisabled || isReadOnly"
		:multiple="isMultiple">
		<ComboboxLabel
			v-if="showLabel"
			class="block text-sm font-medium text-untitled-gray-700">
			User <RequiredSpan v-if="isRequired" />
		</ComboboxLabel>
		<div class="relative mt-1">
			<div class="absolute z-[10] flex flex-col" v-if="isMultiple">
				<p
					v-if="showSelectedItems"
					class="flex items-center ml-5 mt-1 max-h-[2rem] h-[2rem] text-sm">
					{{ displaySelectedItem() }}
					{{
						selectedUser &&
						typeof selectedUser == 'array' &&
						selectedUser.length == 0
							? 'SelectCompanies'
							: ''
					}}
				</p>
			</div>
			<ComboboxButton
				@click="handleSearch"
				class="block w-full appearance-none placeholder-untitled-gray-400 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-untitled-gray-500 sm:text-sm">
				<ComboboxInput
					:placeholder="selectedUser ? '' : 'Select Company '"
					@keyup="handleSearch"
					:disabled="isDisabled"
					@change="query = $event.target.value"
					class="w-full text-untitled-gray-600 rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-1 focus:ring-untitled-gray-500 sm:text-sm"
					:displayValue="
						(user) => {
							if (user && user.name) return user.name;
							if (isSelectAll) return 'All';
						}
					" />
				<XMarkIcon
					v-if="
						(selectedUser &&
							selectedUser.id &&
							showLabel &&
							!isDisabled) ||
						selectedUser.length > 0
					"
					@click.prevent="clearFilter"
					class="absolute inset-y-0 mr-2 mt-2 right-0 h-5 w-5"
					aria-hidden="true" />
			</ComboboxButton>
			<TransitionRoot
				leave="transition ease-in duration-100"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
				@after-leave="
					query = '';
					showSelectedItems = true;
				">
				<ComboboxOptions
					v-infinite-scroll="loadMoreCompanies"
					:infinite-scroll-immediate-check="false"
					infinite-scroll-watch-disabled="disableScroll"
					class="max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm absolute z-[900]">
					<div
						v-if="users.length === 0 && query !== '' && !loading"
						class="relative cursor-default select-none py-2 px-4 text-gray-700">
						Nothing found.
					</div>
					<div
						v-if="loading && query !== ''"
						class="relative cursor-default select-none py-2 px-4 text-gray-700">
						Searching.....
					</div>
					<ComboboxOption
						v-for="user in users.filter((obj, index) => {
							return (
								index ===
								users.findIndex(
									(o) =>
										obj.id === o.id && obj.name === o.name
								)
							);
						})"
						as="template"
						:key="user.id"
						:value="user"
						v-slot="{ selected, active }">
						<li
							class="relative cursor-default select-none py-2 pl-10 pr-4"
							:class="{
								'bg-untitled-gray-200 text-black':
									active || isSelectAll,
								'text-untitled-gray-900':
									!active || !isSelectAll,
							}">
							<span
								class="block truncate"
								:class="{
									'font-medium': selected || isSelectAll,
									'font-normal': !selected || !isSelectAll,
								}">
								{{ user.name }}
							</span>

							<span
								v-if="selected"
								class="absolute inset-y-0 left-0 flex items-center pl-3"
								:class="{
									'text-untitled-gray-600':
										active || isSelectAll,
									'text-untitled-untitled-gray-600':
										!active && isSelectAll,
								}">
								<XMarkIcon class="h-5 w-5" aria-hidden="true" />
							</span>
						</li>
					</ComboboxOption>
				</ComboboxOptions>
			</TransitionRoot>
		</div>
	</Combobox>
</template>
<script setup>
import {
	Combobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxLabel,
	ComboboxOption,
	ComboboxOptions,
	TransitionRoot,
} from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import {
	ref,
	defineProps,
	defineEmits,
	onMounted,
	onBeforeMount,
	watch,
	computed,
	defineAsyncComponent,
} from 'vue';
import { debounce as _debounce } from 'lodash-es';
import RequiredSpan from '@/components/RequiredSpan.vue';
import { getUsers } from '@/modules/companies/composables/user/get_users';

const props = defineProps({
	modelValue: null,
	showLabel: {
		type: Boolean,
		default: true,
		required: false,
	},
	isDisabled: {
		type: Boolean,
		default: false,
		required: false,
	},
	isReadOnly: {
		type: Boolean,
		default: false,
		required: false,
	},
	isRequired: {
		type: Boolean,
		default: false,
		required: false,
	},
	showAllCompany: {
		type: Boolean,
		default: false,
		required: false,
	},
	isMultiple: {
		type: Boolean,
		default: true,
		required: false,
	},
	companyId: {
		type: Number,
		default: null,
	},
    filterByTag: {
        type: Number,
        default: null,
        required: false
    }
});

const emit = defineEmits(['update:modelValue', 'clearUsers', 'clearRole']);

const showLabel = computed(() => props.showLabel);

const loading = ref(true);

const isRequired = computed(() => props.isRequired);

const showAllCompany = computed(() => props.showAllCompany);
const isSelectAll = ref(false);
const isMultiple = computed(() => props.isMultiple);

const totalSelected = ref(0);
const selectedUser = computed({
	get() {
		return props.modelValue;
	},
	set(newValue) {
		emit('update:modelValue', newValue);
	},
});

const isDisabled = computed(() => props.isDisabled);
const isReadOnly = computed(() => props.isReadOnly);
const companyId = computed(() => props.companyId);
const filterByTag = computed(() => props.filterByTag)
const showSelected = ref(false);
const users = ref([]);
const showSelectedItems = ref(true);
const query = ref('');
const hasMorePage = ref(true);
const params = ref({
	search: '',
	page: 1,
	size: 10,
	company_id: companyId.value,
	filter_tag_user: filterByTag.value
});

const fetchUsers = async () => {
	loading.value = true;
	params.value.search = query.value;
	const { load, data, hasLastPage } = getUsers(params.value);
	await load();
	let usersData = users.value.concat(data.value);
	users.value = usersData;
	hasMorePage.value = hasLastPage.value;
	loading.value = false;
};

const handleSearch = (e) => {
	showSelectedItems.value = e.target.value?.length > 0 ? false : true;
};

const loadMoreCompanies = () => {
	if (!hasMorePage.value) return;
	params.value.page = params.value.page + 1;
};

const handleCLickSelectAllCompany = () => {
	isSelectAll.value = !isSelectAll.value;
	emit('update:modelValue', isSelectAll ? 'All' : []);
};

const clearFilter = () => {
	emit('clearUsers', selectedUser.value);
};

const displaySelectedItem = () => {
	if (!isMultiple.value) return;

	if (!selectedUser.value) return;

	if (isSelectAll.value) return;

	const totalSelectedItem = selectedUser.value.length + 1;

	totalSelected.value = totalSelectedItem;

	if (!selectedUser.value.length) return;

	if (selectedUser.value.length <= 2) {
		return selectedUser.value.map((item) => item.name).join(',');
	} else {
		return (
			selectedUser.value
				.map((item) => item.name)
				.slice(0, 2)
				.join(' , ') + ` +${totalSelectedItem - 2}`
		);
	}
};

const onChangeSearchText = _debounce((value) => {
	users.value = [];
	fetchUsers();
}, 500);

watch(query, (val) => {
	onChangeSearchText(val);
});

watch(params.value, () => {
	fetchUsers();
});

watch(companyId, async (val) => {
	users.value = [];
	params.value.company_id = val;
	selectedUser.value = [];
});

onBeforeMount(() => {
	fetchUsers();
});
</script>
