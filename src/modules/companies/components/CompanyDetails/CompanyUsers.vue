<template>
	<div class="flex-1">
		<div class="mx-auto py-2 lg:py-4">
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
							<div class="md:grid md:grid-cols-4 md:gap-6">
								<div class="mr-2 md:col-span-1">
									<SelectStatus
										v-model="status"
										:show-label="false" />
								</div>
								<div class="mr-2 md:col-span-1">
									<SelectRoles
										v-model="roles"
										:show-label="false" />
								</div>
								<div
									class="mr-2 md:col-span-1"
									v-if="companyProfile.type === GROUP_COMPANY">
									<SelectStore
										v-model="store"
										:company-id="companyId"
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
								v-user-create
								@click="handleClickAddUser"
								class="flex w-full mr-2 justify-center rounded-md border border-transparent bg-untitled-gray-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
								<PlusIcon class="w-5 mr-2" /> Add User
							</button>
						</div>
					</div>
					<div
						class="bg-white shadow-md border border-untitled-gray-100">
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
							<template #date_created="{ scope }">
								{{ formatDate(scope.created_at) }}
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
							<template #options="{ scope }">
								<Menu
									as="div"
									class="relative inline-block text-left">
									<div>
										<MenuButton
											class="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100">
											<EllipsisVerticalIcon
												class="h-5 w-5"
												aria-hidden="true" />
										</MenuButton>
									</div>

									<transition
										enter-active-class="transition ease-out duration-100"
										enter-from-class="transform opacity-0 scale-95"
										enter-to-class="transform opacity-100 scale-100"
										leave-active-class="transition ease-in duration-75"
										leave-from-class="transform opacity-100 scale-100"
										leave-to-class="transform opacity-0 scale-95">
										<MenuItems
											class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
											<div class="py-1">
												<MenuItem v-slot="{ active }">
													<a
														type="button"
														@click="
															handleClickViewUser(
																scope
															)
														"
														:class="[
															active
																? 'bg-gray-100 text-gray-900'
																: 'text-gray-700',
															'group flex items-center px-4 py-2 text-sm cursor-pointer',
														]">
														<EyeIcon
															class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
															aria-hidden="true" />
														View
													</a>
												</MenuItem>
												<MenuItem v-slot="{ active }" v-user-edit>
													<a
														type="button"
														@click="
															handleClickEdit(
																scope
															)
														"
														:class="[
															active
																? 'bg-gray-100 text-gray-900'
																: 'text-gray-700',
															'group flex items-center px-4 py-2 text-sm cursor-pointer',
														]">
														<PencilSquareIcon
															class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
															aria-hidden="true" />
														Edit
													</a>
												</MenuItem>
											</div>
											<div class="py-1">
												<MenuItem v-slot="{ active }" v-user-delete>
													<a
														@click="
															handleClickDelete(
																scope
															)
														"
														:class="[
															active
																? 'bg-gray-100 text-gray-900'
																: 'text-gray-700',
															'group flex items-center px-4 py-2 text-sm cursor-pointer',
														]">
														<TrashIcon
															class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
															aria-hidden="true" />
														Delete
													</a>
												</MenuItem>
											</div>
										</MenuItems>
									</transition>
								</Menu>
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
		@confirmed="handleDeleteUser"
		:selected-item="selectedItem"
		:params="itemName"
		:open-modal="openDeleteConfirmation" />
</template>
<script>
// use normal <script> to declare options
export default {
	inheritAttrs: false,
};
</script>
<script setup>
import { UserCircleIcon } from '@heroicons/vue/20/solid';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import {
	MagnifyingGlassIcon,
	EyeIcon,
	PencilSquareIcon,
	TrashIcon,
	PlusIcon,
	EllipsisVerticalIcon,
} from '@heroicons/vue/24/outline';
import {
	ref,
	onMounted,
	watch,
	defineAsyncComponent,
	defineProps,
	computed,
	toRefs,
} from 'vue';
import { getUsers } from '../../composables/user/get_users.js';
import { useUserStore } from '../../store/user/useUserStore';
import { deleteUser } from '../../composables/user/delete_user.js';
import SelectRoles from '@/modules/roles/utilities/SelectRoles.vue';
import SelectStatus from '../../utilities/user/SelectStatus.vue';
import { debounce as _debounce } from 'lodash-es';
import { useRouter } from 'vue-router';
import SelectStore from '../store/utilities/SelectStore.vue';
import { GROUP_COMPANY } from '@/composables/default_variables/company_type';
import { formatDate } from '@/composables/date_formatter'

const props = defineProps({
	companyId: {
		type: Number,
		default: null,
	},
	companyProfile: {
		type: Object,
		default: null,
	},
});
const userStore = useUserStore();
const router = useRouter();

const users = computed(() => userStore.users);
const companyId = computed(() => props.companyId);
const loadingUsers = ref(true);
const search = ref(null);
const errorApi = ref(false);
const isView = ref(false);
const openModal = ref(false);
const selectedItem = ref(null);
const messageNotif = ref('');
const showNotif = ref(false);
const itemName = ref('');
const openDeleteConfirmation = ref(false);

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
const roles = ref([]);
const store = ref({});
const status = ref('');
const companyProfile = computed(() => props.companyProfile);

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
		sortable: true,
		clickable: false,
		class: '',
	},
	{
		prop: '',
		label: 'User Tag',
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
		company_id: companyId.value,
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
	loadingUsers.value = false;
	userStore.setUsers(data.value);
};

const handleClickClearFilter = () => {
	status.value = '';
	roles.value = [];
	store.value = {};
};

const handleClickAddUser = () => {
	router.push({ name: 'Create Company User Page' });
};

const handleCloseModal = () => {
	openModal.value = false;
	openDeleteConfirmation.value = false;
};

const handleStoreUser = (user) => {
	userStore.create(user);
	openModal.value = false;
	notification('Successfully added!');
};

const handleUpdatedUser = (updatedUser) => {
	userStore.update(updatedUser);
	openModal.value = false;
	selectedItem.value = null;
	notification('Successfully updated!');
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
		router.push({ name: 'View Company User Page', params: { userId: item.id } });
	}
}

const handleClickEdit = (user) => {
	router.push({
		name: 'Edit Company User Page',
		params: {
			userId: user.id,
		},
	});
};

const replaceStatusString = (status) => {
	return status.replace('_', ' ');
};

const handleClickDelete = (user) => {
	openDeleteConfirmation.value = true;
	selectedItem.value = { ...user };
	itemName.value = selectedItem.value.name;
};

const handleClickViewUser = (user) => {
	router.push({
		name: 'View Company User Page',
		params: {
			id: companyId.value,
			userId: user.id,
		},
	});
};

const handleDeleteUser = async (user) => {
	openDeleteConfirmation.value = false;
	const { data, trash } = deleteUser(user);
	await trash();
	userStore.delete(users.value.findIndex((person) => person.id == user.id));
	notification('Successfully deleted!');
};

const notification = (message) => {
	messageNotif.value = message;
	showNotif.value = true;
	setTimeout(() => {
		showNotif.value = false;
	}, 2000);
};

const onChangeSearchText = _debounce((value) => {
	fetchUsers();
}, 500);

onMounted(async () => {
	await fetchUsers();
});

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
