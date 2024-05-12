<template>
	<GlobalBreadCrumbs :pages="pages" />
	<PageLoader v-if="loading" />
	<div class="py-6" v-else>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 xs:mb-4 mb-8">
			<h1 class="text-2xl font-semibold text-untitled-gray-600">
				Feature
				<span class="text-lg font-light">
					{{ featureId ? 'Edit' : 'Create' }}</span
				>
			</h1>
			<div class="relative mt-1 py-1 rounded-md">
				<router-link
					class="absolute text-untitled-gray-500 inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
					:to="{ name: 'View App Page', params: { id: appId }, query: { tab: 'Features'} }">
					<ArrowLeftIcon
						class="-ml-1 mr-2 h-5 w-5"
						aria-hidden="true" />
				</router-link>
				<label class="pl-10 text-sm text-untitled-gray-500">Back</label>
				<button
					type="button"
					:disabled="loadingSave"
					@click="handleClickSave"
					class="inline-flex float-right justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
					{{ loadingSave ? 'Saving...' : 'Save' }}
				</button>
				<router-link
					:to="{ name: 'View App Page', params: { id: appId } }"
					class="inline-flex float-right justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-untitled-gray-500 shadow-lg mr-2 hover:bg-untitled-gray-100 focus:outline-none focus:ring-2 focus:ring-untitled-gray-400 focus:ring-offset-2">
					Cancel
				</router-link>
				<button
					type="button"
					v-if="featureId"
					:disabled="loading"
					@click="handleClickPreview"
					class="inline-flex mr-2 float-right justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
					Preview
				</button>
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
												Name <RequiredSpan />
											</label>
											<input
												type="text"
												name="name"
												id="name"
												v-model="feature.name"
												autocomplete="given-name"
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
											<ErrorSpanMessage
												v-if="
													errorValue &&
													errorValue.name
												">
												{{ errorValue.name[0] }}
											</ErrorSpanMessage>
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
			<!-- <ErrorSpanMessage
				v-if="
					errorValue &&
					errorValue.privileges
				">
				{{ errorValue.privileges[0] }}
			</ErrorSpanMessage> -->
			<div class="mt-10 sm:mt-0">
				<div class="px-4 sm:px-0">
					<h3 class="text-lg font-medium leading-6 text-gray-900">
						Privileges
					</h3>
					<p class="mt-1 text-sm text-gray-600">
						Lorem ipsum dolor, sit amet consectetur adipisicing
						elit. Explicabo in, harum fugiat aut voluptatibus illo
						eligendi
					</p>
				</div>
				<button
					type="button"
					@click="handleClickAddPrivilege"
					class="flex w-full w-40 justify-center rounded-md border border-transparent bg-untitled-gray-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 my-4 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
					<PlusIcon class="w-5 mr-2" /> Add Privilege
				</button>
				<div v-if="privileges.length == 0" class="bg-white mb-2">
					<NoDataLoader :no-data-message="'No Privileges'" />
				</div>
				<div
					class="mx-auto w-full bg-white p-2"
					v-if="privileges.length">
					<Disclosure
						v-slot="{ open }"
						v-for="(privilege, index) in privileges"
						:key="index">
						<div
							class="flex w-full justify-between rounded-lg my-2 bg-untitled-gray-50 border border-untitled-gray-200 px-4 py-2 text-left text-sm font-medium text-untitled-gray-900 hover:bg-untitled-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-untitled-gray-500 focus-visible:ring-opacity-75"
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
								<div class="flex float-right">
									<DisclosureButton
										v-if="!open"
										type="button"
										@click="
											handleAddChildPrivilege(
												privilege,
												index
											)
										"
										class="mt-5 mr-2 inline-flex items-center rounded bg-untitled-gray-500 text-white px-2.5 py-1.5 text-xs font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
										<PlusIcon
											class="h-4 w-4 text-white mr-2" />
										Add Child Privilege
									</DisclosureButton>
									<DisclosureButton
										v-if="open"
										type="button"
										class="mt-5 mr-2 inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
										<XMarkIcon
											class="h-4 w-4 text-untitled-gray-500 mr-2" />
										Hide Child Privilege
									</DisclosureButton>
									<button
										type="button"
										@click="
											handleClickEditParentPrivilege(
												index,
												privilege
											)
										"
										class="mt-5 mr-2 inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
										<PencilSquareIcon
											class="h-4 w-4 text-untitled-gray-500 mr-2" />
										Edit
									</button>

									<button
										type="button"
										@click="
											handleClickRemoveParentPrivilege(
												index,
												privilege
											)
										"
										class="mt-5 inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
										<TrashIcon
											class="h-4 w-4 text-untitled-gray-500 mr-2" />
										Remove
									</button>
								</div>
							</div>

							<DisclosureButton>
								<ChevronUpIcon
									:class="open ? 'rotate-180 transform' : ''"
									class="h-5 w-5 text-untitled-gray-500" />
							</DisclosureButton>
						</div>
						<DisclosurePanel
							class="px-4 pb-2 text-sm text-gray-500">
							<div class="w-full lg:pl-20 sm:pl-0">
								<button
									type="button"
									@click="
										handleAddChildPrivilege(
											privilege,
											index
										)
									"
									class="mr-2 mb-2 inline-flex items-center rounded border border-gray-300 bg-untitled-gray-500 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
									<PlusIcon class="h-4 w-4 text-white mr-2" />
									Add Child Privilege
								</button>
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
													{{
														childPrivilege.action_name
													}}
												</span>
											</p>
											<p
												class="text-untitled-gray-500 font-semibold">
												System Name:
												<span class="font-light">
													{{
														childPrivilege.system_name
													}}
												</span>
											</p>
											<p
												class="text-untitled-gray-500 font-semibold">
												Description:
												<span class="font-light">
													{{
														childPrivilege.description
													}}
												</span>
											</p>
											<div class="flex float-right">
												<button
													type="button"
													@click="
														handleEditChildPrivilege(
															index,
															childIndex,
															childPrivilege
														)
													"
													class="mt-5 mr-2 inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
													<PencilSquareIcon
														class="h-4 w-4 text-untitled-gray-500 mr-2" />
													Edit
												</button>

												<button
													type="button"
													@click="
														handleClickRemoveChild(
															index,
															childIndex
														)
													"
													class="mt-5 inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
													<TrashIcon
														class="h-4 w-4 text-untitled-gray-500 mr-2" />
													Remove
												</button>
											</div>
										</div>
									</div>
								</Disclosure>
							</div>
						</DisclosurePanel>
					</Disclosure>
				</div>
			</div>

			<div class="mt-5 pb-3 text-right">
				<router-link
					:to="{
						name: 'View App Page',
						params: { id: appId },
					}"
					class="inline-flex justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-untitled-gray-500 shadow-lg mr-2 hover:bg-untitled-gray-100 focus:outline-none focus:ring-2 focus:ring-untitled-gray-400 focus:ring-offset-2">
					Cancel
				</router-link>
				<button
					type="button"
					:disabled="loadingSave"
					@click="handleClickSave"
					class="inline-flex justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
					{{ loadingSave ? 'Saving...' : 'Save' }}
				</button>
			</div>
		</div>
	</div>

	<AddPrivilegeModal
		v-if="openAddPrivilege"
		:open-modal="openAddPrivilege"
		:privilege="parentPrivilege"
		:child-privilege="childPrivilege"
		:is-child="isChild"
		:is-edit="isEdit"
		:feature-id="featureId ? parseInt(featureId) : 0"
		@close-modal="handleCloseModal"
		@addPrivilege="handleAddPrivilege" />

	<global-popup-notification
		v-if="showNotification"
		:show-notification="showNotification"
		:message="messageNotification" />
	<global-delete-confirmation
		@closeModal="handleCloseModal"
		@confirmed="handleDeletePrivilege"
		:selected-item="selectedItem"
		:params="itemName"
		:open-modal="openDeleteConfirmation" />
