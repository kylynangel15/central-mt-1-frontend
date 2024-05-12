<template>
	<div
		class="relative w-full h-full border-untitled-gray-400"
		v-for="(privilege, privilegeIndex) in featurePrivileges"
		:key="privilege.id">
		<div v-if="privilege.childs && privilege.childs.length">
			<div class="w-full">
				<div class="w-full bg-white">
					<Disclosure v-slot="{ open }">
						<div
							class="flex w-full px-3 py-4 text-left text-sm font-medium text-untitled-gray-500"
							@mouseover="handleShowTooltip(privilege.id)"
							@mouseleave="handleHideTooltip">
							<input
								type="checkbox"
								name=""
								v-if="
									checkIfPrivilegeIsAdministrator(privilege)
								"
								v-model="privileges"
								:readonly="readOnly"
								:value="privilege.id"
								@change="changeParentPrivilege"
								class="ml-12 mr-4"
								id="" />

							<DisclosureButton class="flex w-full">
								<span
									class="text-md text-untitled-gray-500"
									:class="
										!checkIfPrivilegeIsAdministrator(
											privilege
										)
											? 'ml-12'
											: ''
									"
									>{{ privilege.action_name }}</span
								>
								<ChevronUpIcon
									:class="open ? 'rotate-180 transform' : ''"
									class="h-5 w-5 text-untitled-gray-500" />
							</DisclosureButton>
						</div>

						<div
							v-show="showTooltip && privilege.id == parentId"
							v-if="privilege.description"
							class="px-4 ml-16">
							<span class="text-xs">{{
								privilege.description
							}}</span>
						</div>
						<DisclosurePanel
							class="text-sm text-gray-500 border-t border-b border-untitled-gray-300">
							<div
								v-for="(child, childIndex) in privilege.childs">
								<div
									class="w-full relative h-full pl-24 py-4"
									@mouseover="
										handleShowChildTooltip(child.id)
									"
									@mouseleave="handleHideChildTooltip"
									v-if="
										checkIfPrivilegeIsAdministrator(child)
									">
									<h3
										class="px-6 py-1 text-md text-untitled-gray-500"
										:class="[
											!checkIfPrivilegeIsAdministrator(
												child
											)
												? 'ml-9'
												: '',
										]">
										<input
											type="checkbox"
											name=""
											v-model="privileges"
											v-if="
												checkIfPrivilegeIsAdministrator(
													child
												)
											"
											:disabled="readOnly"
											:value="child.id"
											class="mr-4"
											:class="
												!checkIfPrivilegeIsAdministrator(
													child
												)
													? 'ml-8'
													: ''
											"
											id="" />
										{{ child.action_name }}
									</h3>

									<div
										v-show="
											showChildTooltip &&
											child.id == childId
										"
										v-if="child.description"
										class="ml-16">
										<span class="text-xs">{{
											child.description
										}}</span>
									</div>
								</div>
							</div>
						</DisclosurePanel>
					</Disclosure>
				</div>
			</div>
		</div>

		<div v-else>
			<h3
				class="py-4 pl-16 flex"
				v-if="checkIfPrivilegeIsAdministrator(privilege)">
				<input
					type="checkbox"
					name=""
					v-model="privileges"
					:readonly="readOnly"
					:value="privilege.id"
					@change="changeParentPrivilege"
					class="mr-4"
					id="" />
				{{ privilege.action_name }}
			</h3>
		</div>
	</div>
</template>
<script setup>
import { defineProps, defineEmits, computed, ref, onMounted } from 'vue';
import { ChevronRightIcon } from '@heroicons/vue/24/outline';
import { ChevronUpIcon, PaperAirplaneIcon } from '@heroicons/vue/20/solid';
import { useAdminSettingStore } from '@/store/useAdminSettingStore';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
const props = defineProps({
	modelValue: {
		type: Array,
		default: () => [],
	},
	featurePrivileges: {
		type: Array,
		default: () => [],
	},
	role: {
		type: Object,
		default: () => {},
	},
	readOnly: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits([
	'update:modelValue',
	'checkedParentPrivilege',
	'uncheckParentPrivilege',
]);
const adminSettingStore = useAdminSettingStore();

const featurePrivileges = computed(() => props.featurePrivileges);
const isAdministrator = computed(() => adminSettingStore.isAdministrator);
const role = computed(() => props.role);
const privileges = computed({
	get() {
		return props.modelValue;
	},
	set(newValue) {
		emit('update:modelValue', newValue);
	},
});
const readOnly = computed(() => props.readOnly);
const showTooltip = ref(false);
const parentId = ref(null);
const childId = ref(null);
const showChildTooltip = ref(false);

const changeParentPrivilege = (event) => {
	let privilegeId = event.target.value;
	let findPrivilege = featurePrivileges.value.find(
		(privilege) => privilege.id == privilegeId
	);

	if (!event.target.checked) {
		emit('uncheckParentPrivilege', findPrivilege.childs);
		return;
	}

	if (
		findPrivilege &&
		findPrivilege.id &&
		findPrivilege.childs &&
		findPrivilege.childs.length
	) {
		emit('checkedParentPrivilege', findPrivilege.childs);
		return;
	}
};

const checkIfPrivilegeIsAdministrator = (privilege) => {
	if (
		privilege.is_superadmin &&
		privilege.childs &&
		privilege.childs.length > 0
	) {
		return false;
	}
	if (
		privilege.is_superadmin &&
		privilege.childs &&
		privilege.childs.length == 0
	) {
		return false;
	}

	return true;
};

const handleShowTooltip = (index) => {
	showTooltip.value = true;
	parentId.value = index;
};

const handleHideTooltip = () => {
	showTooltip.value = true;
	parentId.value = null;
};

const handleShowChildTooltip = (index) => {
	showChildTooltip.value = true;
	childId.value = index;
};

const handleHideChildTooltip = () => {
	showChildTooltip.value = false;
	childId.value = null;
};

const checkIfSuperAdminNoChild = (privilege) => {
	if (privilege.is_superadmin && privilege.childs.length < 0) {
		return false;
	}

	return true;
};
</script>
