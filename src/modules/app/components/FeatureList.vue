<template>
	<div class="mt-10">
		<h3 class="text-lg font-medium leading-6 text-gray-900">Features</h3>
	</div>
	<div class="py-8">
		<div class="">
			<div class="mb-2">
				<div class="relative mt-1 rounded-md shadow-sm">
					<div
						class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<MagnifyingGlassIcon
							class="h-5 w-5 text-gray-400"
							aria-hidden="true" />
					</div>
					<input
						id="search"
						name="search"
						v-model="search"
						type="text"
						placeholder="Type to search"
						autocomplete="search"
						class="block w-full appearance-none rounded-md border border-untitled-gray-300 pl-10 px-3 py-2 placeholder-untitled-gray-400 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-untitled-gray-500 sm:text-sm" />
				</div>
			</div>
			<div class="sm:flex sm:items-center mb-10">
				<div class="sm:flex-auto">
					<div class="flex">
					</div>
				</div>
				<div class="mt-4 sm:mt-0 sm:ml-16 md:flex xs:flex-none">
					<button
						type="button"
						@click="handleClickCreateFeature"
						class="flex sm:mt-2 md:mt-0 mr-2 justify-center rounded-md border border-transparent bg-untitled-gray-500 py-2 h-10 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
						<PlusIcon class="w-5 mr-2" /> Add Feature
					</button>
				</div>
			</div>
			<div class="bg-white shadow-md border border-untitled-gray-100">
				<data-table
					:items="items"
					:columns="columns"
					:action="true"
					:actions="actions"
					:loading="loading"
					:error="errorApi"
					:is-paginate="true"
					:table-type="'stripe'"
					:is-sort-by-live="true"
					:pagination-options="paginationOptions"
					@showMorePage="handleClickShowMore"
					@sort="handleSortColumnValue"
					:showActionLabel="true"
					@clickValue="handelClickColumnValue"
					@pageChanged="handleChangePage">
					<template #created="{ scope }">
						<span class="">{{ formatDate(scope.created_at) }}</span>
					</template>
					<template #options="{ scope }">
						<FeatureDropdown
							@delete-action="handleClickDelete"
							:scope="scope"
							:app-id="parseInt(appId)" />
					</template>
				</data-table>
			</div>
		</div>
	</div>
	<AddCompany
		v-if="openModal"
		:open-modal="openModal"
		:app-profile="app"
		:selectedCompanies="items"
		@close-modal="handleCloseAddCompanyModal"
		@addCompany="handleAddCompany" />

	<global-popup-notification
		v-if="showNotif"
		:show-notification="showNotif"
		:message="messageNotif" />
</template>

