<template>
	<GlobalBreadCrumbs :pages="pages" />
	<PageLoader v-if="loading" />
	<div class="py-6" v-else>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 xs:mb-4 mb-8">
			<h1 class="text-2xl font-semibold text-untitled-gray-600">
				Feature
				<span class="text-lg font-light"> Details </span>
			</h1>
			<div class="relative mt-1 py-1 rounded-md">
				<router-link
					class="absolute text-untitled-gray-500 inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
					:to="{
						name: 'View App Page',
						params: { id: appId },
						query: { tab: 'Features' },
					}">
					<ArrowLeftIcon
						class="-ml-1 mr-2 h-5 w-5"
						aria-hidden="true" />
				</router-link>
				<label class="pl-10 text-sm text-untitled-gray-500">Back</label>
				<router-link
					:to="{
						name: 'Edit Feature Page',
						params: { id: appId, featureId: featureId },
					}"
					class="inline-flex float-right justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
					Edit
				</router-link>
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
								Feature
							</h3>
							<p class="mt-1 text-sm text-gray-600">
								Lorem ipsum dolor, sit amet consectetur
								adipisicing elit. Explicabo in, harum fugiat aut
								voluptatibus illo eligendi
							</p>
						</div>
					</div>
					<div class="mt-5 md:col-span-2 md:mt-0">
						<form>
							<div class="overflow-hidden shadow sm:rounded-md">
								<div class="bg-white px-4 py-5 sm:p-6">
									<div class="grid grid-cols-6 gap-6">
										<div class="col-span-6 sm:col-span-6">
											<label
												for="name"
												class="block text-sm font-medium text-gray-700">
												Name
											</label>
											<input
												type="text"
												name="name"
												id="name"
												v-model="feature.name"
												readonly
												autocomplete="given-name"
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
										</div>

										<div class="col-span-6">
											<label
												for="description"
												class="block text-sm font-medium text-gray-700">
												Description
											</label>
											<textarea
												rows="4"
												v-model="feature.description"
												type="text"
												name="description"
												readonly
												id="description"
												autocomplete="description"
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
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
					<div class="border-t border-gray-200" />
				</div>
			</div>
			<div v-if="feature.privileges && feature.privileges.length == 0" class="bg-white mb-2">
					<NoDataLoader :no-data-message="'No Privileges'" />
				</div>
			<div
				class="mx-auto w-full bg-white p-2"
				v-if="feature.privileges && feature.privileges.length">
				<h3 class="text-lg font-medium mb-5 leading-6 text-gray-900">
					Privilege
				</h3>
				<Disclosure
					v-slot="{ open }"
					v-for="(privilege, index) in feature.privileges"
					:default-open="privilege.childs && privilege.childs.length ? true : false"
					:key="index">
					<div
						class="flex shadow w-full justify-between rounded-lg my-2 bg-untitled-gray-50 border border-untitled-gray-200 px-4 py-2 text-left text-sm font-medium text-untitled-gray-900 hover:bg-untitled-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-untitled-gray-500 focus-visible:ring-opacity-75"
						@click="open = true">
						<div class="w-full leading-5">
							<p class="text-untitled-gray-500 font-semibold">
								Action Name:
								<span class="font-light">
									{{ privilege.action_name }}
								</span>
							</p>
							<p class="text-untitled-gray-500 font-semibold">
								System Name:
								<span class="font-light">
									{{ privilege.system_name }}
								</span>
							</p>
							<p class="text-untitled-gray-500 font-semibold">
								Description:
								<span class="font-light">
									{{ privilege.description }}
								</span>
							</p>
						</div>

						<DisclosureButton v-if="privilege.childs && privilege.childs.length">
							<ChevronUpIcon
								:class="open ? 'rotate-180 transform' : ''"
								class="h-5 w-5 text-untitled-gray-500" />
						</DisclosureButton>
					</div>
					<DisclosurePanel class="px-4 pb-2 text-sm text-gray-500" >
						<div class="w-full lg:pl-20 sm:pl-0">
							<Disclosure
								v-slot="{ open }"
								v-for="(
									childPrivilege, childIndex
								) in privilege.childs"
								:key="childIndex">
								<div
									class="flex w-full justify-between rounded-lg my-2 bg-untitled-gray-50 px-4 py-2 text-left text-sm font-medium text-untitled-gray-900 hover:bg-untitled-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-untitled-gray-500 focus-visible:ring-opacity-75"
									@click="open = true">
									<div class="w-full">
										<p
											class="text-untitled-gray-500 font-semibold">
											Action Name:
											<span class="font-light">
												{{ childPrivilege.action_name }}
											</span>
										</p>
										<p
											class="text-untitled-gray-500 font-semibold">
											System Name:
											<span class="font-light">
												{{ childPrivilege.system_name }}
											</span>
										</p>
										<p
											class="text-untitled-gray-500 font-semibold">
											Description:
											<span class="font-light">
												{{ childPrivilege.description }}
											</span>
										</p>
									</div>
								</div>
							</Disclosure>
						</div>
					</DisclosurePanel>
				</Disclosure>
			</div>
		</div>
	</div>
</template>
<script setup>
import GlobalBreadCrumbs from '@/components/GlobalBreadCrumbs.vue';
import NoDataLoader from '@/components/loader/NoDataLoader.vue';
import PageLoader from '@/components/loader/PageLoader.vue';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { ArrowLeftIcon, ChevronUpIcon } from '@heroicons/vue/24/outline';
import { defineProps, computed, ref, onMounted } from 'vue';
import { getFeature } from '../../composables/features/get_feature';
const props = defineProps({
	id: null,
	featureId: null,
});

const appId = computed(() => props.id);
const featureId = computed(() => props.featureId);
const feature = ref({});
const loading = ref(false);
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
			{
				name: 'Feature',
				to: {
					name: featureId.value
						? 'Edit Feature Page'
						: 'Create Feature Page',
					params: {
						id: appId.value,
					},
				},
				current: false,
			},
			{
				name: 'Details',
				to: {
					name: 'View Feature Page',
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

const fetchFeature = async () => {
	loading.value = true;
	const { load, data } = getFeature(featureId.value);
	await load();
	feature.value = data.value;
	loading.value = false;
};

onMounted(async () => {
	if (featureId.value) {
		await fetchFeature();
	}
});
</script>
