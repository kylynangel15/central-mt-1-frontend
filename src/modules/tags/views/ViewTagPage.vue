<template>
	<GlobalBreadCrumbs :pages="pages" />
	<PageLoader v-if="loadingTag" />
	<div class="py-6" v-else>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
			<h1 class="text-2xl font-semibold text-untitled-gray-700">
				Tags
				<span class="text-lg font-thin">Details</span>
			</h1>
			<div class="relative mt-1 py-4 rounded-md">
				<button
					type="button"
					v-if="tagId"
					:disabled="loadingTag"
					@click="handleClickEdit"
					class="inline-flex pb-1 float-right justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
					Edit
				</button>
				<router-link
					class="absolute text-untitled-gray-500 inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
					:to="{ name: 'Roles Home Page' }">
					<ArrowLeftIcon
						class="-ml-1 mr-2 h-5 w-5"
						aria-hidden="true" />
				</router-link>
				<label class="p-10 text-sm text-untitled-gray-500">Back</label>
			</div>
		</div>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">

			<div>
				<div class="sm:hidden">
					<label for="tabs" class="sr-only">Select a tab</label>
					<!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
					<select
						id="tabs"
						name="tabs"
						class="block w-full rounded-md border-gray-300 focus:border-untitled-gray-500 focus:ring-untitled-gray-500">
						<option
							v-for="tab in tabs"
							:key="tab.name"
							:selected="tab.current">
							{{ tab.name }}
						</option>
					</select>
				</div>
				<div class="hidden sm:block">
					<div class="border-b border-gray-200">
						<nav class="-mb-px flex space-x-8" aria-label="Tabs">
							<span
								v-for="tab in tabs"
								:key="tab.name"
								@click="handleClickTab(tab)"
								:class="[
									tab.current
										? 'border-untitled-gray-500 text-untitled-gray-600'
										: 'border-transparent text-untitled-gray-500 hover:text-untitled-gray-700 hover:border-gray-300',
									'group inline-flex cursor-pointer items-center py-4 px-1 border-b-2 font-medium text-sm',
								]"
								:aria-current="
									tab.current ? 'page' : undefined
								">
								<component
									:is="tab.icon"
									:class="[
										tab.current
											? 'text-untitled-gray-500'
											: 'text-untitled-gray-400 group-hover:text-untitled-gray-500',
										'-ml-0.5 mr-2 h-5 w-5',
									]"
									aria-hidden="true" />
								<span>{{ tab.name }}</span>
							</span>
						</nav>
					</div>
				</div>
			</div>

			<component :is="componentList[tabs.find(tab => tab.current == true).componentName]" 
            :tag-id="parseInt(tagId)"
			:company-id="parseInt(tag.company_id)"
            :tag-profile="tag"/>
		</div>
	</div>
</template>
<script setup>
import GlobalBreadCrumbs from '@/components/GlobalBreadCrumbs.vue';
import PageLoader from '@/components/loader/PageLoader.vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { defineProps, ref, computed, onMounted, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { getTag } from '../composables/get_tag';
import TagsUsersList from '../components/TagUsersList.vue';
import TagCourseList from '../components/TagCourseList.vue';
import { BookOpenIcon, UserGroupIcon, PaperClipIcon } from '@heroicons/vue/20/solid'
const props = defineProps({
	id: null,
});

const router = useRouter();

const tagId = computed(() => props.id);

const loadingTag = ref(false);
const pages = [
	{
		name: 'Tags',
		to: {
			name: 'Tags Home Page',
		},
		current: false,
	},
	{
		name: 'Details',
		to: {
			name: 'View Tag Page',
			params: {
				id: tagId.value,
			},
		},
		current: true,
	},
];
const tag = ref({});

const componentList = {
	usersComponent: defineAsyncComponent(() => import('../components/TagUsersList.vue')),
	coursesComponent: defineAsyncComponent(() => import('../components/TagCourseList.vue')),
	tagInfo: defineAsyncComponent(() => import('../components/TagInfo.vue')),
}

const getTagById = async () => {
	loadingTag.value = true;
	const { load, data } = getTag(tagId.value);
	await load();
	tag.value = data.value;
	loadingTag.value = false;
};

const handleClickEdit = () => {
	router.push({ name: 'Edit Tag Page', params: { id: tagId.value } });
};

const tabs = ref([
  { name: 'Info', href: '#', icon: PaperClipIcon, current: true, componentName: 'tagInfo' },
  { name: 'Users', href: '#', icon: UserGroupIcon, current: false, componentName: 'usersComponent' },
  { name: 'Courses', href: '#', icon: BookOpenIcon, current: false, componentName: 'coursesComponent' },
])

const handleClickTab = (item) => {
	tabs.value = tabs.value.map(tab => {
		if(tab.name == item.name) {
			tab.current = true
		}
		else {
			tab.current = false
		}

		return tab
	})
}

onMounted(async () => {
	await getTagById();
});
</script>
