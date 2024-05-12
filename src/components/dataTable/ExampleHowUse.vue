<template>
    <div>
        <data-table :items="items" :columns="columns" :action="true" :actions="actions" :loading="loading" :error="false"
            :is-paginate="true" :pagination-options="paginationOptions" @showMorePage="handleClickShowMore"
            @sort="handleSortColumnValue" @clickValue="handelClickColumnValue" @pageChanged="handleChangePage">
            <template #sample_slot="{ scope, index }">
                <div class="flex text-red-600">
                    <BookOpenIcon class="w-4" /> {{ scope.title }} {{ index }}
                </div>
            </template>
        
            <template #object="{ scope }">
                {{ scope.object }} hello
            </template>
        
            <template #delete="{ scope, index, label }">
                <button @click="handleClickDelete(scope, index)" class="flex text-red-600">
                    <TrashIcon class="w-4" /> <span>{{ label }}</span>
                </button>
            </template>
        
            <template #edit="{ scope, label }">
                <button @click="handleClickEdit(scope)" class="flex text-green-600">
                    <PencilSquareIcon class="w-4" /> <span>{{ label }}</span>
                </button>
            </template>
        </data-table>
    </div>
</template>

<script setup>

import { TrashIcon } from '@heroicons/vue/20/solid';
import { BookOpenIcon } from '@heroicons/vue/24/outline';
import { PencilSquareIcon } from '@heroicons/vue/24/outline';
import { ref, watch } from 'vue';

const paginationOptions = ref({
    totalPages: 8,
    total: 0,
    currentPage: 1,
    perPage: 10,
    hasMorePages: true,
})

const errorList = false;

const loading = ref(false);
const items = ref([
    {
        name: 'Lindsay Walton',
        title: 'Front-end Developer',
        email: 'lindsay.walton@example.com',
        role: 'Member',
        company: {
            name: 'WebinarInc',
            year: 2022
        },
        age: 30,
        object: 'hello',
        roles: [
            { name: 'role1' },
            { name: 'role2' },
        ]
    },
    {
        name: 'Rhejie Aranez',
        title: 'Back-end Developer',
        email: 'aranez.walton@example.com',
        role: 'Member',
        company: {
            name: 'RevDojo',
            year: 2018
        },
        age: 25,
        object: 'hi',
        roles: [
            { name: 'role1' },
            { name: 'role2' },
        ]
    },
])

const columns = [
    { prop: 'name', label: 'Name', slot_name: 'name', sortable: true, clickable: false, class: '' },
    { prop: 'title', label: 'Title', slot_name: 'sample_slot', sortable: false, clickable: false, class: '' },
    { prop: 'email', label: 'Email', slot_name: 'email', sortable: true, clickable: true, class: '' },
    { prop: 'company.name', label: 'Company', slot_name: 'company', sortable: true, clickable: false, class: '' },
    { prop: 'company.year', label: 'Year', slot_name: 'year', sortable: false, clickable: false, class: '' },
    { prop: 'object', label: 'Object', slot_name: 'object', sortable: true, clickable: false, class: '' },
    { prop: 'age', label: 'Age', slot_name: 'age', sortable: true, clickable: false, class: '' },
    { prop: 'roles.1.name', label: 'Roles', slot_name: 'roles', sortable: false, clickable: false, class: '' },
]

const actions = ['Edit', 'Delete']

const handelClickColumnValue = (value) => {
    console.log(value, 'click column value')
}

const handleChangePage = (value) => {
    paginationOptions.value.perPage = parseInt(value)
}

const handleSortColumnValue = (value) => {
    console.log(value, 'click sorting')
}

const handleClickShowMore = (page) => {
    paginationOptions.value.currentPage = page
}

const handleClickDelete = (item, index) => {
    console.log(item, 'delete', `index:`, index);
}

const handleClickEdit = (item) => {
    console.log(item, 'edit')
}

watch(paginationOptions.value, () => {
    loading.value = true
    setTimeout(() => {
        loading.value = false
    }, 2000)
})
</script>