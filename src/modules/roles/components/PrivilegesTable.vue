<template>
	<div class="py-8">
		<!-- <div class="sm:flex sm:items-center mb-10">
			<div class="sm:flex-auto">
				<input
					id="search"
					name="search"
					v-model="search"
					type="text"
					placeholder="Type to search"
					autocomplete="search"
					class="block w-96 appearance-none rounded-md border border-untitled-gray-300 px-3 py-2 placeholder-untitled-gray-400 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-untitled-gray-500 sm:text-sm" />
			</div>
			<div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
				<button
					type="button"
					@click="handleClickAddPrivilege"
					class="flex w-full justify-center rounded-md border border-transparent bg-untitled-gray-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
					<PlusIcon class="w-5 mr-2" /> Add Privilege
				</button>
			</div>
		</div> -->
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
						<SelectPrivilegeStatus
							v-model="status"
							:show-label="false" />
					</div>
					<div class="w-72 mr-2">
						<SelectFeature
							v-model="feature"
							:show-label="false" />
					</div>
					<div class="w-72 mr-2">
						<SelectSuperAdmin
							v-model="is_admin"
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
					@click="handleClickAddPrivilege"
					class="flex w-full justify-center rounded-md border border-transparent bg-untitled-gray-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
					<PlusIcon class="w-5 mr-2" /> Add Privilege
				</button>
			</div>
		</div>
		<div class="bg-white shadow-md border border-untitled-gray-100">
			<data-table
				:items="privileges"
				:columns="columns"
				:action="true"
				:actions="['Options']"
				:loading="loadingPrivileges"
				:error="errorApi"
				:is-paginate="true"
				:table-type="'stripe'"
				:is-sort-by-live="true"
				:pagination-options="paginationOptions"
				@showMorePage="handleClickShowMore"
				@pageChanged="handleChangePage"
				@clickValue="handelClickColumnValue"
				@sort="handleSortList">
				<template #status="{ scope, index }">
					<div class="w-full">
						<div
							:class="
								scope.status ? 'bg-green-400' : 'bg-red-400'
							"
							class="mx-auto rounded-lg h-4 w-4"></div>
					</div>
				</template>
				<template #super_admin="{ scope }">
					<div v-if="scope.is_superadmin" class="w-full">
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

				<template #options="{ scope }">
					<PrivilegeDropdown
						:scope="scope"
						@deleteAction="handleClickDelete(scope)" />
				</template>
			</data-table>
		</div>
	</div>
	<global-popup-notification
		v-if="showNotification"
		:show-notification="showNotification"
		:message="messageNotification" />
</template>
<script setup>
import { ref, computed, onMounted, watch, toRefs } from 'vue';
import { getPrivileges } from '../composables/privilege/get_privileges';
import { debounce as _debounce } from 'lodash-es';
import { PlusIcon } from '@heroicons/vue/20/solid';
import PrivilegeDropdown from './PrivilegeDropdown.vue';
import { useRouter } from 'vue-router';
import {
	ShieldCheckIcon,
	XCircleIcon,
	CheckCircleIcon,
MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline';
import { formatDate } from '@/composables/date_formatter';
import { deletePrivilege } from '@/modules/app/composables/privilege/delete_privilege';
import { notificationMessage } from '@/composables/notifications';
import SelectPrivilegeStatus from './privilege/SelectPrivilegeStatus.vue';
import SelectFeature from '@/modules/app/utilities/SelectFeature.vue';
import SelectSuperAdmin from '@/components/select/SelectSuperAdmin.vue'

const router = useRouter();
const privileges = ref([]);
const loadingPrivileges = ref(false);
const errorApi = ref(false);
const search = ref('');
const status = ref('ALL')
const feature = ref({})
const is_admin = ref('ALL')
const paginationOptions = ref({
	totalPages: 0,
	total: 0,
	hasMorePages: true,
	currentPage: 1,
	perPage: 10,
});
const sortListBy = ref({
	name: '',
	type: '',
	is_nested_sort: 0,
});

const columns = [
	{
		prop: 'action_name',
		label: 'Action Name',
		sortable: true,
		clickable: true,
		class: '',
	},
	{
		prop: 'app_feature.name',
		label: 'Feature',
		sortable: false,
		clickable: false,
		class: '',
	},
	{
		prop: 'is_superadmin',
		label: 'Super Admin',
		slot_name: 'super_admin',
		sortable: false,
		clickable: false,
		class: '',
	},
	{
		prop: 'status',
		label: 'Status',
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
	},
];
const showNotification = ref(false);
const messageNotification = ref(null);

const fetchPrivileges = async () => {
	loadingPrivileges.value = true;
	const params = {
		search: search.value,
		page: paginationOptions.value.currentPage,
		size: paginationOptions.value.perPage,
		sort_label: sortListBy.value.name,
		sort_by: sortListBy.value.type,
		is_nested_sort: sortListBy.value.is_nested_sort,
		filter_status: status.value == 'ALL' ? '' : status.value == 'ACTIVE' ? 1 : 0,
		app_feature_id: feature.value.id,
		filter_super_admin: is_admin.value == 'ALL' ? '' : is_admin.value == 'SUPER_ADMIN' ? 1 : 0,
	};
	const { load, totalPages, hasError, hasLastPage, totalPrivileges, data } =
		getPrivileges(params);
	await load();
	if (hasError.value) {
		errorApi.value = true;
	}
	loadingPrivileges.value = false;
	paginationOptions.value.totalPages = totalPages.value;
	paginationOptions.value.total = totalPrivileges.value;
	paginationOptions.value.hasMorePages = hasLastPage.value;
	privileges.value = data.value;
};

const handleChangePage = (value) => {
	paginationOptions.value.perPage = parseInt(value);
	fetchPrivileges();
};

const handleClickShowMore = (page) => {
	paginationOptions.value.currentPage = page;
	fetchPrivileges();
};

const handleSortList = ({ label, sortBy, is_nested }) => {
	const { name, type, is_nested_sort } = toRefs(sortListBy.value);
	name.value = label;
	type.value = sortBy;
	is_nested_sort.value = is_nested ? 1 : 0;
	fetchPrivileges();
};

const handelClickColumnValue = ({ item, column }) => {
	if (column == 'Action Name') {
		router.push({ name: 'View Privilege Page', params: { id: item.id } });
	}
};

const handleClickAddPrivilege = () => {
	router.push({ name: 'Create Privilege Page' });
};

const handleClickDelete = async (privilege) => {
	const { destroy, data } = deletePrivilege(privilege);
	await destroy();
	notification(notificationMessage.delete);
	fetchPrivileges();
};

const handleClickClearFilter = () => {
	feature.value = {}
	status.value = 'ALL'
}

const notification = (message) => {
	messageNotification.value = message;
	showNotification.value = true;
	setTimeout(() => {
		showNotification.value = false;
	}, 2000);
};

const onChangeSearchText = _debounce((value) => {
	fetchPrivileges();
}, 500);

onMounted(async () => {
	await fetchPrivileges();
});

watch(search, (val) => {
	onChangeSearchText(val);
});

watch(feature, () => {
	fetchPrivileges();
})

watch(status, () => {
	fetchPrivileges();
})

watch(is_admin, () => {
	fetchPrivileges()
})
</script>
