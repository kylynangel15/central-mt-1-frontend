<template>
	<TransitionRoot as="template" :show="open">
		<Dialog as="div" class="relative z-10">
			<TransitionChild
				as="template"
				enter="ease-out duration-300"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="ease-in duration-200"
				leave-from="opacity-100"
				leave-to="opacity-0">
				<div
					class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
			</TransitionChild>

			<div class="fixed inset-0 z-10 overflow-y-auto">
				<div
					class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
					<TransitionChild
						as="template"
						enter="ease-out duration-300"
						enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enter-to="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leave-from="opacity-100 translate-y-0 sm:scale-100"
						leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
						<DialogPanel
							class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
							<div>
								<div class="mt-3 sm:mt-5">
									<DialogTitle
										as="h3"
										class="text-lg font-medium leading-6 text-gray-900">
										{{
											isEdit
												? isChild
													? 'Edit Child Privilege'
													: 'Edit Privilege'
												: isChild
												? 'Add Child Privilege'
												: 'Add Privilege'
										}}
									</DialogTitle>
									<div class="mt-2">
										<div class="grid grid-cols-6 gap-6">
											<div
												class="col-span-6 sm:col-span-6">
												<label
													for="action_name"
													class="block text-sm font-medium text-gray-700">
													Action Name
												</label>
												<input
													type="text"
													placeholder="Enter Action Name"
													v-model="
														privilegeForm.action_name
													"
													name="action_name"
													id="action_name"
													autocomplete="action_name"
													class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
												<ErrorSpanMessage
													v-if="
														errorValue &&
														errorValue.action_name
													">
													{{
														errorValue
															.action_name[0]
													}}
												</ErrorSpanMessage>
											</div>
											<div
												class="col-span-6 sm:col-span-6">
												<label
													for="system_name"
													class="block text-sm font-medium text-gray-700">
													System Name
												</label>
												<input
													type="text"
													placeholder="Enter System Name"
													v-model="
														privilegeForm.system_name
													"
													name="system_name"
													id="system_name"
													autocomplete="system_name"
													class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
												<ErrorSpanMessage
													v-if="
														errorValue &&
														errorValue.system_name
													">
													{{
														errorValue
															.system_name[0]
													}}
												</ErrorSpanMessage>
											</div>
											<div
												class="col-span-6 sm:col-span-6">
												<label
													for="description"
													class="block text-sm font-medium text-gray-700">
													Description
												</label>
												<textarea
													type="text"
													rows="4"
													placeholder="Enter Description"
													v-model="
														privilegeForm.description
													"
													name="description"
													id="description"
													autocomplete="family-name"
													class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
											</div>
											<div
												class="col-span-6 sm:col-span-6">
												<label
													for="description"
													class="block text-sm font-medium text-gray-700">
													Supper Admin
												</label>
												<SwitchToggle
													v-model="
														privilegeForm.is_superadmin
													" />
											</div>
											<div
												class="col-span-6 sm:col-span-6">
												<label
													for="description"
													class="block text-sm font-medium text-gray-700">
													Status
												</label>
												<SwitchToggle
													v-model="
														privilegeForm.status
													" />
											</div>
										</div>
									</div>
								</div>
							</div>
							<div
								class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
								<button
									type="button"
									class="inline-flex w-full justify-center rounded-md border border-transparent bg-untitled-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
									@click="handleClickAddPrivilege">
									{{ isEdit ? 'Save' : 'Add' }}
								</button>
								<button
									type="button"
									class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
									@click="handleClickCloseModal"
									ref="cancelButtonRef">
									Cancel
								</button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup>
import { ref, defineProps, computed, defineEmits, onMounted } from 'vue';
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	TransitionChild,
	TransitionRoot,
} from '@headlessui/vue';
import { CheckIcon } from '@heroicons/vue/24/outline';
import ErrorSpanMessage from '@/components/ErrorSpanMessage.vue';
import { storePrivilege } from '../../composables/privilege/store_privilege';
import { updatePrivilege } from '../../composables/privilege/update_privilege';
import SwitchToggle from '@/components/forms/SwitchToggle.vue';