<script>
// use normal <script> to declare options
export default {
    inheritAttrs: false,
};
</script>
<script setup>
import { PlusIcon } from '@heroicons/vue/20/solid';
import { useRouter } from 'vue-router';
import {
	MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline';
import { ref, watch, onMounted, toRefs, computed, defineProps } from 'vue';
import { debounce as _debounce } from 'lodash-es';
import { useEmitter } from '@/composables/useEmitter';
import { deleteCompany } from '@/modules/companies/composables/delete_company';
import SelectCompanyStatus from '@/modules/companies/utilities/SelectCompanyStatus.vue';
import SelectCompanyType from '@/modules/companies/utilities/SelectCompanyType.vue';
import AddCompany from './modals/AddCompany.vue';
import { removeCompany } from '../composables/remove_company';
import { useAdminSettingStore } from '@/store/useAdminSettingStore';
import { getFeatures } from '../composables/features/get_features';
import FeatureDropdown from './feature/FeatureDropdown.vue';
import { formatDate } from '@/composables/date_formatter';

const props = defineProps({
	appId: {
		type: Number,
		default: false,
		required: true,
	},
	app: {
		type: Object,
		default: () => {},
	},
});

const isAdmin = useAdminSettingStore();

const itemName = ref(null);

const router = useRouter();

const emitter = useEmitter;

const appId = computed(() => props.appId);

const app = computed(() => props.app);

const isAdministrator = computed(() => isAdmin.isAdministrator);

const paginationOptions = ref({
	totalPages: 0,
	total: 0,
	currentPage: 1,
	perPage: 10,
	hasMorePages: true,
});

const openModal = ref(false);

const selectedItem = ref(null);
const showNotif = ref(false);
const messageNotif = ref('');
const openDeleteConfirmation = ref(false);
const openRemoveConfirmation = ref(false);
const loading = ref(true);
const items = ref([]);
const columns = [
	{
		prop: 'name',
		label: 'Name',
		slot_name: 'name',
		sortable: true,
		clickable: true,
		class: '',
	},
	{
		prop: 'created_at',
		label: 'Created',
		slot_name: 'created',
		sortable: true,
		clickable: false,
		class: '',
	},
];
const actions = ['options'];

const statusFilter = ref('');
const typeFilter = ref('');
const search = ref('');
const errorApi = ref(false);

const sortListBy = ref({
	name: '',
	type: '',
	is_nested_sort: 0,
});

const handleCloseModal = () => {
	openDeleteConfirmation.value = false;
	openRemoveConfirmation.value = false;
};

const handelClickColumnValue = ({ item, column }) => {
	if (column == 'Name') {
		router.push({ name: 'View Feature Page', params: { id: appId.value, featureId: item.id } });
	}
};

const handleChangePage = (value) => {
	paginationOptions.value.perPage = parseInt(value);
	fetchFeatures();
};

const handleSortColumnValue = ({ label, sortBy, is_nested }) => {
	const { name, type, is_nested_sort } = toRefs(sortListBy.value);
	name.value = label;
	type.value = sortBy;
	is_nested_sort.value = is_nested ? 1 : 0;
	fetchFeatures();
};

const handleClickShowMore = (page) => {
	paginationOptions.value.currentPage = page;
	fetchFeatures();
};

const handleClickDelete = (item) => {
	notification('Successfully deleted!')
	fetchFeatures();
};

const handleClickRemoveFromApp = (item) => {
	openRemoveConfirmation.value = true;
	selectedItem.value = { ...item };
	itemName.value = item.name;
};


const handleCloseAddCompanyModal = () => {
	openModal.value = false;
};

const handleAddCompany = () => {
	openModal.value = false;
	fetchFeatures();
};

const handleDeleteCompany = async (role) => {
	openDeleteConfirmation.value = false;
	const { data, post } = deleteCompany(role);
	await post();
	let index = items.value.findIndex((r) => r.id == role.id);
	items.value.splice(index, 1);
	notification('Successfully deleted!');
};

const handleRemoveCompanyFromApp = async (item) => {
	const params = {
		app_id: appId.value,
		companies: item == 'all' ? 'all' : [item.id],
	};

	const { destroy } = removeCompany(params);
	await destroy();
	notification('Successfully removed!');
	openRemoveConfirmation.value = false;
	fetchFeatures();
};

const notification = (message) => {
	messageNotif.value = message;
	showNotif.value = true;
	setTimeout(() => {
		showNotif.value = false;
	}, 2000);
};

const fetchFeatures = async () => {
	loading.value = true;
	const params = {
		page: paginationOptions.value.currentPage,
		size: paginationOptions.value.perPage,
		filter_status: statusFilter.value == 'ACTIVE' ? 1 : 0,
		filter_type: typeFilter.value,
		search: search.value,
		sort_label: sortListBy.value.name,
		sort_by: sortListBy.value.type,
		is_nested_sort: sortListBy.value.is_nested_sort,
		app_id: appId.value,
	};

	const { load, totalPages, data, hasLastPage, hasError, totalFeatures } =
		getFeatures(params);

	await load();
	if (hasError.value) {
		errorApi.value = true;
	}

	paginationOptions.value.totalPages = totalPages.value;
	paginationOptions.value.total = totalFeatures.value;
	paginationOptions.value.hasMorePages = hasLastPage.value;
	items.value = data.value;
	loading.value = false;
};

const handleClickClearFilter = () => {
	statusFilter.value = '';
	typeFilter.value = '';
	search.value = '';
	fetchFeatures();
};

const handleClickCreateFeature = () => {
	router.push({ name: 'Create Feature Page', params: { id: appId.value}})
};

const replaceStatusString = (status) => {
	let string = status.replace('_', ' ').toLowerCase();
	return string.charAt(0).toUpperCase() + string.slice(1);
};

const onChangeSearchText = _debounce((value) => {
	fetchFeatures();
}, 500);

onMounted(() => {
	fetchFeatures();
});

watch(statusFilter, () => {
	fetchFeatures();
});

watch(typeFilter, () => {
	fetchFeatures();
});

watch(search, (val) => {
	onChangeSearchText(val);
});
</script>
