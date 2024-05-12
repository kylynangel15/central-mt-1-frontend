<template>
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
					<div class="flex">
						<div class="md:grid md:grid-cols-4 md:gap-6">
							<div class="mr-2 md:col-span-1">
								<SelectRoleTypes
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
				<div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
					<button
						type="button"
						@click="handleClickAddRole"
						class="flex w-full justify-center rounded-md border border-transparent bg-untitled-gray-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
						<PlusIcon class="w-5 mr-2" /> Add Role
					</button>
				</div>
			</div>

		<div class="bg-white shadow-md border border-untitled-gray-100">
			<data-table
				:items="roles"
				:columns="columns"
				:action="true"
				:actions="['Options']"
				:loading="loadingRoles"
				:error="errorApi"
				:is-paginate="true"
				:table-type="'stripe'"
				:is-sort-by-live="true"
				:pagination-options="paginationOptions"
				@showMorePage="handleClickShowMore"
				@pageChanged="handleChangePage"
				@clickValue="handelClickColumnValue"
				@sort="handleSortList">
				<template #default="{ scope }">
					<div v-if="scope.default" class="w-full">
						<ShieldCheckIcon class="w-6 mx-auto text-green-400" />
					</div>
					<div v-else>
						<span class="w-full">
							<XCircleIcon class="w-6 mx-auto text-red-400" />
						</span>
					</div>
				</template>
				<template #global="{ scope }">
					<div v-if="scope.global" class="w-full">
						<ShieldCheckIcon class="w-6 mx-auto text-green-400" />
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
				
				<template #options="{ scope }">
					<OptionDropdown
						:scope="scope"
						@viewAction="handleClickView(scope)"
						@editAction="handleClickEdit(scope)"
						@deleteAction="handleClickDelete(scope)" />
				</template>
			</data-table>
		</div>
	</div>

	<FormModal
		:is-view="isView"
		:open-modal="openModal"
		:selected-item="selectedItem"
		@closeModal="handleCloseModal"
		@storedRole="handleStoreRole"
		@updatedRole="handleUpdatedRole" />

	<global-popup-notification
		v-if="showNotification"
		:show-notification="showNotification"
		:message="messageNotification" />

	<global-delete-confirmation
		@closeModal="handleCloseModal"
		@confirmed="handleDeleteRole"
		:selected-item="selectedItem"
		:params="itemName"
		:open-modal="openDeleteConfirmation" />
</template>

