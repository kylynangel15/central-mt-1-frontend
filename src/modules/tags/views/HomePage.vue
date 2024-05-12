<template>
    <GlobalBreadCrumbs :pages="pages" />
    <div class="py-6">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <h1 class="text-2xl font-semibold text-gray-900">Tags </h1>
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
							<div class=" mr-2">
								<SelectCompanies
									v-model="company"
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
                        <button type="button"
                            @click="handleClickAddItem"
                            class="flex w-full justify-center rounded-md border border-transparent bg-untitled-gray-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
                            <PlusIcon class="w-5 mr-2"/> Add Tags
                        </button>
                    </div>
                </div>

                <div class="bg-white shadow-md border border-untitled-gray-100">
                    <data-table 
                        :items="tags" 
                        :columns="columns" 
                        :action="true" 
                        :actions="['Options']" 
                        :loading="loading"
                        :error="errorApi"
                        :is-paginate="true" 
                        :table-type="'stripe'"
                        :pagination-options="paginationOptions"
                        @showMorePage="handleClickShowMore"
						@clickValue="handelClickColumnValue"
                        @pageChanged="handleChangePage">
                        <template #date_created="{ scope }">
                            {{ formatDate(scope.created_at) }}
                        </template>
                        <template #options="{ scope }">
                            <OptionDropdown 
                                :scope="scope"
                                @viewAction="handleClickView(scope)"
                                @editAction="handleClickEdit(scope)"
                                @deleteAction="handleClickDelete(scope)"/>
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
        @storedItem="handleStoreItem"
        @updatedItem="handleUpdatedItem"/>

    <global-popup-notification 
        v-if="showNotif" 
        :show-notification="showNotif" 
        :message="messageNotif"/>

    <global-delete-confirmation
        @closeModal="handleCloseModal"
        @confirmed="handleDeleteItem"
        :selected-item="selectedItem"
        :params="itemName"
        :open-modal="openDeleteConfirmation" />

</template>

<script setup>
import { 
MagnifyingGlassIcon,
    PlusIcon,
} from '@heroicons/vue/24/outline';
import { 
    ref, 
    onMounted,
    watch, 
} from 'vue';
import FormModal from '../components/modals/FormModal.vue';
import { getTags } from '../composables/get_tags';
import { deleteTag } from '../composables/delete_tags';
import OptionDropdown from '../components/OptionDropdown.vue';
import { debounce as _debounce } from "lodash-es";
import { useTagStore } from '../store/useTagStore'
import { useRouter } from 'vue-router';
import GlobalBreadCrumbs from '@/components/GlobalBreadCrumbs.vue';
import SelectCompanies from '@/modules/companies/utilities/SelectCompanies.vue';
import { formatDate } from '@/composables/date_formatter'

const tagStore = useTagStore()
const router = useRouter();

const paginationOptions = ref({
    totalPages: 0,
    total: 0,
    hasMorePages: false,
    currentPage: 1,
    perPage: 10,
})

const tags = ref([])
const errorApi = ref(false)
const loading = ref(false)
const openModal = ref(false)
const selectedItem = ref(null)
const messageNotif = ref(null);
const showNotif = ref(false)
const openDeleteConfirmation = ref(false)
const search = ref(null);
const isView = ref(false)
const itemName = ref(null)
const company = ref({})
const columns = [
    { prop: 'name', label: 'Name', sortable: true, clickable: true, class: '' },
    { prop: 'company.name', label: 'Company', sortable: false, clickable: false, class: '' },
    {
		prop: 'created_at',
		label: 'Date Created',
		slot_name: 'date_created',
		sortable: false,
		clickable: false,
		class: '',
	},
]

const pages = [
	{
		name: 'Tags',
		to: {
			name: 'Tags Home Page',
		},
		current: false,
	},
];

const fetchItems = async () => {
    
    loading.value = true;
    
    const params = {
        search: search.value,
        page: paginationOptions.value.currentPage,
        size: paginationOptions.value.perPage,
        company_id: company.value.id
    }

    const { load, data, hasError, totalPages, totalTags, hasLastPage } = getTags(params);
    await load();

    if(hasError.value) {
        errorApi.value = true
    }
    paginationOptions.value.hasMorePages = hasLastPage.value
    paginationOptions.value.totalPages = totalPages.value;
    paginationOptions.value.total = totalTags.value
    tags.value = data.value;
    loading.value = false
}

const handleClickClearFilter = () => {
    company.value = {}
}

const notification = (message) => {
    messageNotif.value = message
    showNotif.value = true
    setTimeout(() => {
        showNotif.value = false
    }, 2000)
}

const handleClickAddItem = () => {
    router.push({ name: 'Create Tag Page'})
}   

const handleCloseModal = () => {
    openModal.value = false
    openDeleteConfirmation.value = false
}

const handleStoreItem = (tag) => {
    openModal.value = false
    fetchItems()
    notification('Successfully added!')
}

const handleUpdatedItem = (tag) => {
    openModal.value = false
    tagStore.update(tag)
    notification('Successfully updated!')
}

const handleDeleteItem = async (tag) => {
    openDeleteConfirmation.value = false
    const { data, destroy } = deleteTag(tag);
    await destroy();
    fetchItems()
    notification('Successfully deleted!')
}

const handleClickEdit = (item) => {
    openModal.value = true 
    item.name = item.name
    item.secret = item.secret
    item.description = item.description == null ? '' : item.description
    selectedItem.value = {...item}
}

const handleClickView = (item) => {
    openModal.value = true;
    isView.value = true;
    item.name = item.name
    selectedItem.value = {...item}
}

const handleClickDelete = (item) => {
    openDeleteConfirmation.value = true
    selectedItem.value = {...item}
    itemName.value = selectedItem.value.name
}

const handleClickShowMore = (page) => {
    paginationOptions.value.currentPage = page
    fetchItems();
}

const handleChangePage = (value) => {
    paginationOptions.value.perPage = parseInt(value)
    fetchItems();
}

const handelClickColumnValue = ({item, column}) => {
    if(column == 'Name') {
		router.push({ name: 'View Tag Page', params: { id: item.id } });
	}
}

onMounted(async () => {
    await fetchItems();
})

const onChangeSearchText = _debounce((value) => {
    fetchItems();
}, 500);

watch(search, (val) => {
    onChangeSearchText(val);
})

watch(company, () => {
    fetchItems();
})

</script>