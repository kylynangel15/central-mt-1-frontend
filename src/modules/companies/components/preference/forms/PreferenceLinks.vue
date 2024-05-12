<template>
	<div class="col-span-6 sm:col-span-6">
		<label
			for="linked_in"
			class="block text-sm font-medium text-untitled-gray-700">
			LinkedIn
		</label>
		<div class="mt-1 flex rounded-md shadow-sm">
			<span
				class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-untitled-gray-500 sm:text-sm">
				https://
			</span>
			<input
				type="text"
				name="linked_in"
                v-model="preference.linkedin"
				id="linked_in"
				class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm"
				placeholder="www.linkedin.com" />
		</div>
		<ErrorSpanMessage v-if="errorValue && errorValue.linkedin">
			{{ errorValue.linkedin[0] }}
		</ErrorSpanMessage>
	</div>

	<div class="col-span-6 sm:col-span-6">
		<label
			for="facebook"
			class="block text-sm font-medium text-untitled-gray-700">
			Facebook
		</label>
		<div class="mt-1 flex rounded-md shadow-sm">
			<span
				class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-untitled-gray-500 sm:text-sm">
				https://
			</span>
			<input
				type="text"
				name="facebook"
				id="facebook"
                v-model="preference.facebook"
				class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm"
				placeholder="www.facebook.com" />
		</div>
		<ErrorSpanMessage v-if="errorValue && errorValue.facebook">
			{{ errorValue.facebook[0] }}
		</ErrorSpanMessage>
	</div>

	<div class="col-span-6 sm:col-span-6">
		<label
			for="youtube"
			class="block text-sm font-medium text-untitled-gray-700">
			Youtube
		</label>
		<div class="mt-1 flex rounded-md shadow-sm">
			<span
				class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-untitled-gray-500 sm:text-sm">
				https://
			</span>
			<input
				type="text"
				name="youtube"
				id="youtube"
                v-model="preference.youtube"
				class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm"
				placeholder="www.youtube.com" />
		</div>
		<ErrorSpanMessage v-if="errorValue && errorValue.youtube">
			{{ errorValue.youtube[0] }}
		</ErrorSpanMessage>
	</div>
</template>
<script>
// use normal <script> to declare options
export default {
    inheritAttrs: false,
    components: { ErrorSpanMessage }
};
</script>
<script setup>
import ErrorSpanMessage from '@/components/ErrorSpanMessage.vue';
import { defineProps, computed, ref } from 'vue';
const props = defineProps({
	preference: {
		type: Object,
		required: true,
	},
    errorValue: null,
    errorMessage: null,
});

const errorValue = computed(() => props.errorValue)
const errorMessage = computed(() => props.errorMessage)

const preference = computed({
	get() {
		return props.preference;
	},
	set(newValue) {
		newValue;
	},
});
</script>
