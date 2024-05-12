<template>
	<GlobalBreadCrumbs :pages="pages" />
	<PageLoader v-if="loadingTag" />
	<div class="py-6" v-else>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<h1 class="text-2xl font-semibold text-untitled-gray-700">
				Tags
				<span class="text-lg font-thin">{{
					tagId ? 'Edit' : 'Create'
				}}</span>
			</h1>
			<div class="relative mt-1 py-4 rounded-md">
				<button
					type="button"
					v-if="tagId"
					:disabled="loadingTag"
					@click="handleClickPreview"
					class="inline-flex pb-1 float-right justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
					Preview
				</button>
				<router-link
					class="absolute text-untitled-gray-500 inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
					:to="{ name: 'Tags Home Page' }">
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
								Tag Information
							</h3>
							<p class="mt-1 text-sm text-gray-600">
								Lorem, ipsum dolor sit amet consectetur
								adipisicing elit. Officia error omnis nam
								quisquam quam dolore
							</p>
						</div>
					</div>
					<div class="mt-5 md:col-span-2 md:mt-0">
						<form action="#" method="POST">
							<div class="overflow-hidden shadow sm:rounded-md">
								<div class="bg-white px-4 py-5 sm:p-6">
									<div class="grid grid-cols-6 gap-6">
										<div class="col-span-6 sm:col-span-6">
											<label
												for="first-name"
												class="block text-sm font-medium text-gray-700">
												Name <RequiredSpan />
											</label>
											<input
												type="text"
												name="first-name"
												id="first-name"
												v-model="tag.name"
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
											:class="['col-span-6', tag.company && tag.company.id && !tagId ? 'sm:col-span-3' : 'sm:col-span-6']">
											<SelectCompanies
												v-model="tag.company"
												:is-required="true"
												:is-disabled="isHasUsersAndCourses"
												@clearCompany="
													handleClearCompany
												" />

											<span class="text-xs text-untitled-gray-400" v-if="tagId && isHasUsersAndCourses">This tag has users/courses attached. Unable to change company.</span>
											<ErrorSpanMessage
												v-if="
													errorValue &&
													errorValue.company_id
												">
												{{ errorValue.company_id[0] }}
											</ErrorSpanMessage>
										</div>

										<div
											class="col-span-6 sm:col-span-3"
											v-if="!tagId && tag.company && tag.company.id">
											<SelectUsers
												v-model="tag.users"
												v-if="tag.company && tag.company.id"
												:company-id="tag.company.id"
												@clearUsers="
													handleClearUsers
												" />
										</div>

										<div
											class="col-span-6 sm:col-span-6"
											v-if="!tagId && tag.company && tag.company.id">
											<SelectCourses
												v-model="tag.courses"
												v-if="tag.company && tag.company.id"
												:company-id="tag.company.id"
												@clearCourses="
													handleClearCourses
												" />
										</div>
										<div class="col-span-6">
											<label
												for="street-address"
												class="block text-sm font-medium text-gray-700">
												Description
											</label>
											<textarea
												rows="4"
												name="street-address"
												v-model="tag.description"
												id="street-address"
												autocomplete="street-address"
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
										</div>
									</div>
								</div>
								<div
									class="bg-gray-50 px-4 py-3 text-right sm:px-6">
									<router-link
										:to="{
											name: 'Tags Home Page',
										}"
										class="inline-flex justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-untitled-gray-500 shadow-lg mr-2 hover:bg-untitled-gray-100 focus:outline-none focus:ring-2 focus:ring-untitled-gray-400 focus:ring-offset-2">
										Cancel
									</router-link>
									<button
										@click="handleClickSave"
										type="button"
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

	<global-popup-notification
		v-if="showNotif"
		:show-notification="showNotif"
		:message="messageNotif" />
</template>
<script setup>
import ErrorSpanMessage from '@/components/ErrorSpanMessage.vue';
import GlobalBreadCrumbs from '@/components/GlobalBreadCrumbs.vue';
import PageLoader from '@/components/loader/PageLoader.vue';
import RequiredSpan from '@/components/RequiredSpan.vue';
import SelectUsers from '@/modules/companies/components/User/utilities/SelectUsers.vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { defineProps, ref, computed, onMounted, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeTag } from '../composables/store_tags';
import { updateTag } from '../composables/update_tags';
import { getTag } from '../composables/get_tag';
import SelectCourses from '../utilities/SelectCourses.vue';
import SelectCompanies from '@/modules/companies/utilities/SelectCompanies.vue';

const props = defineProps({
	id: null,
});

const router = useRouter();

const tagId = computed(() => props.id);

const loadingTag = ref(false);
const pages = ref([
	{
		name: 'Tags',
		to: {
			name: 'Tags Home Page',
		},
		current: false,
	},
	{
		name: tagId.value ? 'Edit' : 'Create',
		to: {
			name: tagId.value ? 'Edit Tag Page' : 'Create Tag Page',
			params: {
				id: tagId.value ? tagId.value : null,
			},
		},
		current: true,
	},
]);

const tag = ref({
	name: '',
	users: [],
	description: '',
	courses: [],
	company_id: null,
	company: {}
});

const errorValue = ref(null);
const errorMessage = ref(null);
const company = ref({});

const messageNotif = ref(null);
const showNotif = ref(false);

const isHasUsersAndCourses = computed({
	get() {
		if(!tagId.value) {
			return false
		}

		if(tag.value.users.length > 0) {
			return true
		}

		if(tag.value.courses.length > 0) {
			return true
		}

		return false
	},
	set(newValue) {
		newValue
	}
})

const handleClickPreview = () => {
	router.push({ name: 'View Tag Page', params: { id: tagId.value } });
};

const handleClearUsers = () => {
	tag.value.users = [];
};

const handleClearCompany = () => {
	company.value = {};
};

const handleClearCourses = () => {
	tag.value.courses = [];
};

const handleClickSave = () => {
	if (tagId.value) {
		editTag();
		return;
	}

	createTag();
};

const createTag = async () => {

	tag.value.company_id = tag.value.company.id

	const { post, data, errorData, message } = storeTag(tag.value);
	await post();
	errorValue.value = errorData.value;
	errorMessage.value = message.value;
	if (!data.value) {
		return;
	}
	notification('Successfully added!');
	router.push({ name: 'Edit Tag Page', params: { id: data.value.id } });
};

const editTag = async () => {
	tag.value.company_id = tag.value.company.id
	const { update, data, errorData, message } = updateTag(tag.value);
	await update();
	errorValue.value = errorData.value;
	errorMessage.value = message.value;
	if (!data.value) {
		return;
	}

	notification('Successfully updated!');
};

const notification = (message) => {
	messageNotif.value = message;
	showNotif.value = true;
	setTimeout(() => {
		showNotif.value = false;
	}, 2000);
};

const getTagById = async () => {
	loadingTag.value = true;
	const { load, data } = getTag(tagId.value);
	await load();
	tag.value = data.value;
	loadingTag.value = false;
};

const initializeForm = () => {
	tag.value = {
		name: '',
		description: '',
		users: [],
		course: [],
	};
};

onMounted(async () => {
	if (tagId.value) {
		await getTagById();
	}
});

watch(tagId, () => {
	getTagById()
})
</script>
