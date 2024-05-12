<template>
	<GlobalBreadCrumbs :pages="pages" />
	<PageLoader v-if="loadingCompany" />
	<div class="py-6" v-else>
		<div class="mx-auto max-w-7xl px-4 pt-10 mb-4 sm:px-6 md:px-8">
			<h1 class="text-2xl font-semibold text-gray-600">
				Company
				<span class="text-lg font-thin">{{ companyProfile.name }}</span>
			</h1>
			<div class="relative mt-1 py-4 rounded-md">
				<router-link
					class="absolute text-untitled-gray-500 inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
					:to="{ name: 'Company Home Page' }">
					<ArrowLeftIcon
						class="-ml-1 mr-2 h-5 w-5"
						aria-hidden="true" />
				</router-link>
				<label class="pl-10 text-sm text-untitled-gray-500">Back</label>
			</div>
		</div>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<div class="sm:hidden">
				<label for="tabs" class="sr-only">Select a tab</label>
				<!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
				<select
					id="tabs"
					name="tabs"
					class="block w-full rounded-md border-gray-300 focus:border-untitled-gray-500 focus:ring-untitled-gray-500">
					<option
						class="text-base"
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
							:class="[
								tab.current
									? 'border-untitled-gray-500 text-untitled-gray-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
								'group cursor-pointer inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm',
							]"
							@click="handleClickTab(tab.name)"
							:aria-current="tab.current ? 'page' : undefined">
							<component
								:is="tab.icon"
								:class="[
									tab.current
										? 'text-untitled-gray-500'
										: 'text-gray-400 group-hover:text-gray-500',
									'-ml-0.5 mr-2 h-5 w-5',
								]"
								aria-hidden="true" />
							<span class="text-sm">{{ tab.name }}</span>
						</span>
					</nav>
				</div>
			</div>
			<component
				:is="
					companyComponents[
						tabs.find((tab) => tab.current == true).component
					]
				"
				:company-id="companyId"
				:company-profile="companyProfile"
				@updatedCompany="handleUpdatedCompanyProfile" />
		</div>
	</div>
</template>

<script setup>
import {
	BuildingOfficeIcon,
	CreditCardIcon,
	HomeIcon,
	UserGroupIcon,
	UsersIcon,
} from '@heroicons/vue/20/solid';
import { updateCompany } from '../composables/update_company';
import {
	ref,
	onMounted,
	defineProps,
	computed,
	defineAsyncComponent,
	watch,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
	ArrowLeftIcon,
	ComputerDesktopIcon,
	PlayIcon,
	BuildingLibraryIcon,
    InformationCircleIcon
} from '@heroicons/vue/24/outline';
import { getCompaniesById } from '../composables/get_company_byId';
import PageLoader from '@/components/loader/PageLoader.vue';
import GlobalBreadCrumbs from '@/components/GlobalBreadCrumbs.vue';
import { useUserPrivilegesStore } from '@/store/useUserPrivilegesStore';
import { COMPANY_VIEW_ACCOUNT } from '@/privileges/company_managent';

const props = defineProps({
	id: null,
});

const route = useRoute();
const router = useRouter();
const userPrivilege = useUserPrivilegesStore();

const companyComponents = {
	CompanyUser: defineAsyncComponent(() =>
		import('../components/CompanyDetails/CompanyUsers.vue')
	),
	CompanyAccount: defineAsyncComponent(() =>
		import('../components/CompanyDetails/CompanyAccount.vue')
	),
	CompanyStore: defineAsyncComponent(() =>
		import('../components/CompanyDetails/CompanyStores.vue')
	),
	CompanyDomain: defineAsyncComponent(() =>
		import('../components/CompanyDetails/CompanyDomain.vue')
	),
	CompanySubscription: defineAsyncComponent(() =>
		import('../components/CompanyDetails/CompanySubscription.vue')
	),
	CompanyInvoice: defineAsyncComponent(() =>
		import('../components/CompanyDetails/CompanyInvoice.vue')
	),
	CompanyPreference: defineAsyncComponent(() =>
		import('../components/CompanyDetails/CompanyPreference.vue')
	),
};

const tabs = ref([
	{
		name: 'Information',
		href: '#',
		icon: InformationCircleIcon,
		current: true,
		component: 'CompanyAccount',
	},
	{
		name: 'Domain Settings',
		href: '#',
		icon: ComputerDesktopIcon,
		current: false,
		component: 'CompanyDomain',
	},
]);

const messageNotif = ref(null);
const showNotif = ref(false);
const companyId = computed(() => parseInt(props.id));
const companyProfile = ref(null);
const loadingCompany = ref(true);

const pages = computed({
	get() {
		return [
			{
				name: 'Companies',
				to: {
					name: 'Company Home Page',
				},
				current: false,
			},
			{
				name: tabs.value.find((tab) => tab.current == true).name,
				to: {
					name: 'Company Details Page',
					params: {
						id: companyId.value,
					},
					query: {
						tab: tabs.value.find((tab) => tab.current == true).name,
					},
				},
				current: true,
			},
		];
	},
	set(newValue) {
		newValue;
	},
});

const getSpecificCompany = async () => {
	loadingCompany.value = true;
	const { load, data } = getCompaniesById(companyId.value);

	await load();
	companyProfile.value = data.value;
	companyProfile.value.active = data.value.active ? true : false;
	loadingCompany.value = false;
};

const backToHomePage = async () => {
	router.push({ path: '/companies' });
};

const notification = (message) => {
	messageNotif.value = message;
	showNotif.value = true;
	setTimeout(() => {
		showNotif.value = false;
	}, 2000);
};

const handleClickTab = (name) => {
	tabs.value.map((tab) => {
		if (tab.name == name) {
			tab.current = true;
		} else {
			tab.current = false;
		}
		return tab;
	});

	router.push({ query: { tab: name } });
};

const handleUpdatedCompanyProfile = (updatedCompanyProfile) => {
	companyProfile.value = updatedCompanyProfile;
};

onMounted(async () => {
	await getSpecificCompany();

	if (route.query.tab) {
		tabs.value.map((tab) => {
			if (tab.name == route.query.tab) {
				tab.current = true;
			} else {
				tab.current = false;
			}
			return tab;
		});
	}

    if(!userPrivilege.findPrivilege(COMPANY_VIEW_ACCOUNT)) {
        tabs.value = tabs.value.filter(tab => tab.name != 'Account')
    }
})
</script>
