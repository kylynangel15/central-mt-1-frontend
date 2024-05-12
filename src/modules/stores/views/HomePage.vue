
import StoresTable from '../components/StoresTable.vue';

<template>
    <GlobalBreadCrumbs :pages="pages"/>
    <div class="py-6">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <h1 class="text-2xl font-semibold text-gray-900">Stores </h1>
        </div>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
    
            <div class="py-4">
                <div class=""> 
                    <StoresTable/>
                </div>
            </div>
    
        </div>
    </div>
</template>
<script setup>
import GlobalBreadCrumbs from '@/components/GlobalBreadCrumbs.vue';
import StoresTable from '../components/StoresTable.vue';
import { computed } from 'vue';


const pages = computed({
    get() {
        return [
            {
                name: 'Stores',
                to: {
                    name: 'Store Home Page',
                },
            },
        ]
    },
    set(newValue) {
        newValue
    }
})
</script>