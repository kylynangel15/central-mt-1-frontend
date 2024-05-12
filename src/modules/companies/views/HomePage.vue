<template>
	<GlobalBreadCrumbs :pages="pages" />
	<div class="py-6">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<h1 class="text-2xl font-semibold text-gray-900">
				Companies
			</h1>
		</div>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
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
								<div class="w-40 mr-2">
									<SelectCompanyStatus
										v-model="statusFilter"
										:show-label="false" />
								</div>
								<div class="w-72 mr-2">
									<SelectCompanyType
										v-model="typeFilter"
										:show-label="false" />
								</div>

								<div class="w-72 mr-2">
									<SelectOnDemand
										v-model="filter_has_on_demand"
										:show-label="false" />
								</div>
								<div>
									<button
										type="button"
										@click="handleClickClearFilter"
										class="flex w-32 mt-1 justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-untitled-gray-500 shadow-lg mr-2 hover:bg-untitled-gray-100 focus:outline-none focus:ring-2 focus:ring-untitled-gray-400 focus:ring-offset-2">
										Clear Filter
									</button>
								</div>
							</div>
						</div>
						<div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
							<button
								type="button"
								@click="handleClickCreateCompanyPage"
								class="flex w-full justify-center rounded-md border border-transparent bg-untitled-gray-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
								<PlusIcon class="w-5 mr-2" /> New Company
							</button>
						</div>
					</div>
					<div
						class="bg-white shadow-md border border-untitled-gray-100">
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
							:showActionLabel="false"
							@clickValue="handelClickColumnValue"
							@pageChanged="handleChangePage">
							<template #status="{ scope, index }">
								<div class="w-full">
									<div
										:class="
											scope.active
												? 'bg-green-400'
												: 'bg-red-400'
										"
										class="mx-auto rounded-lg h-4 w-4"></div>
								</div>
							</template>
							<template #demand_training="{ scope }">
								<div v-if="scope.has_on_demand" class="w-full">
									<CheckCircleIcon class="w-6 mx-auto text-green-400" />
								</div>
								<div v-else>
									<span class="w-full">
										<XCircleIcon class="w-6 mx-auto text-red-400" />
									</span>
								</div>
							</template>
							<template #date_created="{ scope }">
								{{ formatDate(scope.created_at) }}
							</template>
							<template #type="{ scope }">
								<span>{{
									replaceStatusString(scope.type)
								}}</span>
							</template>
							<template #website="{ scope }">
								<span class="text-blue-500">{{
									scope.website
								}}</span>
							</template>
							<template #contact="{ scope }">
								<span class="text-sm" v-if="scope.phone_number">
									+{{ scope.phone_code
									}}{{ scope.phone_number }}</span
								>
							</template>
							<template #options="{ scope }">

								<CompanyDropdown :scope="scope" @delete-action="handleClickDelete"/>
							</template>
						</data-table>
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
		:params="itemName"
		:open-modal="openDeleteConfirmation" />
</template>

<script setup>
import { getCompanies } from '../composables/get_company';
import { deleteCompany } from '../composables/delete_company';
import { PlusIcon, TrashIcon, PencilSquareIcon } from '@heroicons/vue/20/solid';
import { useRouter } from 'vue-router';
import {
	MagnifyingGlassIcon,
	CheckCircleIcon,
	XCircleIcon
} from '@heroicons/vue/24/outline';
import { ref, watch, onMounted, toRefs, computed } from 'vue';
import SelectCompanyStatus from '../utilities/SelectCompanyStatus.vue';
import SelectCompanyType from '../utilities/SelectCompanyType.vue';
import { debounce as _debounce } from 'lodash-es';
import { useEmitter } from '@/composables/useEmitter';
import GlobalBreadCrumbs from '@/components/GlobalBreadCrumbs.vue';
import CompanyDropdown from '../components/CompanyDropdown.vue';
import { formatDate } from '@/composables/date_formatter'
import SelectOnDemand from '../utilities/SelectOnDemand.vue';

const router = useRouter();

const emitter = useEmitter;

const paginationOptions = ref({
	totalPages: 0,
	total: 0,
	currentPage: 1,
	perPage: 10,
	hasMorePages: true,
});

const itemName = ref(null)

