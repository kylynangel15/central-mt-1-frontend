<template>
	<div class="w-full px-4 pt-16">
		<div class="w-full rounded-2xl bg-white p-2">
			<Disclosure v-slot="{ open }" v-for="(app, appIndex) in apps" :default-open="true">
				<DisclosureButton
					class="flex w-full mt-2 h-12 justify-between rounded-lg bg-untitled-gray-100 px-4 py-2 text-left text-sm font-medium text-untitled-gray-900 hover:bg-untitled-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-untitled-gray-500 focus-visible:ring-opacity-75">
					<span
						class="text-lg font-semibold text-untitled-gray-500"
						>{{ app.name }}</span
					>
					<ChevronUpIcon
						:class="open ? 'rotate-180 transform' : ''"
						class="h-5 w-5 text-untitled-gray-500" />
				</DisclosureButton>
				<DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-gray-500">
					<RoleFeatureList
						:app-id="parseInt(app.id)"
						:role-id="parseInt(roleId)"
						:key="app.id"
						:readOnly="readOnly"
						@changePrivilege="handleChangePrivilege"
						@setPrivileges="handleSetPrivileges"
						:role="role" />
				</DisclosurePanel>
			</Disclosure>
		</div>
	</div>
</template>
<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { ChevronUpIcon } from '@heroicons/vue/20/solid';
import { getFeatures } from '@/modules/app/composables/features/get_features';
import { getApps } from '@/modules/app/composables/get_apps';
import {
	defineProps,
	defineEmits,
	ref,
	computed,
	onMounted,
	toRefs,
} from 'vue';
import RoleFeatureList from './RoleFeatureList.vue';

const props = defineProps({
	roleId: null,
	role: {
		type: Object,
		default: () => {},
	},
	readOnly: {
		type: Boolean,
		default: false,
	}
});

const emit = defineEmits(['changePrivilege', 'setPrivileges']);

const loadingApps = ref(false);
const searchApps = ref('');
const errorApi = ref(false);
const apps = ref([]);
const hasLastPageApps = ref(false);
const roleId = computed(() => props.roleId);
const readOnly = computed(() => props.readOnly)

const fetchApps = async () => {
	loadingApps.value = true;

	const params = {
		search: searchApps.value,
		page: 1,
		size: 10,
	};

	const { load, data, hasError, hasLastPage } = getApps(params);
	await load();

	if (hasError.value) {
		errorApi.value = true;
		return;
	}

	apps.value = data.value;
	hasLastPageApps.value = hasLastPage.value;
	loadingApps.value = false;
};

const handleChangePrivilege = (privilegeId) => {
	emit('changePrivilege', privilegeId);
};

const handleSetPrivileges = (privileges) => {
	emit('setPrivileges', privileges);
};

onMounted(async () => {
	await fetchApps();
});
</script>
