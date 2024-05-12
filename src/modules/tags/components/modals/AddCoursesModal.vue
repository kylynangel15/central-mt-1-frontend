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
										class="text-lg font-medium leading-6 text-untitled-gray-900">
										Attach Courses
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
											Select All Courses?
										</span>
										<SelectCourses
											:show-label="false"
											v-if="!selectAll"
											v-model="courses"
											:filter-by-tag="tagId"
											:company-id="companyId"
											@clearCourses="handleClearUsers" />
									</div>
								</div>
							</div>
							<div
								class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
								<button
									type="button"
									class="inline-flex w-full justify-center rounded-md border border-transparent bg-untitled-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
									@click="handleCloseSave">
									Save
								</button>
								<button
									type="button"
									class="mt-3 inline-flex w-full justify-center rounded-md border border-untitled-gray-300 bg-white px-4 py-2 text-base font-medium text-untitled-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
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
import { ref, defineProps, defineEmits, computed } from 'vue';
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	TransitionChild,
	TransitionRoot,
} from '@headlessui/vue';
import { CheckIcon } from '@heroicons/vue/24/outline';
import { updateTag } from '../../composables/update_tags';
import SelectCourses from '../../utilities/SelectCourses.vue';
import SelectCompanies from '@/modules/companies/utilities/SelectCompanies.vue';
const props = defineProps({
	openModal: {
		type: Boolean,
		default: false,
	},
	tagId: {
		type: Number,
		required: true,
	},
	tagProfile: {
		type: Object,
		required: true,
	},
	companyId: {
		type: Number,
		required: true,
	}
});
const emit = defineEmits(['closeModal', 'addCourses']);
const open = computed(() => props.openModal);
const courses = ref([]);
const selectAll = ref(false);
const tagProfile = computed({
	get() {
		return props.tagProfile;
	},
	set(newValue) {
		newValue;
	},
});
const showNotif = ref(false);
const messageNotif = ref(null);
const tagId = computed(() => props.tagId);
const errorValue = ref(null);
const errorMessage = ref(null);
const company = ref({})
const companyId = computed(() => props.companyId);

const handleCloseModal = () => {
	emit('closeModal');
};

const handleClearUsers = () => {
	courses.value = [];
};

const handleCloseSave = async () => {
	tagProfile.value.courses = selectAll.value
		? 'all'
		: courses.value.map((course) => course.id);

	const { update, data, errorData, message } = updateTag(tagProfile.value);
	await update();
	errorValue.value = errorData.value;
	errorMessage.value = message.value;
	if (!data.value) {
		return;
	}
	emit('addCourses');
};

const handleClearCompany = () => {
	company.value = {}
}

const notification = (message) => {
	messageNotif.value = message;
	showNotif.value = true;
	setTimeout(() => {
		showNotif.value = false;
	}, 2000);
};
</script>
