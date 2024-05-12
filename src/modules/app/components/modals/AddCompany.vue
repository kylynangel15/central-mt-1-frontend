<template>
	<TransitionRoot as="template" :show="open">
		<Dialog as="div" class="relative z-10" @close="handleCloseModal">
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

			<div class="fixed inset-0 z-10">
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
							class="relative transform rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
							<div>
								<div class="mt-3 sm:mt-5">
									<DialogTitle
										as="h3"
										class="text-lg font-medium leading-6 text-gray-900">
										Attach Companies
									</DialogTitle>
									<div class="mt-2">
										<span
											class="text-xs py-2 text-untitled-gray-500">
											<input
												type="checkbox"
												v-model="selectAll"
												name=""
												id=""
												class="my-2 bg-untitled-gray-50 mr-2" />
											Select All Companies?
										</span>
										<SelectCompanies
											v-if="!selectAll"
											v-model="companies"
											:show-label="false"
											:filter-app-company="appProfile.id"
											@clearCompany="handleClearCompany"
											:show-all-company="true"
											:is-multiple="true" />
									</div>
								</div>
							</div>
							<div
								class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
								<button
									type="button"
									class="inline-flex w-full justify-center rounded-md border border-transparent bg-untitled-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
									@click="handleAddCompany">
									Save
								</button>
								<button
									type="button"
									class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
									@click="handleCloseModal"
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
	<global-popup-notification
		v-if="showNotif"
		:show-notification="showNotif"
		:message="messageNotif" />
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
import SelectCompanies from '@/modules/companies/utilities/SelectCompanies.vue';
import { addCompany } from '../../composables/add_company';

const props = defineProps({
	openModal: {
		type: Boolean,
		default: false,
	},
	appProfile: {
		type: Object,
		default: () => {},
	},
	selectedCompanies: {
		type: Array,
        default: () => [],
	}
});

const emit = defineEmits(['closeModal', 'addCompany']);

const open = computed(() => props.openModal);

const appProfile = computed(() => props.appProfile);

const companies = ref([]);

const selectAll = ref(false);

const showNotif = ref(false)

const messageNotif = ref(null);

const showCompany = ref(false);

const selectedCompanies = computed(() => props.selectedCompanies)

const handleCloseModal = () => {
	selectAll.value = false
	companies.value = [];
	emit('closeModal');
};

const handleClearCompany = () => {
	companies.value = [];
};

const handleAddCompany = async () => {
	if (selectAll.value) {
		appProfile.value.companies = 'all';
	} else {
		appProfile.value.companies = companies.value;
	}

	const { data, update } = addCompany(appProfile.value);
	await update();
    notification('Successfully added!')
	selectAll.value = false
    emit('addCompany')
};



const notification = (message) => {
	messageNotif.value = message;
	showNotif.value = true;
	setTimeout(() => {
		showNotif.value = false;
	}, 2000);
};

onMounted(() => {
	
})
</script>
