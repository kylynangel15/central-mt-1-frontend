<template>
	<GlobalBreadCrumbs :pages="pages" />
	<div class="py-6">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<h1 class="text-2xl font-semibold text-untitled-gray-700">
				Role <span class="text-lg font-thin">Details</span>
			</h1>
			<div class="relative mt-1 py-4 rounded-md">
				<button
					type="button"
					v-if="roleId"
					@click="handleClickEdit"
					class="inline-flex float-right pb-1 items-center justify-center rounded-md border border-transparent bg-untitled-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100">
					<PencilSquareIcon
						class="text-white -ml-1 mr-2 h-5 w-5"
						aria-hidden="true" />
					Edit
				</button>
				<router-link
					class="absolute text-untitled-gray-500 inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
					:to="{ name: 'Roles Home Page' }">
					<ArrowLeftIcon
						class="-ml-1 mr-2 h-5 w-5"
						aria-hidden="true" />
				</router-link>
				<label class="p-10 text-sm text-untitled-gray-500">Back</label>
			</div>
		</div>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<div>
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
				:is="
					componentList[
						tabs.find((tab) => tab.current == true).componentName
					]
				"
				:role-id="parseInt(roleId)"
				:company-id="role.company_id"
				:company-profile="role.company"
				:roleProfile="role" />
		</div>
	</div>
</template>
<script setup>
import GlobalBreadCrumbs from '@/components/GlobalBreadCrumbs.vue';
import SelectCompanies from '@/modules/companies/utilities/SelectCompanies.vue';
import {
	ArrowLeftIcon,
	PaperClipIcon,
	PencilSquareIcon,
	UserGroupIcon,
	LinkIcon,
} from '@heroicons/vue/24/outline';
import {
	defineProps,
	computed,
	onMounted,
	ref,
	defineAsyncComponent,
} from 'vue';
import { useRouter } from 'vue-router';
import { getRole } from '../composables/get_role';

const props = defineProps({
	id: null,
});

const router = useRouter();

const roleId = computed(() => props.id);
const loadingRole = ref(false);
const role = ref({});

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
			{
				name: 'Details',
				to: {
					name: 'View Role Page',
					params: {
						id: roleId.value,
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

const componentList = {
	usersComponent: defineAsyncComponent(() =>
		import('../components/RoleUserList.vue')
	),
	roleInfo: defineAsyncComponent(() => import('../components/RoleInfo.vue')),
};

const tabs = ref([
	{
		name: 'Info',
		href: '#',
		icon: LinkIcon,
		current: true,
		componentName: 'roleInfo',
	},
	{
		name: 'Users',
		href: '#',
		icon: UserGroupIcon,
		current: false,
		componentName: 'usersComponent',
	},
]);

const getRoleById = async () => {
	loadingRole.value = true;
	const { load, data } = getRole(roleId.value);
	await load();
	role.value = data.value;
	loadingRole.value = false;
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
};

const handleClickEdit = () => {
	router.push({ name: 'Edit Role Page', params: { id: roleId.value } });
};

onMounted(async () => {
	await getRoleById();
});
</script>
