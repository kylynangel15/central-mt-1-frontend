<template>
	<div class="col-span-6">
		<label
			for="phone_number"
			class="block text-sm font-medium text-untitled-gray-700">
			Logo
		</label>
		<ProfileUploader
			v-if="!hasLogo"
			@file="handleCompanyLogo"
			:label="'Drop your logo or click to browse your computer'"
			@removeFile="handleRemoveCompanyLogo" />
		<div
			v-else
			class="mt-1 flex aspect-w-96 max-h-80 mx-auto rounded-md px-6 pt-5 pb-6">
			<img
				class="object-cover w-96 mx-auto"
				:src="
					preference.logo_photo
						? preference.logo_photo
						: preference.default_logo_photo
				"
				alt="" />
		</div>
		<div class="aspect-w-96 mx-auto text-center" v-if="hasLogo">
			<button
				@click="handleClickChangeLogo"
				class="inline-flex justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
				Change Logo
			</button>
		</div>
	</div>
	<div class="col-span-6">
		<label
			for="phone_number"
			class="block text-sm font-medium text-untitled-gray-700">
			Favicon
		</label>
		<ProfileUploader
			v-if="!hasFavicon"
			@file="handleFavicon"
			:label="'Drop your favicon or click to browse your computer'"
			@removeFile="handleRemoveFavicon" />
		<div
			v-else
			class="mt-1 flex aspect-w-96 max-h-80 mx-auto rounded-md px-6 pt-5 pb-6">
			<img
				class="object-cover w-96 mx-auto"
				:src="preference.favicon_photo ? preference.favicon_photo : preference.default_favicon_photo"
				alt="" />
		</div>
		<div class="aspect-w-96 mx-auto text-center" v-if="hasFavicon">
			<button
				@click="handleClickChangeFavicon"
				class="inline-flex justify-center rounded-md border border-transparent bg-untitled-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-700 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
				Change Favicon
			</button>
		</div>
	</div>
</template>
<script>
// use normal <script> to declare options
export default {
	inheritAttrs: false,
};
</script>
<script setup>
import ProfileUploader from '@/components/uploader/ProfileUploader.vue';
import { defineProps, computed, ref, onMounted } from 'vue';
const props = defineProps({
	preference: {
		type: Object,
		required: true,
	},
	errorValue: null,
	errorMessage: null
});

const preference = computed({
	get() {
		return props.preference;
	},
	set(newValue) {
		newValue;
	},
});


const hasLogo = ref(false);
const hasFavicon = ref(false);

const handleCompanyLogo = (file) => {
	preference.value.logo_photo = file[0];
};

const handleRemoveCompanyLogo = () => {
	preference.value.logo_photo = null;
};

const handleFavicon = (file) => {
	preference.value.favicon_photo = file[0];
};

const handleRemoveFavicon = () => {
	preference.value.favicon_photo = null;
};

const handleClickChangeLogo = () => {
	hasLogo.value = false;
};

const handleClickChangeFavicon = () => {
	hasFavicon.value = false;
};

onMounted(() => {
	if (preference.value.favicon_photo) {
		hasFavicon.value = true;
	}

	if (!preference.value.logo_photo && preference.value.default_logo_photo) {
		hasLogo.value = true;
	}

	if (!preference.value.favicon_photo && preference.value.default_favicon_photo) {
		hasFavicon.value = true;
	}

	if (preference.value.logo_photo) {
		hasLogo.value = true;
	}
});
</script>
