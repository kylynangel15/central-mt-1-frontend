
<script setup>
import vueFilePond from 'vue-filepond';

// Import plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.esm.js';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js';
import FilePondPlugFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileEncode from "filepond-plugin-file-encode"
// Import styles
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import { ref, defineEmits, defineProps, computed } from 'vue';

const props = defineProps({
    label: {
        type: String,
        default: 'Drop your image file here or click to browse your computer...'
    }
    
})

const emit = defineEmits(['file','removeFile'])

// Create FilePond component
const FilePond = vueFilePond(
    FilePondPluginFileValidateType, 
    FilePondPlugFileValidateSize,
    FilePondPluginFileEncode,
    FilePondPluginImagePreview);

const pond = ref()

const label = computed(() => props.label)

const handleFilePondInit = () => {
    
}

const handleFilePondRemoveFile = (file) => {
    emit('removeFile')
}

const handleFilePondUpdateFiles = (files) => {
    
    let file = files.map(files => files.file);
    emit('file', file)
}

</script>
<template>
    <div class="w-full">
        <file-pond
            name="file"
            ref="pond"
            class-name="cursor-pointer text-sm"
            :label-idle="label"
            allow-multiple="true"
            accepted-file-types="image/jpeg, image/png"
            v-on:init="handleFilePondInit"
            v-on:removefile="handleFilePondRemoveFile"
            v-on:updatefiles="handleFilePondUpdateFiles"
            instant-upload="false"
            allowFileTypeValidation="true"
            allowFileSizeValidation="true"
            allowProcess="false"
            fileValidateTypeDetectType="true"
            credits="false"
        />
    </div>
</template>