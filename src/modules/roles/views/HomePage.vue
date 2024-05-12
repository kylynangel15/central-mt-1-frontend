<template>
	<GlobalBreadCrumbs :pages="pages" />
	<div class="py-6">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<h1 class="text-2xl font-semibold text-gray-900">Roles / Privileges</h1>
		</div>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<RolesTabs @change-tab="handleChangeTab"/>
			<RolesTable v-if="tab == 'Roles'"/>
			<PrivilegesTable v-else/>
		</div>
	</div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router';
import GlobalBreadCrumbs from '@/components/GlobalBreadCrumbs.vue';
import RolesTabs from '../components/RolesTabs.vue';
import { computed } from 'vue';
import RolesTable from '../components/RolesTable.vue';
import { ref, onMounted } from 'vue';
import PrivilegesTable from '../components/PrivilegesTable.vue';

const route = useRoute()

const pages = computed({
	get() {
		return [
			{
				name: 'Roles / Privileges',
				to: {
					name: 'Roles Home Page',
				},
				current: false,
			},
		];
	},
	set(newValue) {
		newValue;
	},
});

const tab = ref('Roles')

const handleChangeTab = (tabName) => {
	tab.value = tabName;
}

onMounted(() => {
	if(route.query.name && route.query.name == 'privileges') {
		tab.value = 'Privileges'
	}
})
</script>