<script setup>
import {
	PlusIcon,
	ShieldCheckIcon,
	XCircleIcon,
	MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline';
import { ref, onMounted, watch, watchEffect, toRefs, computed } from 'vue';
import { debounce as _debounce } from 'lodash-es';
import { useRoleStore } from '../store/useRoleStore';
import { useRouter } from 'vue-router';
import FormModal from './modals/FormModal.vue';
import OptionDropdown from './OptionDropdown.vue';
import { getRoles } from '../composables/get_roles';
import { deleteRole } from '../composables/delete_role';
import { formatDate } from '@/composables/date_formatter'
import SelectRoleTypes from '@/modules/roles/utilities/SelectRoleTypes.vue';

const roleStore = useRoleStore();

const router = useRouter();

const paginationOptions = ref({
	totalPages: 0,
	total: 0,
	hasMorePages: true,
	currentPage: 1,
	perPage: 10,
});

const roles = computed(() => roleStore.roles);
const errorApi = ref(false);
const loadingRoles = ref(true);
const openModal = ref(false);
const selectedItem = ref(null);
const messageNotification = ref(null);
const showNotification = ref(false);
const openDeleteConfirmation = ref(false);
const search = ref(null);
const isView = ref(false);
const itemName = ref(null);
const typeFilter = ref('ALL');
const sortListBy = ref({
	name: '',
	type: '',
	is_nested_sort: 0,
});

const columns = [
	{
		prop: 'name',
		label: 'System Name',
		sortable: true,
		clickable: true,
		class: '',
	},
	{
		prop: 'friendly_name',
		label: 'Friendly Name',
		sortable: true,
		clickable: false,
		class: '',
	},
	{
		prop: 'default',
		label: 'Default',
		sortable: false,
		clickable: false,
		class: '',
	},
	{
		prop: 'global',
		label: 'Global',
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
const pages = computed({
	get() {
		return [
			{
				name: 'Roles',
				to: {
					name: 'Roles Home Page',
				},
				current: false,
			},
		];
	},
	set(newValue) {
		newValue;
	},
});

const fetchRoles = async () => {
	loadingRoles.value = true;
	const params = {
		search: search.value,
		page: paginationOptions.value.currentPage,
		size: paginationOptions.value.perPage,
		filter_type: typeFilter.value,
		sort_label: sortListBy.value.name,
		sort_by: sortListBy.value.type,
		is_nested_sort: sortListBy.value.is_nested_sort,
	};

	const { load, data, hasError, totalPages, totalRoles, hasLastPage } =
		getRoles(params);
	await load();
	if (hasError.value) {
		errorApi.value = true;
	}
	paginationOptions.value.totalPages = totalPages.value;
	paginationOptions.value.total = totalRoles.value;
	paginationOptions.value.hasMorePages = hasLastPage.value;
	loadingRoles.value = false;
	roleStore.setRoles(data.value);
};

const handleClickAddRole = () => {
	router.push({ name: 'Create Role Page' });
};

const handleCloseModal = () => {
	openModal.value = false;
	openDeleteConfirmation.value = false;
};

const handleStoreRole = (role) => {
	openModal.value = false;
	fetchRoles();
	notification('Successfully added!');
};

const handleUpdatedRole = (role) => {
	openModal.value = false;
	roleStore.update(role);
	notification('Successfully updated!');
};

const handleDeleteRole = async (role) => {
	openDeleteConfirmation.value = false;
	const { data, post } = deleteRole(role);
	await post();
	fetchRoles();
	notification('Successfully deleted!');
};

const handleChangePage = (value) => {
	paginationOptions.value.perPage = parseInt(value);
	fetchRoles();
};

const handleClickShowMore = (page) => {
	paginationOptions.value.currentPage = page;
	fetchRoles();
};

const handleClickDelete = (item) => {
	openDeleteConfirmation.value = true;
	selectedItem.value = { ...item };
	itemName.value = selectedItem.value.name;
};

const handleClickEdit = (item) => {
	openModal.value = true;
	item.name = item.name.replaceAll('-', ' ');
	item.description = item.description == null ? '' : item.description;
	selectedItem.value = { ...item };
	isView.value = false;
};

const handleClickView = (item) => {
	openModal.value = true;
	isView.value = true;
	item.name = item.name.replaceAll('-', ' ');
	selectedItem.value = { ...item };
};

const notification = (message) => {
	messageNotification.value = message;
	showNotification.value = true;
	setTimeout(() => {
		showNotification.value = false;
	}, 2000);
};

const handleSortList = ({ label, sortBy, is_nested }) => {
	const { name, type, is_nested_sort } = toRefs(sortListBy.value);
	name.value = label;
	type.value = sortBy;
	is_nested_sort.value = is_nested ? 1 : 0;
	fetchRoles();
};

const handelClickColumnValue = ({item, column}) => {
	if(column == 'System Name') {
		router.push({ name: 'View Role Page', params: { id: item.id } });
	}
}

const handleClickClearFilter = () => {
	typeFilter.value = 'ALL';
	search.value = '';
	fetchRoles();
};

const onChangeSearchText = _debounce((value) => {
	fetchRoles();
}, 500);

onMounted(async () => {
	await fetchRoles();
});

watch(search, (val) => {
	onChangeSearchText(val);
});

watch(typeFilter, () => {
	fetchRoles();
});
</script>

