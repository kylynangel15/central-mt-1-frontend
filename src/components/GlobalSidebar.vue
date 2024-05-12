<template>
	<div>
		<TransitionRoot as="template" :show="sidebarOpen">
			<Dialog
				as="div"
				class="relative z-40 md:hidden"
				@close="sidebarOpen = false">
				<TransitionChild
					as="template"
					enter="transition-opacity ease-linear duration-300"
					enter-from="opacity-0"
					enter-to="opacity-100"
					leave="transition-opacity ease-linear duration-300"
					leave-from="opacity-100"
					leave-to="opacity-0">
					<div class="fixed inset-0 bg-gray-600 bg-opacity-75" />
				</TransitionChild>

				<div class="fixed inset-0 z-40 flex">
					<TransitionChild
						as="template"
						enter="transition ease-in-out duration-300 transform"
						enter-from="-translate-x-full"
						enter-to="translate-x-0"
						leave="transition ease-in-out duration-300 transform"
						leave-from="translate-x-0"
						leave-to="-translate-x-full">
						<DialogPanel
							class="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
							<TransitionChild
								as="template"
								enter="ease-in-out duration-300"
								enter-from="opacity-0"
								enter-to="opacity-100"
								leave="ease-in-out duration-300"
								leave-from="opacity-100"
								leave-to="opacity-0">
								<div class="absolute top-0 right-0 -mr-12 pt-2">
									<button
										type="button"
										class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
										@click="sidebarOpen = false">
										<span class="sr-only"
											>Close sidebar</span
										>
										<XMarkIcon
											class="h-6 w-6 text-white"
											aria-hidden="true" />
									</button>
								</div>
							</TransitionChild>
							<div
								class="flex flex-shrink-0 mx-auto items-center px-4">
								<img
									class="h-12 w-auto mx-auto"
									src="https://revdojo.com/wp-content/uploads/2022/04/logo.png"
									alt="Your Company" />
							</div>
							<div class="mt-5 h-0 flex-1 overflow-y-auto">
								<nav class="space-y-1 px-2">
									<router-link
										v-for="item in navigation"
										:key="item.name"
										:to="{ name: item.href }"
										:class="[
											item.current
												? 'bg-gray-100 text-gray-900'
												: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
											'group flex items-center px-2 py-2 text-base font-medium rounded-md',
										]">
										<component
											:is="item.icon"
											:class="[
												item.current
													? 'text-gray-500'
													: 'text-gray-400 group-hover:text-gray-500',
												'mr-4 flex-shrink-0 h-6 w-6',
											]"
											aria-hidden="true" />
										{{ item.name }}
									</router-link>
								</nav>
							</div>
							<div
								class="flex flex-shrink-0 border-t border-gray-200 p-4">
								<a
									href="#"
									class="group block w-full flex-shrink-0">
									<div class="flex items-center">
										<div>
											<img
												class="inline-block h-9 w-9 rounded-full"
												src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
												alt="" />
										</div>
										<div class="ml-3 w-full">
											<ArrowRightOnRectangleIcon
												@click="handleClickLogout"
												class="float-right flex-shrink-0 h-6 w-6" />
											<div class="overflow-hidden">
												<p
													class="text-sm font-medium text-gray-700 group-hover:text-gray-900">
													{{ userProfile.name }}
												</p>
												<p
													class="text-xs font-medium text-gray-500 group-hover:text-gray-700">
													{{ userProfile.email }}
												</p>
											</div>
										</div>
									</div>
								</a>
							</div>
						</DialogPanel>
					</TransitionChild>
					<div class="w-14 flex-shrink-0" aria-hidden="true">
						<!-- Dummy element to force sidebar to shrink to fit close icon -->
					</div>
				</div>
			</Dialog>
		</TransitionRoot>

		<!-- Static sidebar for desktop -->
		<div class="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
			<!-- Sidebar component, swap this element with another sidebar if you like -->
			<div
				class="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
				<div class="flex flex-shrink-0 items-center px-4">
					<img
						class="h-12 w-auto mx-auto"
						:src="
							preference && preference.id && preference.logo_photo
								? preference.logo_photo
								: 'https://webinarinc-central.s3.us-west-1.amazonaws.com/public/company_logo/revdojo_logo.png'
						"
						alt="RevDojo" />
				</div>
				<div class="mt-5 flex flex-grow flex-col">
					<nav class="flex-1 space-y-1 px-2 pb-4">
						<router-link
							exact-active-class="bg-gray-100 text-gray-900 hover:text-gray-900"
							v-for="item in navigation"
							:key="item.name"
							:to="{ name: item.href }"
							:class="[
								item.current
									? ''
									: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
								'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
							]">
							<component
								:is="item.icon"
								:class="[
									item.current
										? 'text-gray-500'
										: 'text-gray-400 group-hover:text-gray-500',
									'mr-3 flex-shrink-0 h-6 w-6',
								]"
								aria-hidden="true" />
							{{ item.name }}
						</router-link>
					</nav>
				</div>
				<div class="flex flex-shrink-0 border-t border-gray-200 p-4">
					<a href="#" class="group block w-full flex-shrink-0">
						<div class="flex items-center">
							<div>
								<img
									v-if="userProfile.profile_photo"
									class="inline-block h-9 w-9 rounded-full"
									:src="userProfile.profile_photo"
									alt="" />
								<UserCircleIcon
									v-else
									class="inline-block text-untitled-gray-500 h-9 w-9 rounded-full" />
							</div>
							<div class="ml-3 w-full">
								<ArrowRightOnRectangleIcon
									@click="handleClickLogout"
									class="float-right flex-shrink-0 h-6 w-6" />
								<div class="overflow-hidden">
									<p
										class="text-sm font-medium text-gray-700 group-hover:text-gray-900">
										{{ userProfile.name }}
									</p>
									<p
										class="text-xs font-medium text-gray-500 group-hover:text-gray-700">
										{{ userProfile.email }}
									</p>
								</div>
							</div>
						</div>
					</a>
				</div>
			</div>
		</div>
		<div class="flex flex-1 flex-col md:pl-64">
			<div
				class="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow-md">
				<button
					type="button"
					class="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
					@click="sidebarOpen = true">
					<span class="sr-only">Open sidebar</span>
					<Bars3BottomLeftIcon class="h-6 w-6" aria-hidden="true" />
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import {
	Dialog,
	DialogPanel,
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
	TransitionChild,
	TransitionRoot,
} from '@headlessui/vue';
import {
	Bars3BottomLeftIcon,
	DevicePhoneMobileIcon,
	HomeIcon,
	BuildingOfficeIcon,
	BuildingOffice2Icon,
	LinkIcon,
	XMarkIcon,
	ArrowRightOnRectangleIcon,
	PaperClipIcon,
	BuildingLibraryIcon,
	UserCircleIcon,
	UsersIcon,
} from '@heroicons/vue/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid';
import { logoutUser } from '@/composables/authentication';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/modules/companies/store/user/useUserStore';
import { useAdminSettingStore } from '@/store/useAdminSettingStore';

