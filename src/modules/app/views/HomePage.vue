<template>
	<GlobalBreadCrumbs :pages="pages" />
	<div class="py-6">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<h1 class="text-2xl font-semibold text-gray-900">Apps</h1>
		</div>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<div class="py-8">
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
						<div class="md:flex">
							<div class="w-40 mr-2">
								<SelectCompanyStatus
									v-model="status"
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
							@click="handleClickAddApp"
							class="flex w-full justify-center rounded-md border border-transparent bg-untitled-gray-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
							<PlusIcon class="w-5 mr-2" /> Add Apps
						</button>
					</div>
				</div>

				<div class="bg-white shadow-md border border-untitled-gray-100">
					<data-table
						:items="apps"
						:columns="columns"
						:action="true"
						:actions="['Options']"
						:loading="loadingApps"
						:error="errorApi"
						:is-paginate="true"
						:table-type="'stripe'"
						:is-sort-by-live="true"
						:pagination-options="paginationOptions"
						@showMorePage="handleClickShowMore"
						@pageChanged="handleChangePage"
						@clickValue="handelClickColumnValue"
						@sort="handleSortList">
						<template #options="{ scope }">
							<OptionDropdown
								:scope="scope"
								@delete-action="handleClickDelete" />
						</template>
						<template #date_created="{ scope }">
							{{ formatDate(scope.created_at) }}
						</template>
						<template #status="{ scope }">
							<div class="w-full">
								<div :class="
									scope.active
										? 'bg-green-400'
										: 'bg-red-400'
								" class="mx-auto rounded-lg h-4 w-4"></div>
							</div>
						</template>
					</data-table>
				</div>
			</div>
		</div>
	</div>
	<FormModal
		:is-view="isView"
		:open-modal="openModal"
		:selected-item="selectedItem"
		@closeModal="handleCloseModal"
		@storedApp="handleStoreApp"
		@updatedApp="handleUpdatedApp" />

	<global-popup-notification
		v-if="showNotif"
		:show-notification="showNotif"
		:message="messageNotif" />

	<global-delete-confirmation
		@closeModal="handleCloseModal"
		@confirmed="handleDeleteApp"
		:selected-item="selectedItem"
		:params="itemName"
		:open-modal="openDeleteConfirmation" />
</template>

<script setup>
import {
	EllipsisVerticalIcon,
	EyeIcon,
	MagnifyingGlassIcon,
	PencilSquareIcon,
	PlusIcon,
	TrashIcon,
} from '@heroicons/vue/24/outline';
import { ref, onMounted, watch, watchEffect, computed, toRefs } from 'vue';
import FormModal from '../components/modals/FormModal.vue';
import { getApps } from '../composables/get_apps';
import { deleteApp } from '../composables/delete_apps';
import OptionDropdown from '../components/OptionDropdown.vue';
import { debounce as _debounce } from 'lodash-es';
import { useAppStore } from '../store/useAppStore';
import { useRouter } from 'vue-router';
import GlobalBreadCrumbs from '@/components/GlobalBreadCrumbs.vue';
import SelectCompanyStatus from '@/modules/companies/utilities/SelectCompanyStatus.vue';
import { formatDate } from '@/composables/date_formatter'

const appStore = useAppStore();
const router = useRouter();

const paginationOptions = ref({
	totalPages: 0,
	total: 0,
	hasMorePages: true,
	currentPage: 1,
	perPage: 10,
});

const apps = ref([]);
const errorApi = ref(false);
const loadingApps = ref(false);
const openModal = ref(false);
const selectedItem = ref(null);
const messageNotif = ref(null);
const showNotif = ref(false);
const openDeleteConfirmation = ref(false);
const search = ref(null);
const isView = ref(false);
const itemName = ref(null);
const status = ref('ALL');
const isActive = ref(null);

const sortListBy = ref({
	name: '',
	type: '',
	is_nested_sort: 0,
});

const pages = computed({
	get() {
		return [
			{
				name: 'Apps',
				to: {
					name: 'App Home Page',
				},
				current: false,
			},
		];
	},
	set(newValue) {
		newValue;
	},
});

const columns = [
	{
		prop: 'name',
		label: 'Name',
		sortable: true,
		clickable: true,
		class: '',
	},
	{
		prop: 'version',
		label: 'version',
		sortable: true,
		clickable: false,
		class: '',
	},
	{
		prop: 'redirect',
		label: 'redirect',
		sortable: false,
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

const fetchApps = async () => {
	loadingApps.value = true;

	const params = {
		search: search.value,
		page: paginationOptions.value.currentPage,
		size: paginationOptions.value.perPage,
		sort_label: sortListBy.value.name,
		sort_by: sortListBy.value.type,
		is_nested_sort: sortListBy.value.is_nested_sort,
		active: isActive.value,
	};

	const { load, data, hasError, totalPages, totalApps, hasLastPage } =
		getApps(params);
	await load();

	if (hasError.value) {
		errorApi.value = true;
		return;
	}

	apps.value = data.value;
	paginationOptions.value.hasMorePages = hasLastPage.value;
	paginationOptions.value.totalPages = totalPages.value;
	paginationOptions.value.total = totalApps.value;
	loadingApps.value = false;
};

const notification = (message) => {
	messageNotif.value = message;
	showNotif.value = true;
	setTimeout(() => {
		showNotif.value = false;
	}, 2000);
};

const handleClickAddApp = () => {
	router.push({ name: 'Create App Page' });
};

const handleStoreApp = (app) => {
	openModal.value = false;
	fetchApps();
	notification('Successfully added!');
};

const handleUpdatedApp = (app) => {
	openModal.value = false;
	appStore.update(app);
	notification('Successfully updated!');
};

const handleDeleteApp = async (app) => {
	openDeleteConfirmation.value = false;
	const { data, destroy } = deleteApp(app);
	await destroy();
	fetchApps();
	notification('Successfully deleted!');
};

const handleClickDelete = (item) => {
	openDeleteConfirmation.value = true;
	selectedItem.value = { ...item };
	itemName.value = selectedItem.value.name;
};

const handleCloseModal = () => {
	openDeleteConfirmation.value = false;
};

const handleClickShowMore = (page) => {
	paginationOptions.value.currentPage = page;
	fetchApps();
};

const handleChangePage = (value) => {
	paginationOptions.value.perPage = parseInt(value);
	fetchApps();
};

const handleSortList = ({ label, sortBy, is_nested }) => {
	const { name, type, is_nested_sort } = toRefs(sortListBy.value);
	name.value = label;
	type.value = sortBy;
	is_nested_sort.value = is_nested ? 1 : 0;
	fetchApps();
};

const handelClickColumnValue = ({ item, column }) => {
	if(column == 'Name') {
		router.push({ name: 'View App Page', params: { id: item.id } });
	}
}

const handleClickClearFilter = () => {
	status.value = 'ALL'
	isActive.value = null
}

onMounted(async () => {
	await fetchApps();
});

const onChangeSearchText = _debounce((value) => {
	fetchApps();
}, 500);

watch(search, (val) => {
	onChangeSearchText(val);
});

watch(status, (val) => {
	isActive.value = '';
	
	if (val == 'ACTIVE') {
		isActive.value = 1;
	}

	if (val == 'INACTIVE') {
		isActive.value = 0;
	}

	fetchApps();
});

const replaceStatusString = (status) => {
	return status.replace('_', ' ');
};
</script>
