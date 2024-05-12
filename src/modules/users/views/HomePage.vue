import UsersTable from '../components/UsersTable.vue';

<template>
	<GlobalBreadCrumbs :pages="pages" />
	<div class="py-6">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<h1 class="text-2xl font-semibold text-gray-900">Users</h1>
		</div>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<div class="py-4">
				<div class="">
					<UsersTable />
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import GlobalBreadCrumbs from '@/components/GlobalBreadCrumbs.vue';
import UsersTable from '../components/UsersTable.vue';

const pages = [
	{
		name: 'Users',
		to: {
			name: 'User Home Page',
		},
	},
];
</script>
