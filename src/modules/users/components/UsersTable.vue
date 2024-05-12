<template>
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
				<div class="md:grid md:grid-cols-4 md:gap-6">
					<div class="mr-2 md:col-span-1">
						<SelectStatus v-model="status" :show-label="false" />
					</div>
					<div class="mr-2 md:col-span-1">
						<SelectRoles v-model="roles" :show-label="false" />
					</div>
					<div
						class="mr-2 md:col-span-1">
						<SelectStore
							v-model="store"
							:show-label="false" />
					</div>
					<div class="md:col-span-1">
						<button
							type="button"
							@click="handleClickClearFilter"
							class="flex mt-1 w-32 justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-untitled-gray-500 shadow-lg mr-2 hover:bg-untitled-gray-100 focus:outline-none focus:ring-2 focus:ring-untitled-gray-400 focus:ring-offset-2">
							Clear Filter
						</button>
					</div>
				</div>
			</div>
			<div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
				<button
					type="button"
					@click="handleClickAddUser"
					class="flex w-full mr-2 justify-center rounded-md border border-transparent bg-untitled-gray-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
					<PlusIcon class="w-5 mr-2" /> Add User
				</button>
			</div>
		</div>
		<div class="bg-white shadow-md border border-untitled-gray-100">
			<data-table
				:items="users"
				:columns="columns"
				:action="true"
				:actions="['Options']"
				:loading="loadingUsers"
				:error="errorApi"
				:is-paginate="true"
				:table-type="'stripe'"
				:is-sort-by-live="true"
				:pagination-options="paginationOptions"
				@showMorePage="handleClickShowMore"
				@pageChanged="handleChangePage"
				@clickValue="handelClickColumnValue"
				@sort="handleSortList">
				<template #role="{ scope }">
					<div class="flex-wrap w-full">
						<span
							class="mr-2 bg-untitled-gray-400 text-xs text-white p-2 rounded-full"
							v-for="(role, index) in scope.roles"
							:key="index"
							>{{ role.friendly_name }}
						</span>
					</div>
				</template>

				<template #status="{ scope }">
					<span
						class="text-xs"
						:class="[
							scope.status == 'ACTIVE'
								? 'bg-green-500 text-white p-1 px-4 rounded-full text-center'
								: '',
							scope.status == 'UNDER_REVIEW'
								? 'bg-yellow-600 text-white p-1 px-4 rounded-full  text-center'
								: '',
							scope.status == 'INACTIVE'
								? 'bg-stone-600 text-white p-1 px-4 rounded-full  text-center'
								: '',
							scope.status == 'REJECTED'
								? 'bg-red-600 text-white p-1 px-4 rounded-full  text-center'
								: '',
						]">
						{{ replaceStatusString(scope.status) }}
					</span>
				</template>
				<template #date_created="{ scope }">
					{{ formatDate(scope.created_at) }}
				</template>
				<template #options="{ scope }">
					<UsersDropdown :scope="scope" @fetch-users="fetchUsers"/>
				</template>
			</data-table>
		</div>
	</div>
</template>
<script setup>
import SelectStatus from '@/modules/companies/utilities/user/SelectStatus.vue';
import SelectRoles from '@/modules/roles/utilities/SelectRoles.vue';
import SelectStore from '@/modules/stores/utilities/SelectStore.vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid';
import { ref, onMounted, computed, watch, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { getUsers } from '../composables/get_users';
import { debounce as _debounce } from 'lodash-es';
import { PlusIcon } from '@heroicons/vue/24/outline';
import UsersDropdown from './UsersDropdown.vue';
import { formatDate } from '@/composables/date_formatter'

const router = useRouter();
const users = ref([])
const paginationOptions = ref({
	totalPages: 0,
	total: 0,
	currentPage: 1,
	perPage: 10,
	hasMorePages: true,
});
const sortListBy = ref({
	name: '',
	type: '',
	is_nested_sort: 0,
});
const status = ref('')
const roles = ref([])
const store = ref({})
const errorApi = ref(false)
const loadingUsers = ref(false)
const search = ref('')
const columns = [
	{
		prop: 'name',
		label: 'Name',
		sortable: true,
		clickable: true,
		class: '',
	},
	{
		prop: 'email',
		label: 'Email',
		sortable: true,
		clickable: false,
		class: '',
	},
	{
		prop: 'roles',
		label: 'Role',
		sortable: false,
		clickable: false,
		class: '',
	},
	{
		prop: 'status',
		label: 'Status',
		sortable: true,
		clickable: false,
		class: '',
	},
	{
		prop: 'store.name',
		label: 'Store',
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

const handleClickAddUser = () => {
    router.push({name: 'User Create Page'})
}

const fetchUsers = async () => {
	const params = {
		search: search.value,
		page: paginationOptions.value.currentPage,
		size: paginationOptions.value.perPage,
		sort_label: sortListBy.value.name,
		sort_by: sortListBy.value.type,
		is_nested_sort: sortListBy.value.is_nested_sort,
		status: status.value,
		roles: roles.value.map((role) => role.id),
		store_id: store.value.id,
	};

	loadingUsers.value = true;
	const { data, load, hasError, totalPages, totalUsers, hasLastPage } =
		getUsers(params);
	await load();
	if (hasError.value) {
		errorApi.value = hasError.value;
		return;
	}
	paginationOptions.value.totalPages = totalPages.value;
	paginationOptions.value.total = totalUsers.value;
	paginationOptions.value.hasMorePages = hasLastPage.value;
	users.value = data.value
	loadingUsers.value = false;
};

const handleClickClearFilter = () => {
	status.value = '';
	roles.value = [];
	store.value = {};
};

const replaceStatusString = (status) => {
	return status.replace('_', ' ');
};

const handleChangePage = (value) => {
	paginationOptions.value.perPage = parseInt(value);
	fetchUsers();
};

const handleClickShowMore = (page) => {
	paginationOptions.value.currentPage = page;
	fetchUsers();
};

const handleSortList = ({ label, sortBy, is_nested }) => {
	const { name, type, is_nested_sort } = toRefs(sortListBy.value);
	name.value = label;
	type.value = sortBy;
	is_nested_sort.value = is_nested ? 1 : 0;
	fetchUsers();
};

const handelClickColumnValue = ({ item, column }) => {
	if(column == 'Name') {
		router.push({ name: 'User View Page', params: { id: item.id } });
	}
}

const onChangeSearchText = _debounce((value) => {
	fetchUsers();
}, 500);

onMounted( async () => {
    await fetchUsers();
})

watch(search, () => {
	onChangeSearchText();
});

watch(roles, () => {
	fetchUsers();
});

watch(store, () => {
	fetchUsers();
});

watch(status, (val) => {
	if (val) {
		onChangeSearchText();
	}
});
</script>
