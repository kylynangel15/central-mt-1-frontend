<template>
	<div v-for="(feature, featureIndex) in features" :key="feature.id">
		<div class="border border-untitled-gray-400" v-if="checkIfOneThePrivilegeIfOneAndNoChild(feature)">
			<h3 class="px-6 py-4 bg-untitled-gray-300">{{ feature.name }}</h3>
			<RolePrivilege
				v-model="role.privileges"
				:feature-privileges="feature.privileges"
				:role="role"
				:key="feature.id"
				:readOnly="readOnly"
				@checkedParentPrivilege="handleCheckedParentPrivilege"
				@uncheckParentPrivilege="handleUncheckedParentPrivilege" />
		</div>
	</div>
</template>
<script setup>
import { getFeatures } from '@/modules/app/composables/features/get_features';
import { defineProps, defineEmits, ref, computed, onMounted, watch } from 'vue';
import RolePrivilege from './RolePrivilege.vue';

const props = defineProps({
	appId: {
		type: Number,
		default: null,
	},
	role: {
		type: Object,
		default: () => {},
	},
	roleId: {
		type: Number,
		default: null,
	},
	readOnly: {
		type: Boolean,
		default: false,
	},
});

const appId = computed(() => props.appId);
const emit = defineEmits(['changePrivilege', 'setPrivileges']);

const searchFeature = ref('');
const loadingFeature = ref(false);
const hasLastPageFeatures = ref(false);
const features = ref([]);
const errorApiFeature = ref(false);
const privileges = ref([]);
const roleId = computed(() => props.roleId);
const role = computed({
	get() {
		return props.role;
	},
	set(newValue) {
		newValue;
	},
});
const readOnly = computed(() => props.readOnly);

const fetchFeatures = async () => {
	loadingFeature.value = true;
	const params = {
		page: 1,
		size: 20,
		search: searchFeature.value,
		app_id: appId.value,
	};

	const { load, totalPages, data, hasLastPage, hasError, totalFeatures } =
		getFeatures(params);

	await load();
	if (hasError.value) {
		errorApiFeature.value = true;
	}
	hasLastPageFeatures.value = hasLastPage.value;
	features.value = data.value;
	loadingFeature.value = false;
};

const handleCheckedParentPrivilege = (childPrivileges) => {
	childPrivileges.forEach((child) => {
		role.value.privileges.push(child.id);
	});
};

const handleUncheckedParentPrivilege = (childPrivileges) => {
	childPrivileges.forEach((child) => {
		let index = role.value.privileges.findIndex(
			(privilege) => privilege == child.id
		);
		role.value.privileges.splice(index, 1);
	});
};

const checkIfOneThePrivilegeIfOneAndNoChild = (feature) => {
	let findNotSuperAdminPrivilege = feature.privileges.find(privilege => !privilege.is_superadmin)
	let findSuperAdminPrivilege = feature.privileges.find(privilege => privilege.is_superadmin)
	
	if(findNotSuperAdminPrivilege && findNotSuperAdminPrivilege.id) {
		return true
	}

	if(findSuperAdminPrivilege && findSuperAdminPrivilege.childs && findSuperAdminPrivilege.childs.length) {
		return true
	}
	return false
}

onMounted(async () => {
	await fetchFeatures();

	if (roleId.value && role.value.id && role.value.privileges.length) {
		role.value.privileges = role.value.privileges.map((privilege) => {
			if (privilege && privilege.id) {
				return privilege.id;
			} else {
				return privilege;
			}
		});
	}
});

watch(privileges, (val) => {
	emit('setPrivileges', privileges.value);
});

watch(role, (val) => {
	if (val && val.id && val.privileges.length) {
		role.value.privileges = val.privileges.map((privilege) => privilege.id);
	}
});
</script>
