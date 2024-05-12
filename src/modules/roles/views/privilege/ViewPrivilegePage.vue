<template>
    <GlobalBreadCrumbs :pages="pages" />
	<PageLoader v-if="loading" />
	<div class="py-6" v-else>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<h1 class="text-2xl font-semibold text-untitled-gray-700">
				Privilege
				<span class="text-lg font-thin">Details</span>
			</h1>
			<div class="relative mt-1 py-4 rounded-md">
				<button
					type="button"
					v-if="privilegeId"
					:disabled="loading"
					@click="handleClickPreview"
					class="inline-flex pb-1 float-right justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
					Edit
				</button>
				<router-link
					class="absolute text-untitled-gray-500 inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
					:to="{ name: 'Roles Home Page', query: { name: 'privileges'} }">
					<ArrowLeftIcon
						class="-ml-1 mr-2 h-5 w-5"
						aria-hidden="true" />
				</router-link>
				<label class="p-10 text-sm text-untitled-gray-500">Back</label>
			</div>
		</div>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<div class="hidden sm:block" aria-hidden="true">
				<div class="py-5">
					<div class="border-t border-gray-200" />
				</div>
			</div>

			<div class="mt-10 sm:mt-0">
				<div class="md:grid md:grid-cols-3 md:gap-6">
					<div class="md:col-span-1">
						<div class="px-4 sm:px-0">
							<h3
								class="text-lg font-medium leading-6 text-gray-900">
								Privilege Information
							</h3>
							<p class="mt-1 text-sm text-gray-600">
								Use a permanent address where you can receive
								mail.
							</p>
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
												Action name 
											</label>
											<input
												type="text"
												name="first-name"
                                                readonly
												v-model="privilege.action_name"
												id="first-name"
												autocomplete="given-name"
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
										</div>

										<div class="col-span-6 sm:col-span-3">
											<label
												for="last-name"
												class="block text-sm font-medium text-gray-700">
												System Name 
											</label>
											<input
												type="text"
												v-model="privilege.system_name"
												name="last-name"
												id="last-name"
                                                readonly
												autocomplete="family-name"
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
										</div>
										<div class="col-span-6">
											<SelectFeature
                                                :is-disabled="true"
												v-model="privilege.app_feature"/>
										</div>

										<div class="col-span-6">
											<label
												for="description"
												class="block text-sm font-medium text-gray-700">
												Parent Privilege
											</label>
											<SelectPrivilege
                                                :is-disabled="true"
												v-model="
													privilege.parent_privilege
												"
												:privilege-id="
													privilegeId
														? parseInt(privilegeId)
														: 0
												"
												:show-label="false" />
										</div>
										<div class="col-span-6">
											<label
												for="description"
												class="block text-sm font-medium text-gray-700">
												Description
											</label>
											<textarea
												rows="4"
												type="text"
                                                readonly
												v-model="privilege.description"
												name="description"
												id="description"
												autocomplete="description"
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
										</div>

										<div class="col-span-6">
											<label
												for="error_msg"
												class="block text-sm font-medium text-gray-700">
												Error Message
											</label>
											<textarea
												rows="4"
                                                readonly
												v-model="privilege.error_msg"
												type="text"
												name="error_msg"
												id="error_msg"
												autocomplete="error_msg"
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
										</div>

										<div class="col-span-6">
											<label
												for="error_msg"
												class="block text-sm font-medium text-gray-700">
												Status
											</label>

											<SwitchToggle
                                                :is-readonly="true"
												v-model="privilege.status" />
										</div>
									</div>
								</div>
								<div
									class="bg-gray-50 px-4 py-3 text-right sm:px-6">
									<button
										type="button"
										@submit="savePrivilege()"
										@click="savePrivilege()"
										class="inline-flex justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
										Save
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>

			<div class="hidden sm:block" aria-hidden="true">
				<div class="py-5">
					<div class="border-t border-gray-200" />
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { getPrivilege } from '../../composables/privilege/get_privilege'
import { defineProps, onMounted, ref, computed } from 'vue';
import GlobalBreadCrumbs from '@/components/GlobalBreadCrumbs.vue';
import PageLoader from '@/components/loader/PageLoader.vue';
import SelectFeature from '@/modules/app/utilities/SelectFeature.vue';
import SelectPrivilege from '../../utilities/SelectPrivilege.vue';
import SwitchToggle from '@/components/forms/SwitchToggle.vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';

const props = defineProps({
    id: null
})
const router = useRouter();
const privilegeId = computed(() => props.id)
const privilege = ref({})
const loading = ref(false)
const pages = ref([
	{
		name: 'Roles / Privileges',
		to: {
			name: 'Roles Home Page',
		},
		current: false,
	},
	{
		name: 'Details',
		to: {
			name: 'View Privilege Page',
			params: {
				id: privilegeId.value ? privilegeId.value : null,
			},
		},
		current: true,
	},
]);

const fetchPrivilege = async () => {
	loading.value = true
	const { load, data } = getPrivilege(privilegeId.value);
	await load();
	privilege.value = data.value;
    privilege.value.status  = privilege.value.status ? true : false
    privilege.value.parent_privilege = {}
	loading.value = false;
};

const handleClickPreview = () => {
    router.push({ name: 'Edit Privilege Page', params: { id: privilegeId.value }})
}

onMounted(async () => {
    await fetchPrivilege();
})
</script>