const selectedItem = ref(null);
const showNotif = ref(false);
const messageNotif = ref('');
const openDeleteConfirmation = ref(false);
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
		prop: 'type',
		label: 'Company Type',
		slot_name: 'type',
		sortable: true,
		clickable: false,
		class: '',
	},
	{
		prop: 'apps',
		label: 'Apps',
		sortable: false,
		clickable: false,
		class: '',
	},
	{
		prop: 'has_on_demand',
		label: 'On Demand Training',
		sortable: false,
		clickable: false,
		slot_name: 'demand_training',
		class: '',
	},
	{
		prop: 'active',
		label: 'Status',
		slot_name: 'status',
		sortable: false,
		clickable: false,
		class: '',
	},
	{
		prop: 'created_at',
		label: 'Date Created',
		slot_name: 'date_created',
		sortable: false,
		clickable: false,
		class: '',
	}
];
const actions = ['options'];

const statusFilter = ref('ALL');
const typeFilter = ref('');
const search = ref('');
const filter_has_on_demand = ref('ALL')
const errorApi = ref(false);

const sortListBy = ref({
	name: '',
	type: '',
	is_nested_sort: 0,
});

const pages = computed({
	get() {
		return [
			{
				name: 'Companies',
				to: {
					name: 'Company Home Page',
				},
				current: false,
			},
		];
	},
	set(newValue) {
		newValue;
	},
});

const handleCloseModal = () => {
	openDeleteConfirmation.value = false;
};

const handelClickColumnValue = ({ item, column }) => {
	if (column == 'Company Website') {
		window.open(item.website, '_blank');
	}

	if(column == 'Name') {
		router.push({ name: 'Company Details Page', params: { id: item.id } });
	}
};

const handleChangePage = (value) => {
	paginationOptions.value.perPage = parseInt(value);
	fetchCompanies();
};

const handleSortColumnValue = ({ label, sortBy, is_nested }) => {
	const { name, type, is_nested_sort } = toRefs(sortListBy.value);
	name.value = label;
	type.value = sortBy;
	is_nested_sort.value = is_nested ? 1 : 0;
	fetchCompanies();
};

const handleClickShowMore = (page) => {
	paginationOptions.value.currentPage = page;
	fetchCompanies();
};

const handleClickDelete = (item) => {
	openDeleteConfirmation.value = true;
	selectedItem.value = { ...item };
	itemName.value = item.name
};

const handleDeleteCompany = async (role) => {
	openDeleteConfirmation.value = false;
	const { data, post } = deleteCompany(role);
	await post();
	let index = items.value.findIndex((r) => r.id == role.id);
	items.value.splice(index, 1);
	notification('Successfully deleted!');
};

const notification = (message) => {
	messageNotif.value = message;
	showNotif.value = true;
	setTimeout(() => {
		showNotif.value = false;
	}, 2000);
};

const fetchCompanies = async () => {
	loading.value = true;
	const params = {
		page: paginationOptions.value.currentPage,
		size: paginationOptions.value.perPage,
		filter_status: statusFilter.value == 'ALL' ? null : statusFilter.value == 'ACTIVE' ? 1 : 0,
		filter_type: typeFilter.value,
		search: search.value,
		sort_label: sortListBy.value.name,
		sort_by: sortListBy.value.type,
		is_nested_sort: sortListBy.value.is_nested_sort,
		filter_has_on_demand: filter_has_on_demand.value == 'ALL' ? null : filter_has_on_demand.value == 'HAS ON DEMAND' ? true : false
	};

	const { load, totalPages, data, hasMorePages, hasError, totalCompanies } =
		getCompanies(params);

	await load();
	if (hasError.value) {
		errorApi.value = true;
	}

	paginationOptions.value.totalPages = totalPages.value;
	paginationOptions.value.total = totalCompanies.value;
	paginationOptions.value.hasMorePages = hasMorePages.value;
	items.value = data.value;
	loading.value = false;
};

const handleClickClearFilter = () => {
	statusFilter.value = 'ALL';
	typeFilter.value = '';
	search.value = '';
	filter_has_on_demand.value = 'ALL'
};
const handleClickCreateCompanyPage = () => {
	router.push('companies/create');
};

const replaceStatusString = (status) => {
	let string = status.replace('_', ' ').toLowerCase();
	return string.charAt(0).toUpperCase() + string.slice(1);
};

const onChangeSearchText = _debounce((value) => {
	fetchCompanies();
}, 500);

onMounted(() => {
	fetchCompanies();
	emitter.on('NEW_COMPANY', (data) => {
		fetchCompanies();
	});

	emitter.on('UPDATED_COMPANY', (data) => {
		fetchCompanies();
	});
});

watch(statusFilter, () => {
	fetchCompanies();
});

watch(typeFilter, () => {
	fetchCompanies();
});

watch(search, (val) => {
	onChangeSearchText(val);
});

watch(filter_has_on_demand, () => {
	fetchCompanies();
})
</script>
