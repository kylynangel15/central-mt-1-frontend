<template>
	<div class="rounded-md bg-yellow-50 p-4">
		<div class="flex">
			<div class="flex-shrink-0">
				<ExclamationTriangleIcon
					class="h-5 w-5 text-yellow-400"
					aria-hidden="true" />
			</div>
			<div class="ml-3">
				<h3 class="text-sm font-medium text-yellow-800">
					{{ title }}
				</h3>
				<div class="mt-2 text-sm text-yellow-700">
					<p>
						{{ message }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/20/solid';
import { computed } from 'vue';

const props = defineProps({
	message: {
		type: String,
		default: null,
	},
	title: {
		type: String,
		default: null,
	},
});

const title = computed(() => props.title)
const message = computed(() => props.message)
</script>
