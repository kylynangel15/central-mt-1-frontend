<template>
	<GlobalBreadCrumbs :pages="pages" />
	<PageLoader v-if="loading" />
	<div class="py-6" v-else>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 xs:mb-4 mb-8">
			<h1 class="text-2xl font-semibold text-untitled-gray-600">
				App <span class="text-lg font-thin">Details</span>
			</h1>
			<div class="relative mt-1 py-1 rounded-md">
				<router-link
					class="absolute text-untitled-gray-500 inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
					:to="{ name: 'App Home Page' }">
					<ArrowLeftIcon
						class="-ml-1 mr-2 h-5 w-5"
						aria-hidden="true" />
				</router-link>
				<label class="pl-10 text-sm text-untitled-gray-500">Back</label>
			</div>
		</div>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<div
				class="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
				<div class="flex items-center space-x-5">
					<div class="flex-shrink-0">
						<div class="relative">
							<img
								class="h-16 w-16 rounded-full"
								v-if="app.profile_photo"
								:src="app.profile_photo"
								alt="" />
							<CubeIcon
								v-else
								class="h-16 w-16 rounded-full bg-untitled-gray-100 text-untitled-gray-500 ring-4 ring-white sm:h-32 sm:w-32" />
							<span
								class="absolute inset-0 rounded-full shadow-inner"
								aria-hidden="true" />
						</div>
					</div>
					<div>
						<h1
							class="text-2xl font-semibold text-untitled-gray-600">
							{{ app.name }}
						</h1>
					</div>
				</div>
				<div
					class="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
					<button
						type="button"
						@click="handleClickDelete"
						class="inline-flex justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-untitled-gray-500 shadow-lg mr-2 hover:bg-untitled-gray-100 focus:outline-none focus:ring-2 focus:ring-untitled-gray-400 focus:ring-offset-2">
						<TrashIcon class="w-5 mr-1" />
						Delete
					</button>
					<button
						type="button"
						@click="handleClickEdit"
						class="inline-flex items-center justify-center rounded-md border border-transparent bg-untitled-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100">
						<PencilSquareIcon
							class="text-white -ml-1 mr-2 h-5 w-5"
							aria-hidden="true" />
						Edit
					</button>
				</div>
			</div>

			<div class="md:mt-10">
				<div class="sm:hidden">
					<label for="tabs" class="sr-only">Select a tab</label>
					<!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
					<select
						id="tabs"
						name="tabs"
						class="block w-full rounded-md border-gray-300 focus:border-untitled-gray-500 focus:ring-untitled-gray-500">
						<option
							v-for="tab in tabs"
							:key="tab.name"
							:selected="tab.current">
							{{ tab.name }}
						</option>
					</select>
				</div>
				<div class="hidden sm:block">
					<div class="border-b border-gray-200">
						<nav class="-mb-px flex space-x-8" aria-label="Tabs">
							<span
								v-for="tab in tabs"
								:key="tab.name"
								@click="handleClickTab(tab)"
								:class="[
									tab.current
										? 'border-untitled-gray-500 text-untitled-gray-600'
										: 'border-transparent text-untitled-gray-500 hover:text-untitled-gray-700 hover:border-gray-300',
									'group inline-flex cursor-pointer items-center py-4 px-1 border-b-2 font-medium text-sm',
								]"
								:aria-current="
									tab.current ? 'page' : undefined
								">
								<component
									:is="tab.icon"
									:class="[
										tab.current
											? 'text-untitled-gray-500'
											: 'text-untitled-gray-400 group-hover:text-untitled-gray-500',
										'-ml-0.5 mr-2 h-5 w-5',
									]"
									aria-hidden="true" />
								<span>{{ tab.name }}</span>
							</span>
						</nav>
					</div>
				</div>
			</div>

			<component
				v-if="tabs.length"
				:is="componentList[tabComponent]"
				:app="app"
				:app-id="parseInt(appId)"
				:appProfile="app" />
		</div>
	</div>
	<global-delete-confirmation
		@closeModal="handleCloseModal"
		@confirmed="handleDeleteApp"
		:selected-item="selectedItem"
		:params="itemName"
		:open-modal="openDeleteConfirmation" />

	<global-popup-notification
		v-if="showNotif"
		:show-notification="showNotif"
		:message="messageNotif" />
