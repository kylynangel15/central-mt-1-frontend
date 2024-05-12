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
						<div class="sm:flex-auto"></div>
						<div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
							<button
								v-if="companyProfile.type !== SINGLE_ROOFTOP"
								v-user-create-can-store
								v-store-create
								type="button"
								@click="handleClickAddStore"
								class="flex w-full mr-2 justify-center rounded-md border border-transparent bg-untitled-gray-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
								<PlusIcon class="w-5 mr-2" /> Add Store
							</button>
						</div>
					</div>
					<div
						class="bg-white shadow-md border border-untitled-gray-100">
						<data-table
							:items="stores"
							:columns="columns"
							:action="true"
							:actions="['Options']"
							:loading="loadingStores"
							:error="errorApi"
							:is-paginate="true"
							:table-type="'stripe'"
							:is-sort-by-live="true"
							:pagination-options="paginationOptions"
							@showMorePage="handleClickShowMore"
							@pageChanged="handleChangePage"
							@clickValue="handelClickColumnValue"
							@sort="handleSortList">
							<template #phone="{ scope }">
								<span class="text-sm" v-if="scope.phone_number">
									+{{ scope.phone_code
									}}{{ scope.phone_number }}</span
								>
							</template>
							<template #date_created="{ scope }">
								{{ formatDate(scope.created_at) }}
							</template>
							<template #main="{ scope }">
								<div v-if="scope.is_main" class="w-full">
									<CheckCircleIcon
										class="w-6 mx-auto text-green-400" />
								</div>
								<div v-else>
									<span class="w-full">
										<XCircleIcon
											class="w-6 mx-auto text-red-400" />
									</span>
								</div>
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
															handleClickViewStore(
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
												<MenuItem v-slot="{ active }" v-store-edit>
													<a
														type="button"
														@click="
															handleClickEditStore(
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
											<div class="py-1" v-store-delete>
												<MenuItem v-slot="{ active }">
													<a
														@click="
															handleClickDeleteStoreConfirmation(
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

	<global-delete-confirmation
		@closeModal="handleCloseModal"
		@confirmed="handleClickDeleteStore"
		:selected-item="selectedItem"
		:params="itemName"
		:open-modal="openDeleteConfirmation" />

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
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import {
	EllipsisVerticalIcon,
	EyeIcon,
	MagnifyingGlassIcon,
	PencilSquareIcon,
	PlusIcon,
	CheckCircleIcon,
	TrashIcon,
	XCircleIcon,
} from '@heroicons/vue/24/outline';
import { ref, defineProps, computed, onMounted, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getStore } from '../../composables/store/get_store';
import { deleteStore } from '../../composables/store/delete_store';
import { debounce as _debounce } from 'lodash-es';
import  { SINGLE_ROOFTOP } from '@/composables/default_variables/company_type'
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

const router = useRouter();
const search = ref('');
const companyId = computed(() => props.companyId);
const companyProfile = computed(() => props.companyProfile);
const selectedItem = ref(null);
const itemName = ref(null);
const showNotif = ref(false);
const messageNotif = ref(null);

const stores = ref([]);
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

const errorApi = ref(false);
const loadingStores = ref(false);
const openDeleteConfirmation = ref(false);
const columns = [
	{
		prop: 'name',
		label: 'Name',
		sortable: true,
		clickable: true,
		class: '',
	},
	{
		prop: 'is_main',
		label: 'Main',
		sortable: false,
		clickable: false,
		class: '',
	},
	{
		prop: 'phone_number',
		label: 'Phone',
		sortable: true,
		clickable: false,
		class: '',
	},
	{
		prop: 'city',
		label: 'City',
		sortable: false,
		clickable: false,
		class: '',
	},
	{
		prop: 'state',
		label: 'State',
		sortable: true,
		clickable: false,
		class: '',
	},
	{ prop: 'zip', label: 'Zip', sortable: false, clickable: false, class: '' },
	{
		prop: 'country',
		label: 'Country',
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

const fetchStores = async () => {
	loadingStores.value = true;

	const params = {
		search: search.value,
		page: paginationOptions.value.currentPage,
		size: paginationOptions.value.perPage,
		sort_label: sortListBy.value.name,
		sort_by: sortListBy.value.type,
		is_nested_sort: sortListBy.value.is_nested_sort,
		company_id: companyId.value,
	};
	const { load, data, hasError, totalPages, hasMorePages, totalStore } =
		getStore(params);
	await load();

	loadingStores.value = false;
	if (hasError.value) {
		errorApi.value = true;
		return;
	}
	paginationOptions.value.totalPages = totalPages.value;
	paginationOptions.value.total = totalStore.value;
	paginationOptions.value.hasMorePages = hasMorePages.value;
	stores.value = data.value;
};

const handleClickAddStore = () => {
	router.push({
		name: 'Create Company Store Page',
		query: {
			name: companyProfile.value.name,
		},
	});
};

const handleClickEditStore = (store) => {
	router.push({
		name: 'Edit Company Store Page',
		params: {
			id: companyId.value,
			storeId: store.id,
		},
		query: {
			name: companyProfile.value.name,
		},
	});
};

const handleClickViewStore = (store) => {
	router.push({
		name: 'View Company Store Page',
		params: {
			id: companyId.value,
			storeId: store.id,
		}
	});
};

const handleCloseModal = () => {
	openDeleteConfirmation.value = false;
};

const handleDeleteStore = (store) => {};

const handleChangePage = (value) => {
	paginationOptions.value.perPage = parseInt(value);
	fetchStores();
};

const handleClickShowMore = (page) => {
	paginationOptions.value.currentPage = page;
	fetchStores();
};

const handleSortList = ({ label, sortBy, is_nested }) => {
	const { name, type, is_nested_sort } = toRefs(sortListBy.value);
	name.value = label;
	type.value = sortBy;
	is_nested_sort.value = is_nested ? 1 : 0;
	fetchStores();
};

const handelClickColumnValue = ({ item, column }) => {
	if(column == 'Name') {
		router.push({ name: 'View Company Store Page', params: { storeId: item.id } });
	}
}

const handleClickDeleteStoreConfirmation = (store) => {
	itemName.value = store.name;
	selectedItem.value = store;
	openDeleteConfirmation.value = true;
};

const handleClickDeleteStore = async (scope) => {
	const { trash, data } = deleteStore(scope);
	await trash();
	notification('Successfully deleted!');
	handleCloseModal();
	await fetchStores();
};

const notification = (message) => {
	messageNotif.value = message;
	showNotif.value = true;
	setTimeout(() => {
		showNotif.value = false;
	}, 2000);
};

const onChangeSearchText = _debounce((value) => {
	fetchStores();
}, 500);

onMounted(async () => {
	await fetchStores();
});

watch(search, () => {
	onChangeSearchText();
});
</script>
