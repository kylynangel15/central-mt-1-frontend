<template>
	<div class="mt-10">
		<h3 class="text-lg font-medium leading-6 text-gray-900">Company</h3>
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
						<div class="md:grid md:grid-cols-4 md:gap-6">
							<div class="mr-2 md:col-span-1">
								<SelectCompanyStatus
									v-model="statusFilter"
									:show-label="false" />
							</div>
							<div class="mr-2 md:col-span-2">
								<SelectCompanyType
									v-model="typeFilter"
									:show-label="false" />
							</div>
							<div class="mr-2 md:col-span-1 flex">
								<button
									type="button"
									@click="handleClickClearFilter"
									class="flex w-32 mt-1 justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-untitled-gray-500 shadow-lg mr-2 hover:bg-untitled-gray-100 focus:outline-none focus:ring-2 focus:ring-untitled-gray-400 focus:ring-offset-2">
									Clear Filter
								</button>
							</div>
						</div>
					</div>
				</div>
				<div class="mt-4 sm:mt-0 sm:ml-16 md:flex xs:flex-none">
					<button
						v-if="isAdministrator && items.length > 0"
						type="button"
						@click="handleClickDetach"
						class="flex w-56 justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-untitled-gray-500 shadow-lg mr-2 hover:bg-untitled-gray-100 focus:outline-none focus:ring-2 focus:ring-untitled-gray-400 focus:ring-offset-2">
						<MinusCircleIcon class="w-5 mr-2" /> Detach all company
					</button>
					<button
						type="button"
						@click="handleClickCreateCompanyPage"
						class="flex sm:mt-2 md:mt-0 mr-2 justify-center rounded-md border border-transparent bg-untitled-gray-500 py-2 h-10 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
						<PlusIcon class="w-5 mr-2" /> Attach Companies
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
					<template #status="{ scope, index }">
						<div class="w-full">
							<div
								:class="
									scope.active
										? 'bg-green-400'
										: 'bg-gray-100'
								"
								class="mx-auto rounded-lg h-4 w-4"></div>
						</div>
					</template>
					<template #type="{ scope }">
						<span>{{ replaceStatusString(scope.type) }}</span>
					</template>
					<template #website="{ scope }">
						<span class="text-blue-500">{{ scope.website }}</span>
					</template>
					<template #contact="{ scope }">
						<span class="text-sm" v-if="scope.phone_number">
							+{{ scope.phone_code
							}}{{ scope.phone_number }}</span
						>
					</template>
					<template #date_created="{ scope }">
						{{ formatDate(scope.created_at) }}
					</template>

					<template #options="{ scope }">
						<CompanyDropdown
							:from-app-page="true"
							@delete-action="handleClickDelete"
							:scope="scope"
							@remove-from-app="handleClickRemoveFromApp" />
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

	<global-delete-confirmation
		@closeModal="handleCloseModal"
		@confirmed="handleDeleteCompany"
		:selected-item="selectedItem"
		:params="itemName"
		:open-modal="openDeleteConfirmation" />

	<global-delete-confirmation
		@closeModal="handleCloseModal"
		@confirmed="handleRemoveCompanyFromApp"
		:selected-item="selectedItem"
		:params="itemName"
		:message="removeMessage"
		:dialog-title="'Remove Confirmation'"
		:open-modal="openRemoveConfirmation" />
</template>

