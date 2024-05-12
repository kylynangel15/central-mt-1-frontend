<template>
	<div class="mt-10">
		<div class="md:grid md:grid-cols-3 md:gap-6">
			<div class="md:col-span-1">
				<div class="px-4 sm:px-0">
					<h3
						class="text-lg font-medium leading-6 text-untitled-gray-600">
						App Information
					</h3>
					<p class="mt-1 text-sm text-untitled-gray-600">
						Lorem ipsum dolor, sit amet consectetur adipisicing
						elit.
					</p>
				</div>
			</div>
			<div class="mt-5 md:col-span-2 md:mt-0">
				<form>
					<div class="overflow-hidden shadow sm:rounded-md">
						<div class="bg-white px-4 py-5 sm:p-6">
							<div class="grid grid-cols-6 gap-6">
								<div class="col-span-6 sm:col-span-3">
									<label
										for="first-name"
										class="block text-sm font-medium text-untitled-gray-700"
										>Name
									</label>
									<input
										type="text"
										v-model="app.name"
										placeholder="Enter app name"
										name="first-name"
										readonly
										id="first-name"
										autocomplete="given-name"
										class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
								</div>

								<div class="col-span-6 sm:col-span-3">
									<label
										for="last-name"
										class="block text-sm font-medium text-untitled-gray-700">
										Version
									</label>
									<input
										type="text"
										placeholder="Enter app version"
										v-model="app.version"
										name="last-name"
										id="last-name"
										readonly
										autocomplete="family-name"
										class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
								</div>

								<div class="col-span-6 sm:col-span-6">
									<label
										for="email-address"
										class="block text-sm font-medium text-untitled-gray-700">
										Redirect
									</label>
									<input
										type="text"
										placeholder="Enter redirect link"
										v-model="app.redirect"
										readonly
										name="email-address"
										id="email-address"
										autocomplete="email"
										class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
								</div>

								<div
									class="col-span-6 sm:col-span-3">
									<label
										for="last-name"
										class="block text-sm font-medium text-untitled-gray-700">
										Order
									</label>
									<input
										type="number"
										placeholder="Enter app version"
										v-model="app.order"
										name="last-name"
										readonly
										id="last-name"
										autocomplete="family-name"
										class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
								</div>

								<div class="col-span-3">
									<label
										for="street-address"
										class="block text-sm font-medium text-untitled-gray-700">
										Secret
									</label>
									<input
										type="text"
										readonly
										placeholder="Enter app secret"
										v-model="app.secret"
										name="street-address"
										id="street-address"
										autocomplete="street-address"
										class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
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
										placeholder="Enter app description"
										v-model="app.description"
										name="street-address"
										id="street-address"
										autocomplete="street-address"
										class="mt-1 block w-full rounded-md border-untitled-gray-300 shadow-sm focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm" />
								</div>
							</div>
							<div class="flex flex-wrap aspect-w-full"></div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
<script>
// use normal <script> to declare options
export default {
    inheritAttrs: false
};
</script>
<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
    appProfile: {
        type: Object,
        required: true
    }
})

const app = computed(() => props.appProfile)
</script>