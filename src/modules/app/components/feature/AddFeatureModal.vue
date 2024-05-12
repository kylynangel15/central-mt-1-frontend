<template>
	<TransitionRoot as="template" :show="open">
		<Dialog as="div" class="relative z-10" @close="open = false">
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
										Add Feature
									</DialogTitle>
									<div class="mt-2">
										<div class="grid grid-cols-6 gap-6">
											<div
												class="col-span-6 sm:col-span-6">
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

                                            <div
												class="col-span-6 sm:col-span-6">
                                                <SelectApp v-model="feature.app" @clearFeature="handleClearFeature"/>
												<ErrorSpanMessage
													v-if="
														errorValue &&
														errorValue.app_id
													">
													{{ errorValue.app_id[0] }}
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
													v-model="
														feature.description
													"
													type="text"
													name="description"
													id="description"
													autocomplete="description"
													class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
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
									@click="saveFeature">
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
		v-if="showNotification"
		:show-notification="showNotification"
		:message="messageNotification" />
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
import ErrorSpanMessage from '@/components/ErrorSpanMessage.vue';
import RequiredSpan from '@/components/RequiredSpan.vue';
import { storeFeature } from '../../composables/features/store_feature';
import SelectApp from '../../utilities/SelectApp.vue';
import { useEmitter } from '@/composables/useEmitter';
import { notificationMessage } from '@/composables/notifications';

const props = defineProps({
	openModal: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['closeModal', 'addFeature']);

const emitter = useEmitter;

const open = computed(() => props.openModal);

const feature = ref({
    name: '',
    description: '',
    app: {}
})

const errorValue = ref(null)
const errorMessage = ref(null)
const showNotification = ref(false)
const messageNotification = ref(null)

const saveFeature = () => {
    if(feature.value && feature.value.id) {

        updateFeature();
        return
    }

    createFeature();
};

const createFeature = async () => {
    feature.value.app_id = feature.value.app.id
    const {post, data, errorData, message} = storeFeature(feature.value)
    await post();
    errorValue.value = errorData.value
    errorMessage.value = message.value

    if(!data.value) {
        return
    }

    notification(notificationMessage.add);
    emit('addFeature', data.value)
}

const updateFeature = async () => {

}

const handleClearFeature = () => {
    feature.value.app = {}
}

const notification = (message) => {
	messageNotification.value = message;
	showNotification.value = true;
	setTimeout(() => {
		showNotification.value = false;
	}, 2000);
};

const handleCloseModal = () => {
	emit('closeModal');
};
</script>
