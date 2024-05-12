<template>
	<Menu as="div" class="relative inline-block text-left">
		<div>
			<MenuButton
				class="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100">
				<EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
			</MenuButton>
		</div>

		<transition
			enter-active-class="transition ease-out duration-100"
			enter-from-class="transform opacity-0 scale-95"
			enter-to-class="transform opacity-100 scale-100"
			leave-active-class="transition ease-in duration-75"
			leave-from-class="transform opacity-100 scale-100"
			leave-to-class="transform opacity-0 scale-95">
			<MenuItems
				class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
				<div class="py-1">
					<MenuItem v-slot="{ active }">
						<a
							type="button"
							@click="handleClickView(scope)"
							:class="[
								active
									? 'bg-gray-100 text-gray-900'
									: 'text-gray-700',
								'group flex items-center px-4 py-2 text-sm cursor-pointer',
							]">
							<EyeIcon
								class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
								aria-hidden="true" />
							View
						</a>
					</MenuItem>
					<MenuItem v-slot="{ active }" v-company-edit>
						<a
							type="button"
							@click="handleClickEdit(scope)"
							:class="[
								active
									? 'bg-gray-100 text-gray-900'
									: 'text-gray-700',
								'group flex items-center px-4 py-2 text-sm cursor-pointer',
							]">
							<PencilSquareIcon
								class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
								aria-hidden="true" />
							Edit
						</a>
					</MenuItem>
				</div>
				<div class="py-1">
					<MenuItem v-slot="{ active }">
						<a
							type="button"
							:class="[
								active
									? 'bg-gray-100 text-gray-900'
									: 'text-gray-700',
								'group flex items-center px-4 py-2 text-sm cursor-pointer',
							]"
							@click="handleClickCustomDomain(scope)">
							<ComputerDesktopIcon
								class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
								aria-hidden="true" />
							Change subdomain
						</a>
					</MenuItem>
				</div>
				<div class="py-1">
					<MenuItem v-slot="{ active }">
						<a
							type="button"
							:class="[
								active
									? 'bg-gray-100 text-gray-900'
									: 'text-gray-700',
								'group flex items-center px-4 py-2 text-sm cursor-pointer',
							]"
							@click="handleClickGoToSite(scope)">
							<ArrowUturnRightIcon
								class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
								aria-hidden="true" />
							Go to site
						</a>
					</MenuItem>
				</div>
                <div class="py-1" v-if="fromAppPage">
                    <MenuItem v-slot="{ active }">
                        <a
                            @click="
                                handleClickRemoveFromApp(
                                    scope
                                )
                            "
                            :class="[
                                active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700',
                                'group flex items-center px-4 py-2 text-sm cursor-pointer',
                            ]">
                            <MinusCircleIcon
                                class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true" />
                            Remove From App
                        </a>
                    </MenuItem>
                </div>
				<div class="py-1" v-if="isAdministrator && scope.type != 'DEFAULT'">
					<MenuItem v-slot="{ active }">
						<a
							@click="handleClickDelete(scope)"
							:class="[
								active
									? 'bg-gray-100 text-gray-900'
									: 'text-gray-700',
								'group flex items-center px-4 py-2 text-sm cursor-pointer',
							]">
							<TrashIcon 
								class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
								aria-hidden="true" />
							Delete
						</a>
					</MenuItem>
				</div>
			</MenuItems>
		</transition>
	</Menu>
</template>
<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { useRouter } from 'vue-router';
import { defineProps, defineEmits, computed } from 'vue';
import { ArrowUturnRightIcon, ComputerDesktopIcon, EllipsisVerticalIcon, EyeIcon, MinusCircleIcon, PencilSquareIcon, PlusIcon, TrashIcon, UsersIcon } from '@heroicons/vue/24/outline';
import { useAdminSettingStore } from '@/store/useAdminSettingStore';
import { impersonateUser } from '../composables/impersonate_user';
import { SINGLE_ROOFTOP, DEFAULT } from '@/composables/default_variables/company_type';

const props = defineProps({
    scope: {
        type: Object,
        default: () => {},
        required: true,
    },
    fromAppPage: {
        type: Boolean,
        default: false,
    }
})

const emit = defineEmits(['deleteAction', 'removeFromApp'])

const router = useRouter();

const isAdmin = useAdminSettingStore()

const isAdministrator = computed(() => isAdmin.isAdministrator)

const scope = computed(() => props.scope)

const fromAppPage = computed(() => props.fromAppPage)

const handleClickView = (item) => {
	router.push({ name: 'Company Details Page', params: { id: item.id } });
};

const handleClickEdit = (item) => {
	router.push({
		name: 'Company Details Page',
		params: { id: item.id },
		query: { component: 'Account' },
	});
};


const handleClickCustomDomain = (item) => {
	router.push({
		name: 'Company Details Page',
		params: {
			id: item.id,
		},
		query: {
			tab: 'Domain Settings',
		},
	});
};

const handleClickGoToSite = async (company) => {
	const { impersonate, redirectUrl } = impersonateUser(company.central_id);

    await impersonate();
	window.open(redirectUrl.value, '_blank');
}

const handleClickDelete = (item) => {
    emit('deleteAction', item)
};

const handleClickRemoveFromApp = (item) => {
    emit('removeFromApp', item)
}
</script>