</template>
<script setup>
import GlobalBreadCrumbs from '@/components/GlobalBreadCrumbs.vue';
import {
	computed,
	defineProps,
	ref,
	watch,
	onMounted,
	defineAsyncComponent,
} from 'vue';
import { loadAppById } from '../composables/get_app_by_id';
import {
	PencilSquareIcon,
	TrashIcon,
	CubeIcon,
	ArrowLeftIcon,
	BuildingOffice2Icon,
	SparklesIcon,
} from '@heroicons/vue/24/outline';
import { useRoute, useRouter } from 'vue-router';
import { deleteApp } from '../composables/delete_apps';
import PageLoader from '@/components/loader/PageLoader.vue';

const props = defineProps({
	id: null,
});

const router = useRouter();
const route = useRoute();

const pages = computed({
	get() {
		return [
			{
				name: 'App',
				to: {
					name: 'App Home Page',
				},
				current: false,
			},
			{
				name: 'Details',
				to: {
					name: appId.value ? 'View App Page' : 'Create App Page',
					params: {
						id: appId.value,
					},
				},
				current: false,
			},
		];
	},
	set(newValue) {
		newValue;
	},
});

const appId = computed(() => props.id);
const app = ref({});
const loading = ref(false);
const openDeleteConfirmation = ref(false);
const selectedItem = ref(app.value);
const itemName = ref(null);

const messageNotif = ref(null);

const showNotif = ref(false);

const componentList = {
	AppInfo: defineAsyncComponent(() => import('../components/AppInfo.vue')),
	CompanyList: defineAsyncComponent(() =>
		import('../components/CompanyList.vue')
	),
	FeatureList: defineAsyncComponent(() =>
		import('../components/FeatureList.vue')
	),
};

const tabs = ref([
	{
		name: 'Info',
		href: '#',
		icon: CubeIcon,
		current: true,
		componentName: 'AppInfo',
	},
	{
		name: 'Companies',
		href: '#',
		icon: BuildingOffice2Icon,
		current: false,
		componentName: 'CompanyList',
	},
	{
		name: 'Features',
		href: '#',
		icon: SparklesIcon,
		current: false,
		componentName: 'FeatureList',
	},
]);

const tabComponent = computed({
	get() {
		if (tabs.value && tabs.value.length) {
			return tabs.value.find((tab) => tab.current == true).componentName;
		}
		return 'AppInfo';
	},
	set(newValue) {
		newValue;
	},
});

const getAppById = async () => {
	loading.value = true;
	const { load, data } = loadAppById(appId.value);
	await load();
	app.value = data.value;
	loading.value = false;
};

const handleClickEdit = () => {
	router.push({ name: 'Edit App Page', params: { id: app.value.id } });
};

const handleClickDelete = () => {
	openDeleteConfirmation.value = true;
	selectedItem.value = app.value;
	itemName.value = app.value.name;
};

const handleCloseModal = () => {
	openDeleteConfirmation.value = false;
};

const handleDeleteApp = async (app) => {
	openDeleteConfirmation.value = false;
	const { data, destroy } = deleteApp(app);
	await destroy();
	notification('Successfully deleted!');

	setTimeout(() => {
		router.push({ name: 'App Home Page' });
	}, 500);
};

const notification = (message) => {
	messageNotif.value = message;
	showNotif.value = true;
	setTimeout(() => {
		showNotif.value = false;
	}, 2000);
};

const handleClickTab = (item) => {
	tabs.value = tabs.value.map((tab) => {
		if (tab.name == item.name) {
			tab.current = true;
		} else {
			tab.current = false;
		}

		return tab;
	});

	router.push({
		name: 'View App Page',
		params: { id: appId.value },
		query: { tab: item.name },
	});
};

onMounted(async () => {
	if (appId.value) {
		await getAppById();
	}

	if(route.query.tab) {
		tabs.value = tabs.value.map((tab) => {
			if (tab.name == route.query.tab) {
				tab.current = true;
			} else {
				tab.current = false;
			}
			return tab;
		});
	}
});

watch(appId, async () => {
	await getAppById();
});
</script>
