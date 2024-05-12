<template>
    <div>
        <div class="mt-5">
            <div class="w-28 text-center bg-white h-8 rounded-t-lg shadow-sm border-x-2 border-t border-untitled-gray-300">
                <img
					v-if="preference.favicon_photo"
                        ref="favicon"
                        alt="company logo"
                        :class="['w-10  object-cover ml-1']" />
                <span v-else class="text-untitled-gray-400 text-xs">-- favicon --</span>
            </div>
            <div class="border-t border-untitled-gray-300 h-96">
                <div class="w-full h-12 bg-white">
                    <img
					v-if="preference.logo_photo"
                        ref="image"
                        alt="company logo"
                        :class="['w-16  object-cover ml-5']" />
                    <span v-else class="text-untitled-gray-400 text-xs ml-5">-- logo --</span>
                </div>
                <div class="flex w-full h-full">
                    <div class="w-28 bg-white h-full p-2">
                        <div class="mt-4 bg-untitled-gray-300 h-5 w-full"></div>
                        <div class="mt-2 bg-untitled-gray-300 h-5 w-full"></div>
                        <div class="mt-2 bg-untitled-gray-300 h-5 w-full"></div>
                        <div class="mt-2 bg-untitled-gray-300 h-5 w-full"></div>
                        <div class="mt-2 bg-untitled-gray-300 h-5 w-full"></div>
                    </div>
                    <div class="w-full h-80 mx-5 bg-white my-5 p-2">
                        <div class="bg-untitled-gray-300 w-24 h-5 mt-6"></div>
                        <div class="w-full h-6 bg-untitled-gray-300 mt-5"></div>
                        <div class="w-80 h-6 bg-untitled-gray-300 mt-3"></div>
                    </div>
                </div>
                <div class="w-full h-10 bg-white text-center">
                    <div class="text-center text-untitled-gray-400 text-xs p-2" v-html="preference.footer" v-if="preference.footer"></div>
                    <span v-else class="text-xs text-untitled-gray-400">--- footer ---</span>
                </div>
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
    }
})

const image = ref(null)
const favicon = ref(null)

const preference = computed(() => props.preference)

const setLogoImage = () => {
    if (preference.value.logo_photo && typeof preference.value.logo_photo != null && typeof preference.value.logo_photo != 'string') {
		const reader = new FileReader();

		reader.addEventListener('load', () => {
			image.value.src = reader.result;
		});

		reader.readAsDataURL(preference.value.logo_photo);
	}
}

const setFaviconImage = () => {
    if (preference.value.favicon_photo && typeof preference.value.favicon_photo != null && typeof preference.value.favicon_photo != 'string') {
		
        const reader = new FileReader();

		reader.addEventListener('load', () => {
			favicon.value.src = reader.result;
		});

		reader.readAsDataURL(preference.value.favicon_photo);
	}
}

onMounted(() => {
    setFaviconImage();
    setLogoImage();

    if(typeof preference.value.logo_photo == 'string') {
        image.value.src = preference.value.logo_photo;
    }

    if(typeof preference.value.favicon_photo == 'string') {
        favicon.value.src = preference.value.favicon_photo;
    }
})

watch(preference.value, (val) => {
	if (val.logo_photo && typeof val.logo_photo != null && typeof val.logo_photo != 'string') {
		const reader = new FileReader();

		reader.addEventListener('load', () => {
			image.value.src = reader.result;
		});

		reader.readAsDataURL(val.logo_photo);
	}

    if (val.favicon_photo && typeof val.favicon_photo != null && typeof val.favicon_photo != 'string') {
		const reader = new FileReader();

		reader.addEventListener('load', () => {
			favicon.value.src = reader.result;
		});

		reader.readAsDataURL(val.favicon_photo);
	}
});
</script>