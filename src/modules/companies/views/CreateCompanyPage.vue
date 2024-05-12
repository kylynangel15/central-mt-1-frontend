<template>
    <GlobalBreadCrumbs :pages="pages"/>
    <div class="py-6">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <h1 class="text-2xl font-semibold text-gray-900">Companies <span class="text-lg font-thin">Create</span></h1>
        </div>
      
        <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div class="py-4">
                <div class="relative mt-1 py-4 rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer" @click="backToHomePage">
                        <ArrowLeftIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true"/> 
                    </div>
                    <label class="p-10 text-untitled-gray-500">Companies</label>  
                </div>
                <div class="mt-4 grid text-untitled-gray-500 grid-cols-12 gap-5">
                    <div class="w-full col-span-5 ">
                        <label class="font-bold">Create a New Company</label>
                        <p>Please fill out the required fields.</p>
                    </div>
                    <companyFormVue :isUpdate='false' @backToHome="backToHomePage"/>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script setup>
import companyFormVue from '../components/companyForm.vue';
import { ArrowLeftIcon } from '@heroicons/vue/20/solid';
import { useRouter } from 'vue-router';
import GlobalBreadCrumbs from '@/components/GlobalBreadCrumbs.vue';
import { computed } from 'vue'

const router = useRouter();


const pages = computed({
    get() {
        return [
            {
                name: 'Companies',
                to: {
                    name: 'Company Home Page',
                },
                current: false
            },
            {
                name: 'Create',
                to: {
                    name: 'Create Company Page',
                },
                current: false
            },
        ]
    },
    set(newValue) {
        newValue
    }
})

const backToHomePage = () => {
    router.push({path: '/companies'})
}

</script>