<script>
// use normal <script> to declare options
export default {
	inheritAttrs: false,
};
</script>
<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { PlusIcon, TrashIcon, PencilSquareIcon } from '@heroicons/vue/20/solid';
import { useRouter } from 'vue-router';
import {
	ComputerDesktopIcon,
	EllipsisVerticalIcon,
	EyeIcon,
	MagnifyingGlassIcon,
	UsersIcon,
	BuildingOffice2Icon,
	QueueListIcon,
	MinusCircleIcon,
} from '@heroicons/vue/24/outline';
import { ref, watch, onMounted, toRefs, computed, defineProps } from 'vue';
import { debounce as _debounce } from 'lodash-es';
import { useEmitter } from '@/composables/useEmitter';
import { deleteCompany } from '@/modules/companies/composables/delete_company';
import { getCompanies } from '@/modules/companies/composables/get_company';
import SelectCompanyStatus from '@/modules/companies/utilities/SelectCompanyStatus.vue';
import SelectCompanyType from '@/modules/companies/utilities/SelectCompanyType.vue';
import AddCompany from './modals/AddCompany.vue';
import { removeCompany } from '../composables/remove_company';
import { useAdminSettingStore } from '@/store/useAdminSettingStore';
import CompanyDropdown from '@/modules/companies/components/CompanyDropdown.vue';
import { formatDate } from '@/composables/date_formatter'

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

const appProfile = ref({});

const isAdministrator = computed(() => isAdmin.isAdministrator);

const removeMessage = ref('Are you sure you want to detach this company ');

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
		clickable: false,
		class: '',
	},
	{
		prop: 'website',
		label: 'Company Website',
		slot_name: 'website',
		sortable: false,
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
		prop: 'phone_number',
		label: 'Contact No.',
		slot_name: 'contact',
		sortable: true,
		clickable: false,
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
	if (column == 'Company Website') {
		window.open(item.website, '_blank');
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
	itemName.value = item.name;
};

const handleClickRemoveFromApp = (item) => {
	openRemoveConfirmation.value = true;
	selectedItem.value = { ...item };
	itemName.value = item.name;
};

const handleClickDetach = () => {
	openRemoveConfirmation.value = true;
	removeMessage.value =
		'Are you sure you want to remove all company from this app';
	selectedItem.value = 'all';
};

const handleClickEdit = (item) => {
	router.push({
		name: 'Company Details Page',
		params: { id: item.id },
		query: { component: 'Account' },
	});
};

const handleCloseAddCompanyModal = () => {
	openModal.value = false;
};

const handleAddCompany = () => {
	openModal.value = false;
	fetchCompanies();
};

const handleClickCustomDomain = (item) => {
	router.push({
		name: 'Company Details Page',
		params: {
			id: item.id,
		},
		query: {
			tab: 'Domain Settings',
		},
	});
};

const handleClickView = (item) => {
	router.push({ name: 'Company Details Page', params: { id: item.id } });
};

const handleClickAddUser = (item) => {
	router.push({
		name: 'Create Company User Page',
		params: {
			id: item.id,
		},
		query: {
			name: item.name,
		},
	});
};

const handleClickViewUsers = (item) => {
	router.push({
		name: 'Company Details Page',
		params: {
			id: item.id,
		},
		query: {
			tab: 'Users',
		},
	});
};

const handleClickAddStore = (item) => {
	router.push({
		name: 'Create Company Store Page',
		params: {
			id: item.id,
		},
		query: {
			name: item.name,
		},
	});
};

const handleClickViewStores = (item) => {
	router.push({
		name: 'Company Details Page',
		params: {
			id: item.id,
		},
		query: {
			tab: 'Stores',
		},
	});
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
	fetchCompanies();
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
		filter_status: getStatusFilter(),
		filter_type: typeFilter.value,
		search: search.value,
		sort_label: sortListBy.value.name,
		sort_by: sortListBy.value.type,
		is_nested_sort: sortListBy.value.is_nested_sort,
		app_id: appId.value,
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

const getStatusFilter = () => {
	if (statusFilter.value == 'ACTIVE') {
		return true;
	}

	if (statusFilter.value == 'INACTIVE') {
		return false;
	}

	return null;
}

const handleClickClearFilter = () => {
	statusFilter.value = '';
	typeFilter.value = '';
	search.value = '';
	fetchCompanies();
};

const handleClickCreateCompanyPage = () => {
	openModal.value = true;
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
</script>
