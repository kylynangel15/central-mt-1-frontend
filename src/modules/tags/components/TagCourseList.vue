<template>
	<div class="flex-1">
		<div class="mx-auto py-2 lg:py-4">
			<div class="py-8">
				<div class="">
					<div>
						<h3 class="text-lg font-medium leading-6 text-gray-900">
							Courses
						</h3>
					</div>
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
							
						</div>
						<div class="mt-4 sm:mt-0 sm:ml-8 md:flex">
							<button
								v-if="courses.length > 0"
								v-administrator
								type="button"
								@click="handleClickDetach"
								class="flex w-56 justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-untitled-gray-500 shadow-lg mr-2 hover:bg-untitled-gray-100 focus:outline-none focus:ring-2 focus:ring-untitled-gray-400 focus:ring-offset-2">
								<MinusCircleIcon class="w-5 mr-2" /> Detach all
								Courses
							</button>
							<button
								type="button"
								@click="handleAddCourse"
								class="flex sm:mt-2 md:mt-0 mr-2 w-44 justify-center rounded-md border border-transparent bg-untitled-gray-500 py-2 h-10 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
								<PlusIcon class="w-5 mr-2" /> Attach Courses
							</button>
						</div>
					</div>
					<div
						class="bg-white shadow-md border border-untitled-gray-100">
						<data-table
							:items="courses"
							:columns="columns"
							:loading="loadingCourse"
							:error="errorApi"
							:is-paginate="true"
							:action="true"
							:actions="['Options']"
							:table-type="'stripe'"
							:is-sort-by-live="true"
							:pagination-options="paginationOptions"
							@showMorePage="handleClickShowMore"
							@pageChanged="handleChangePage"
							@sort="handleSortList">
							<template #options="{ scope }">
								<Menu
									as="div"
									class="relative inline-block text-left" v-administrator>
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
															handleRemoveCourse(
																scope
															)
														"
														:class="[
															active
																? 'bg-gray-100 text-gray-900'
																: 'text-gray-700',
															'group flex items-center px-4 py-2 text-sm cursor-pointer',
														]">
														<MinusCircleIcon
															class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
															aria-hidden="true" />
														Remove from Tags
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

	<AddCoursesModal
		v-if="openModal"
		:open-modal="openModal"
		:tag-profile="tagProfile"
		:tag-id="tagId"
		:company-id="companyId"
		@close-modal="handleCloseModal"
		@addCourses="handleAddCourses" />

	<global-delete-confirmation
		@closeModal="handleCloseModal"
		@confirmed="handleRemoveCompanyFromApp"
		:selected-item="selectedItem"
		:params="itemName"
		:message="removeMessage"
		:dialog-title="'Remove Confirmation'"
		:open-modal="openRemoveConfirmation" />


    <global-popup-notification 
        v-if="showNotif" 
        :show-notification="showNotif" 
        :message="messageNotif"/>
</template>
<script>
// use normal <script> to declare options
export default {
    inheritAttrs: false
};
</script>
<script setup>
import SelectCompanies from '@/modules/companies/utilities/SelectCompanies.vue';
import {
	EllipsisVerticalIcon,
	EyeIcon,
	MagnifyingGlassIcon,
	MinusCircleIcon,
	PencilSquareIcon,
	PlusIcon,
	TrashIcon,
} from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { defineProps, computed, ref, onMounted, toRefs, watch } from 'vue';
import { getCourses } from '../composables/get_courses';
import { debounce as _debounce } from 'lodash-es';
import AddCoursesModal from './modals/AddCoursesModal.vue';
import { removeFromTag } from '../composables/remove_from_tag'

const props = defineProps({
	tagId: {
		type: Number,
		required: true,
	},
	tagProfile: {
		type: Object,
		required: true,
	},
	companyId: {
		type: Number,
        required: true,
	}
});

const tagId = computed(() => props.tagId);
const search = ref('');
const courses = ref([]);
const columns = ref([
	{
		prop: 'name',
		label: 'Name',
		sortable: true,
		clickable: false,
		class: '',
	},
	{
		prop: 'company.name',
		label: 'Company',
		sortable: false,
		clickable: false,
		class: '',
	},
]);
const loadingCourse = ref(false);
const errorApi = ref(false);
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
const company = ref({});
const openModal = ref(false);
const tagProfile = computed(() => props.tagProfile);
const openRemoveConfirmation = ref(false);
const removeMessage = ref(
	'Removed Successfully'
);
const itemName = ref('');
const selectedItem = ref(null);
const messageNotif = ref(null)
const showNotif = ref(false)
const companyId = computed(() => props.companyId)

const handleClickShowMore = (page) => {
	paginationOptions.value.currentPage = page;
	fetchCourses();
};

const fetchCourses = async () => {
	const params = {
		search: search.value,
		page: paginationOptions.value.currentPage,
		size: paginationOptions.value.perPage,
		sort_label: sortListBy.value.name,
		sort_by: sortListBy.value.type,
		is_nested_sort: sortListBy.value.is_nested_sort,
		company_id: companyId.value,
		tags: [tagId.value],
	};

	loadingCourse.value = true;
	const { data, load, hasError, totalPages, totalTags, hasLastPage } =
		getCourses(params);
	await load();
	if (hasError.value) {
		errorApi.value = hasError.value;
		return;
	}
	paginationOptions.value.totalPages = totalPages.value;
	paginationOptions.value.total = totalTags.value;
	paginationOptions.value.hasMorePages = hasLastPage.value;
	courses.value = data.value;
	loadingCourse.value = false;
};

const handleChangePage = (value) => {
	paginationOptions.value.perPage = parseInt(value);
	fetchCourses();
};

const handleSortList = ({ label, sortBy, is_nested }) => {
	const { name, type, is_nested_sort } = toRefs(sortListBy.value);
	name.value = label;
	type.value = sortBy;
	is_nested_sort.value = is_nested ? 1 : 0;
	fetchCourses();
};

const handleClearCompany = () => {
	company.value = {};
};

const handleClickClearFilter = () => {
	company.value = {};
};

const onChangeSearchText = _debounce((value) => {
	fetchCourses();
}, 500);

const handleAddCourse = () => {
	openModal.value = true;
};

const handleClickDetach = () => {
    selectedItem.value = 'all'
	openRemoveConfirmation.value = true;
};

const handleCloseModal = () => {
	openModal.value = false;
	openRemoveConfirmation.value = false;
};

const handleRemoveCompanyFromApp = async (item) => {
    const params = {
        tag_id: tagId.value,
        courses: item == 'all' ? 'all' : [item.id],
        users: []
    }
    const { remove } = removeFromTag(params);
    await remove();
    notification('Successfully removed')
    openRemoveConfirmation.value = false
    fetchCourses();
};

const notification = (message) => {
	messageNotif.value = message;
	showNotif.value = true;
	setTimeout(() => {
		showNotif.value = false;
	}, 2000);
};

const handleAddCourses = () => {
    openModal.value = false
	notification('Successfully added!');
	fetchCourses();
};

const handleRemoveCourse = (scope) => {
    removeMessage.value = 'Are you sure your to remove this tag?'
    itemName.value = scope.name
    openRemoveConfirmation.value = true;
    selectedItem.value = scope
}

onMounted(async () => {
	await fetchCourses();
});

watch(company, () => {
	fetchCourses();
});

watch(search, (val) => {
	onChangeSearchText(val);
});
</script>
