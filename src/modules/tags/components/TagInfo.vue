<template>
	<div class="mt-10 ">
		<div class="md:grid md:grid-cols-3 md:gap-6">
			<div class="md:col-span-1">
				<div class="px-4 sm:px-0">
					<h3
						class="text-lg font-medium leading-6 text-untitled-gray-900">
						Tag Information
					</h3>
					<p class="mt-1 text-sm text-untitled-gray-600">
						Lorem, ipsum dolor sit amet consectetur adipisicing
						elit. Officia error omnis nam quisquam quam dolore
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
										class="block text-sm font-medium text-untitled-gray-700">
										Name
									</label>
									<input
										type="text"
										name="first-name"
										id="first-name"
										readonly
										v-model="tag.name"
										autocomplete="given-name"
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
								</div>
								<div class="col-span-6 sm:col-span-6">
									<SelectCompanies
										v-model="tag.company"
										:is-read-only="true"
										:is-disabled="true"/>
								</div>
								<div class="col-span-6">
									<label
										for="street-address"
										class="block text-sm font-medium text-untitled-gray-700">
										Description
									</label>
									<textarea
										rows="4"
										readonly
										name="street-address"
										v-model="tag.description"
										id="street-address"
										autocomplete="street-address"
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
								</div>
							</div>
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
</template>
<script>
// use normal <script> to declare options
export default {
    inheritAttrs: false,
    components: { SelectCompanies }
};
</script>
<script setup>
import SelectCompanies from '@/modules/companies/utilities/SelectCompanies.vue';
import { defineProps, computed } from 'vue';

const props = defineProps({
    tagProfile: {
        type: Object,
        required: true
    }
})

const tag = computed(() => props.tagProfile)
</script>