const navigation = [
	{
		name: 'Dashboard',
		href: 'Dashboard Home Page',
		icon: HomeIcon,
		current: false,
	},
	// { name: 'Product Management', href: 'Product Home Page', icon: CubeTransparentIcon, current: false },
	{
		name: 'Companies',
		href: 'Company Home Page',
		icon: BuildingOfficeIcon,
		current: false,
	},
	{
		name: 'Apps',
		href: 'App Home Page',
		icon: DevicePhoneMobileIcon,
		current: false,
	},
	// { name: 'Logs', href: 'Logs Home Page', icon: InboxIcon, current: false },
	{
		name: 'Roles / Privileges',
		href: 'Roles Home Page',
		icon: LinkIcon,
		current: false,
	},
	{
		name: 'Users',
		href: 'User Home Page',
		icon: UsersIcon,
		current: false,
	},
	{
		name: 'Stores',
		href: 'Store Home Page',
		icon: BuildingOffice2Icon,
		current: false,
	},
	{
		name: 'Preference',
		href: 'Preference Home Page',
		icon: BuildingLibraryIcon,
		current: false,
	},
];
const userNavigation = [
	{ name: 'Your Profile', href: '#' },
	{ name: 'Settings', href: '#' },
	{ name: 'Sign out', href: '#' },
];

const adminStore = useUserStore();

const userStore = useUserStore();
const router = useRouter();
const admin = computed(() => adminStore.user);
const preference = computed({
	get() {
		if (admin.value && admin.value.id) {
			if (
				admin.value.company.preference &&
				admin.value.company.preference.id
			) {
				return (preference.value = admin.value.company.preference);
			}

			if (!admin.value.company.preference) {
				return (preference.value =
					admin.value.company.company_preference);
			}
		}

		return {};
	},
	set(newValue) {
		newValue;
	},
});

const userProfile = computed({
	get() {
		if (userStore.user) {
			return userStore.user;
		}

		return { email: null, name: null };
	},
	set(newValue) {
		newValue;
	},
});

const sidebarOpen = ref(false);

const handleClickLogout = async () => {
	await logoutUser();
	router.push('/login');
};

onMounted(() => {});
</script>