const props = defineProps({
	privilege: {
		type: Object,
		default: () => {},
	},
	childPrivilege: {
		type: Object,
		default: () => {},
	},
	isChild: {
		type: Boolean,
		default: false,
	},
	openModal: {
		type: Boolean,
		default: false,
	},
	isEdit: {
		type: Boolean,
		default: false,
	},
	featureId: {
		type: Number,
		default: null,
	},
});

const emit = defineEmits(['closeModal', 'addPrivilege']);

const open = computed(() => props.openModal);
const privilege = computed(() => props.privilege);
const childPrivilege = computed(() => props.childPrivilege);
const isChild = computed(() => props.isChild);
const isEdit = computed(() => props.isEdit);
const featureId = computed(() => props.featureId);
const privilegeForm = ref({
	action_name: '',
	system_name: '',
	description: '',
	status: true,
    error_msg: '',
	is_superadmin: false
});
const errorValue = ref({});
const errorMessage = ref(null);
const loadingSave = ref(false);
const showNotification = ref(false);
const messageNotification = ref(null);

const handleClickCloseModal = () => {
	emit('closeModal');
};

const handleClickAddPrivilege = () => {
	if (featureId.value) {
		if (privilegeForm.value && privilegeForm.value.id) {
			editPrivilege();
			return;
		}

		createPrivilege();

		return;
	}

	if (!privilegeForm.value.action_name) {
		errorValue.value.action_name = ['The action name field is required.'];
		return;
	}

	if (!privilegeForm.value.system_name) {
		errorValue.value.system_name = ['The system name field is required.'];
	}

	errorValue.value = {};
	emit('addPrivilege', {
		privilegeValue: privilegeForm.value,
		isEdit: isEdit.value,
		isChild: isChild.value,
		parentPrivilege: privilege.value,
		childPrivilege: privilege.value,
	});
};

const initializeForm = () => {
	privilegeForm.value = {
		action_name: '',
		system_name: '',
		description: '',
		status: true,
        error_msg: ''
	};
};

const createPrivilege = async () => {
	loadingSave.value = true;
	privilegeForm.value.app_feature_id = featureId.value;
	privilegeForm.value.privilege_id = privilege.value.id;
	privilegeForm.value.status = privilegeForm.value.status ? 1 : 0
	privilegeForm.value.is_superadmin = privilegeForm.value.is_superadmin ? 1 : 0
	const { post, data, errorData, message } = storePrivilege(
		privilegeForm.value
	);
	await post();
	errorValue.value = errorData.value;
	errorMessage.value = message.value;
	loadingSave.value = false;
	if (!data.value) {
		privilegeForm.value.status = privilegeForm.value.status ? true : false;
		privilegeForm.value.is_superadmin = privilegeForm.value.is_superadmin ? true : false;
		return;
	}
	emit('addPrivilege', {
		privilegeValue: data.value,
		isEdit: isEdit.value,
		isChild: isChild.value,
		parentPrivilege: privilege.value,
		childPrivilege: privilege.value,
	});
};

const editPrivilege = async () => {
	loadingSave.value = true;
	const { update, data, errorData, message } = updatePrivilege(
		privilegeForm.value,
		privilegeForm.value.id
	);
	await update();
	loadingSave.value = false;
	errorValue.value = errorData.value;
	errorMessage.value = message.value;
	if (!data.value) {
		privilegeForm.value.status = privilegeForm.value.status ? true : false;
		privilegeForm.value.is_superadmin = privilegeForm.value.is_superadmin ? true : false;
		return;
	}

	emit('addPrivilege', {
		privilegeValue: privilegeForm.value,
		isEdit: isEdit.value,
		isChild: isChild.value,
		parentPrivilege: privilege.value,
		childPrivilege: privilege.value,
	});
};

onMounted(() => {
	if (isEdit.value && !isChild.value) {
		privilegeForm.value = { ...privilege.value };
		privilegeForm.value.status = privilegeForm.value.status ? true : false;
		privilegeForm.value.is_superadmin = privilegeForm.value.is_superadmin ? true : false;
	}

	if (isChild.value && isEdit.value) {
		privilegeForm.value = { ...childPrivilege.value };
		privilegeForm.value.status = privilegeForm.value.status ? true : false;
		privilegeForm.value.is_superadmin = privilegeForm.value.is_superadmin ? true : false;
	}

	if (!isChild.value && !isEdit.value) {
		initializeForm();
	}
});
</script>
