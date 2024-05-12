<template>
	<div class="w-full items-center">
		<div class="xs:w-full sm:w-3/4 h-full mx-auto mt-2">
			<div class="flex relative">
				<img
					v-if="preference.logo_photo"
					ref="image"
					alt="company logo"
					:class="['w-20 object-cover']" />
				<span v-else class="text-xs text-untitled-gray-500"
					>--- Your logo ---</span
				>
				<span
					class="text-xs absolute inline-block align-middle text-untitled-gray-500 right-0 mt-5"
					>For car people, by car people.</span
				>
			</div>
			<div class="bg-white w-full mt-5 p-4">
				<div class="bg-untitled-gray-100 p-3 w-36" />

				<div class="bg-untitled-gray-100 mt-2 p-3 w-full" />
				<div class="bg-untitled-gray-100 mt-2 p-3 w-full" />

				<br />

				<div class="bg-untitled-gray-100 mt-2 p-3 w-80" />
				<div class="bg-untitled-gray-100 mt-2 p-3 w-96" />

				<br />

				<div class="bg-untitled-gray-100 p-3 w-28" />
				<span class="text-xs text-untitled-gray-500">{{
					preference.signature_name
						? preference.signature_name
						: '--- Signature name ---'
				}}</span>
			</div>
			<div class="bg-white w-full mt-5 p-4">
				<div class="w-full items-center text-center">
					<img
						v-if="preference.logo_photo"
						ref="footer_logo"
						alt="company logo"
						:class="['w-20 mx-auto object-cover']" />
					<p v-else class="text-xs mx-auto text-untitled-gray-500">
						--- Your logo ---
					</p>
					<p class="text-xs mx-auto mt-3 text-untitled-gray-500">
						{{
							preference.address
								? preference.address
								: '--- Address ---'
						}}
					</p>
					<p class="text-xs mx-auto mt-3 text-untitled-gray-500">
						www.revdojo.com
					</p>
					<p class="text-xs mx-auto mt-3 text-untitled-gray-500">
						{{
							preference.technical_email
								? preference.technical_email
								: '--- Technical email ---'
						}}
					</p>
					<div class="flex text-center items-center">
						<div class="w-20 mt-2 mx-auto flex gap-2">
							<a
								:href="preference.facebook"
								v-if="preference.facebook"
								target="_blank"
								style="text-decoration: none">
								<img
									src="https://cdn-icons-png.flaticon.com/128/1077/1077041.png"
									alt="IMG"
									border="0"
									class="w-5" />
							</a>
							<a
								:href="preference.linkedin"
								v-if="preference.linkedin"
								target="_blank"
								style="text-decoration: none">
								<img
									src="https://cdn-icons-png.flaticon.com/128/1236/1236849.png"
									alt="IMG"
									border="0"
									class="w-5" />
							</a>
							<a
								:href="preference.youtube"
								v-if="preference.youtube"
								target="_blank"
								style="text-decoration: none">
								<img
									src="https://cdn-icons-png.flaticon.com/128/1077/1077046.png"
									alt="IMG"
									border="0"
									class="w-5" />
							</a>
						</div>
					</div>
				</div>
			</div>
			<div class="w-full mt-1 p-4 text-center">
				<div
					v-if="preference.footer"
					class="text-xs text-untitled-gray-500"
					v-html="preference.footer"></div>
				<p v-else class="text-xs text-untitled-gray-500">
					--- footer ---
				</p>
				<p class="text-xs text-untitled-gray-500">
					©
					{{
						preference.signature_name
							? preference.signature_name
							: '--- signature name ---'
					}}
					- All rights reserved
				</p>
			</div>
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
import { defineProps, computed, watch, ref, onMounted } from 'vue';
const props = defineProps({
	preference: {
		type: Object,
		required: true,
	},
});

const preference = computed(() => props.preference);
const image = ref(null);
const footer_logo = ref(null);

onMounted(() => {
    if(typeof preference.value.logo_photo == 'string') {
        image.value.src = preference.value.logo_photo;
    }

    if(typeof preference.value.logo_photo == 'string') {
        footer_logo.value.src = preference.value.logo_photo;
    }
})

watch(preference.value, (val) => {
	if (val.logo_photo && typeof val.logo_photo != null && typeof val.logo_photo != 'string') {
		const reader = new FileReader();
		reader.addEventListener('load', () => {
			image.value.src = reader.result;
			footer_logo.value.src = reader.result;
		});

		reader.readAsDataURL(val.logo_photo);
	}
    else {
        image.value = val.logo_photo;
    }
});
</script>