</template>
<script setup>
import ErrorSpanMessage from '@/components/ErrorSpanMessage.vue';
import GlobalBreadCrumbs from '@/components/GlobalBreadCrumbs.vue';
import NoDataLoader from '@/components/loader/NoDataLoader.vue';
import PageLoader from '@/components/loader/PageLoader.vue';
import RequiredSpan from '@/components/RequiredSpan.vue';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import {
	ArrowLeftIcon,
	ChevronUpIcon,
	PencilSquareIcon,
	PlusIcon,
	TrashIcon,
	XMarkIcon,
} from '@heroicons/vue/24/outline';
import { defineProps, ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import AddPrivilegeModal from '../../components/feature/AddPrivilegeModal.vue';
import { getFeature } from '../../composables/features/get_feature';
import { storeFeature } from '../../composables/features/store_feature';
import { updateFeature } from '../../composables/features/update_feature';
import { deletePrivilege } from '../../composables/privilege/delete_privilege';
import { updatePrivilege } from '../../composables/privilege/update_privilege';

const props = defineProps({
	id: null,
	featureId: null,
});
const router = useRouter();
const appId = computed(() => props.id);
const featureId = computed(() => props.featureId);
const loading = ref(false);
const openAddPrivilege = ref(false);
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
				name: featureId.value ? 'Edit' : 'Create',
				to: {
					name: featureId.value ? 'Edit Feature Page' : 'Create Feature Page',
					params: {
						id: appId.value,
						featureId: featureId.value
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

const parentPrivilege = ref({});
const childPrivilege = ref({});
const isChild = ref(false);
const isEdit = ref(false);
const errorValue = ref(null);
const errorMessage = ref(null);
const privileges = ref([]);
const loadingSave = ref(false);
const showNotification = ref(false);
const messageNotification = ref(null);
const openDeleteConfirmation = ref(false);
const selectedItem = ref(null);
const itemName = ref(null);
const feature = ref({
	name: '',
	description: '',
	app_id: appId.value,
});

const handleClickSave = () => {
	if (feature.value && feature.value.id) {
		editFeature();
		return;
	}

	createFeature();
};

const handleClickPreview = () => {
	router.push({
		name: 'View Feature Page',
		params: { id: appId.value, featureId: featureId.value },
	});
};

const createFeature = async () => {
	loadingSave.value = true;
	feature.value.privileges = privileges.value.map((privilege) => {
		if (privilege.status == true) {
			privilege.status = 1;
		} else {
			privilege.status = 0;
		}
		if (privilege.is_superadmin == true) {
			privilege.is_superadmin = 1;
		} else {
			privilege.is_superadmin = 0;
		}

		if(privilege.childs && privilege.childs.length) {
			privilege.childs = privilege.childs.map((childPrivilege) => {
				if (childPrivilege.status == true) {
					childPrivilege.status = 1;
				} else {
					childPrivilege.status = 0;
				}

				if (childPrivilege.is_superadmin == true) {
					childPrivilege.is_superadmin = 1;
				} else {
					childPrivilege.is_superadmin = 0;
				}

				return childPrivilege
			})
		}

		return privilege;
	});

	

	const { post, data, errorData, message } = storeFeature(feature.value);
	await post();
	loadingSave.value = false;
	errorValue.value = errorData.value;
	errorMessage.value = message.value;
	if (!data.value) {
		return;
	}
	notification('Successfully created!');
	router.push({
		name: 'Edit Feature Page',
		params: { id: appId.value, featureId: data.value.id },
	});
};

const editFeature = async () => {
	loadingSave.value = true;
	delete feature.value.privileges;
	const { update, data, errorData, message } = updateFeature(
		feature.value,
		featureId.value
	);
	await update();
	loadingSave.value = false;
	errorValue.value = errorData.value;
	errorMessage.value = message.value;
	if (!data.value) {
		return;
	}
	notification('Successfully updated!');
};

const fetchFeature = async () => {
	loading.value = true;
	const { load, data } = getFeature(featureId.value);
	await load();
	feature.value = data.value;
	privileges.value = data.value.privileges;
	loading.value = false;
};

const handleClickAddPrivilege = () => {
	openAddPrivilege.value = true;
	isChild.value = false;
	parentPrivilege.value = {};
	childPrivilege.value = {};
	isEdit.value = false;
};

const handleClickEditPrivilege = () => {};

const handleCloseModal = () => {
	openAddPrivilege.value = false;
	isChild.value = false;
	openDeleteConfirmation.value = false;
	isEdit.value = false;
};

const handleAddPrivilege = ({
	privilegeValue,
	isEdit,
	isChild,
	parentPrivilege,
	childPrivilege,
}) => {
	if (!isEdit) {
		if (!isChild) {
			privilegeValue.childs = [];
			privileges.value.push(privilegeValue);
		}
		if (isChild) {
			privileges.value.map((item, index) => {
				if (index == parentPrivilege.index) {
					if (!item.childs) {
						item.childs = [privilegeValue];
					} else {
						item.childs.unshift(privilegeValue);
					}
				}

				return item;
			});
		}
	}

	if (isEdit) {
		if (isChild) {
			privileges.value.map((item, index) => {
				if (index == privilegeValue.parentIndex) {
					item.childs[privilegeValue.childIndex] = privilegeValue;
				}

				return item;
			});
		}
		if (!isChild) {
			privileges.value.map((item, index) => {
				if (index == privilegeValue.index) {
					for (let key in privilegeValue) {
						item[key] = privilegeValue[key];
					}
				}

				return item;
			});
		}
	}

	openAddPrivilege.value = false;
	notification(isEdit ? 'Successfully updated!' : 'Successfully added!');
};

const handleClickEditParentPrivilege = (index, privilege) => {
	isChild.value = false;
	isEdit.value = true;
	parentPrivilege.value = { ...privilege };
	parentPrivilege.value.index = index;
	openAddPrivilege.value = true;
};

const handleAddChildPrivilege = (privilege, index) => {
	isChild.value = true;
	parentPrivilege.value = { ...privilege };
	parentPrivilege.value.index = index;
	openAddPrivilege.value = true;
};

const handleEditChildPrivilege = (parentIndex, childIndex, privilege) => {
	isChild.value = true;
	isEdit.value = true;
	childPrivilege.value = { ...privilege };
	childPrivilege.value.parentIndex = parentIndex;
	childPrivilege.value.childIndex = childIndex;
	openAddPrivilege.value = true;
};

const handleClickRemoveParentPrivilege = (index, privilege) => {
	openDeleteConfirmation.value = true;
	selectedItem.value = privilege;
	itemName.value = privilege.action_name;
	selectedItem.value.index = index;
};

const handleClickRemoveChild = (parentIndex, childIndex) => {
	privileges.value.map((item, index) => {
		if (index === parentIndex) {
			item.childs.splice(childIndex, 1);
		}

		return item;
	});
};

const handleDeletePrivilege = async (privilege) => {
	openDeleteConfirmation.value = false;
	if (featureId.value) {
		const { destroy, data } = deletePrivilege(privilege);
		await destroy();
		privileges.value.splice(privilege.index, 1);
	}

	if (!featureId.value) {
		privileges.value.splice(privilege.index, 1);
	}

	notification('Successfully deleted!');
};

const notification = (message) => {
	messageNotification.value = message;
	showNotification.value = true;
	setTimeout(() => {
		showNotification.value = false;
	}, 2000);
};

onMounted(async () => {
	if (featureId.value) {
		fetchFeature();
	}
});
</script>
