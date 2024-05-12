<template>
	<div class="mt-10">
		<div class="md:grid md:grid-cols-3 md:gap-6">
			<div class="md:col-span-1">
				<div class="px-4 sm:px-0">
					<h3 class="text-lg font-medium leading-6 text-gray-900">
						Role Information
					</h3>
				</div>
			</div>
			<div class="mt-5 md:col-span-2 md:mt-0">
				<form action="#" method="POST">
					<div class="overflow-hidden shadow sm:rounded-md">
						<div class="bg-white px-4 py-5 sm:p-6">
							<div class="grid grid-cols-6 gap-6">
								<div class="col-span-6 sm:col-span-3">
									<label
										for="first-name"
										class="block text-sm font-medium text-gray-700">
										System Name
									</label>
									<input
										type="text"
										name="first-name"
										v-model="role.name"
										id="first-name"
										autocomplete="given-name"
										readonly
										class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
								</div>

								<div class="col-span-6 sm:col-span-3">
									<label
										for="last-name"
										class="block text-sm font-medium text-gray-700">
										Friendly Name
									</label>
									<input
										type="text"
										name="last-name"
										id="last-name"
										v-model="role.friendly_name"
										autocomplete="family-name"
										readonly
										class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
								</div>

								<div
									v-if="role.company && role.company.id"
									class="sm:col-span-6">
									<SelectCompanies
										v-model="role.company"
										:is-read-only="true"
										:is-disabled="true" />
								</div>

								<div class="col-span-6">
									<label
										for="street-address"
										class="block text-sm font-medium text-gray-700">
										Description
									</label>
									<textarea
										row="4"
										type="text"
										readonly
										v-model="role.description"
										name="street-address"
										id="street-address"
										autocomplete="street-address"
										class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
								</div>

								<div class="col-span-6">
									<div class="col-span-6" v-if="!defaultRole">
										<label
											for="street-address"
											class="block text-sm font-medium text-gray-700">
											Set as Global Role?
										</label>
										<SwitchToggle v-model="globalRole" />
									</div>
									<div class="col-span-6" v-else>
										<label
											for="street-address"
											class="block text-sm font-medium text-gray-700">
											Default
										</label>
										<SwitchToggle v-model="defaultRole" disabled/>
									</div>

								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
	<div class="hidden sm:block" aria-hidden="true">
				<div class="py-5">
					<div class="border-t border-untitled-gray-200" />
				</div>
			</div>
			<div class="mt-10 sm:mt-0">
				<div class="px-4 sm:px-0">
					<h3 class="text-lg font-medium leading-6 text-gray-900">
						App Feature Privileges
					</h3>
					<p class="mt-1 text-sm text-gray-600">
						Lorem ipsum dolor, sit amet consectetur adipisicing
						elit. Explicabo in, harum fugiat aut voluptatibus illo
						eligendi
					</p>
				</div>
				<div class="px-4 sm:px-0">
					<RoleAppList :read-only="true" :role-id="roleProfile.id" :role="roleProfile"/>
				</div>
			</div>
</template>
<script>
// use normal <script> to declare options
export default {
	inheritAttrs: false,
};
</script>

<script setup>
import SwitchToggle from '@/components/forms/SwitchToggle.vue';
import SelectCompanies from '@/modules/companies/utilities/SelectCompanies.vue';
import { defineProps, computed } from 'vue';
import RoleAppList from './privilege/RoleAppList.vue';
const props = defineProps({
	roleProfile: {
		type: Object,
		required: true,
	},
});

const role = computed(() => props.roleProfile);

const globalRole = computed({
	get() {
		return role.value.global ? true : false;
	},
	set(newValue) {
		newValue;
	},
});

const defaultRole = computed({
	get() {
		return role.value.default ? true : false;
	},
	set(newValue) {
		newValue;
	},
});
</script>
