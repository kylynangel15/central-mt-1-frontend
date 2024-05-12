<template>
    <div class="">
        <table class="w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
                <tr>
                    <THead v-for="(column, index) in columns" :key="index" :sortable="column.sortable"
                        :name="column.label" :prop="column.prop" :class="column.class" :index="index" @sort="handleClickSort">
                        <template #th-title>
                            {{ column.label }}
                        </template>
                    </THead>
                    <THead v-if="action && actions.length" :index="columns.length + 1">
                        <template #th-title>
                            {{ showActionLabel ? actionLabel : '' }}
                        </template>
                    </THead>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white overflow-y-auto" v-if="!loading && !error && items.length > 0">
                <tr v-for="(item, itemIndex) in items" :key="itemIndex" :class="[itemIndex % 2 === 0 && tableType == 'stripe' ? undefined : 'bg-untitled-gray-50 ']">
                    <TBody v-for="(column, index) in columns" :index="index" :class="column.class" :clickable="column.clickable" :clickable-column="column.label" :key="index" :value="item" @click-value="handleClickValue">
                        <template #value>
                            <slot :name="column.slot_name ? column.slot_name : `${covertLabelToSlot(column.label)}`" :scope="item" :index="itemIndex">
                                {{ checkIfObjectOrArray(item, column.prop) }}
                            </slot>
                        </template>
                    </TBody>
                    <td scope="col" v-if="action && actions.length" :index="columns.length + 1"
                        class="py-3.5 pl-4 pr-3 flex justify-center text-sm text-gray-500 sm:pl-6">
                        <template  v-for="(action) in actions">
                            <slot :scope="item" :index="itemIndex" :label="action" :name="covertLabelToSlot(action)">
                            </slot>
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
        <EmptyData v-if="!loading && !error && items.length == 0" :no-data-message="noDataMessage"/>
        <TableLoading v-if="loading && !error" :loading-message="loadingMessage" :loadingImage="loadingImage"/>
        <TableError v-if="error" :error-message="errorMessage"/>
    </div>
    <TablePagination v-if="isPaginate" :total-pages="totalPages" :total="total" :per-page="perPage"
        :current-page="currentPage" :has-more-pages="hasMorePages" @pagechanged="showMorePage" @pageSizeChange="handlePageChanged"/>
</template>
<script setup>
import { ref, defineEmits, defineProps, computed } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import THead from './Thead.vue'
import TableLoading from './TableLoading.vue'
import TBody from './Tbody.vue'
import TableError from './TableError.vue';
import TablePagination from './TablePagination.vue';
import EmptyData from './EmptyData.vue';

const props = defineProps({
    items: {
        type: Array,
        default: () => []
    },
    columns: {
        type: Array,
        default: () => []
    },
    action: {
        type: Boolean,
        default: false
    },
    actions: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    error: {
        type: Boolean,
        default: false
    },
    isPaginate: {
        type: Boolean,
        default: false
    },
    paginationOptions: {
        type: Object,
        default: () => { }
    },
    actionLabel: {
        type: String,
        default: 'Action'
    },
    loadingMessage: {
        type: String,
    },
    errorMessage: {
        type: String,
    },
    loadingImage: {
        type: String,
    },
    noDataMessage: {
        type: String,
    },
    tableType: {
        type: String,
        default: null
    },
    isSortByLive: {
        type: Boolean,
        default: false
    },
    showActionLabel: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['sort', 'clickValue', 'showMorePage', 'pageChanged'])

const action = computed(() => props.action)

const actions = computed(() => props.actions)

const items = computed(() => props.items)

const columns = computed(() => props.columns)

const loading = computed(() => props.loading)

const error = computed(() => props.error)

const isPaginate = computed(() => props.isPaginate)

const page = computed(() => props.page)

const currentPage = computed(() => props.paginationOptions.currentPage);

const totalPages = computed(() => props.paginationOptions.totalPages)

const total = computed(() => props.paginationOptions.total)

const perPage = computed(() => props.paginationOptions.perPage)

const hasMorePages = computed(() => props.paginationOptions.hasMorePages);

const actionLabel = computed(() => props.actionLabel)

const showActionLabel = computed(() => props.showActionLabel)

const loadingImage = computed(() => props.loadingImage);

const noDataMessage = computed(() => props.noDataMessage)

const tableType = computed(() => props.tableType)

const rowClass = computed(() => props.rowClass)

const isSortByLive = computed(() => props.isSortByLive)

const handleClickSort = ({ label, prop, sortBy}) => {

    if(isSortByLive.value) {
        if (prop.includes(".")) {
            emit('sort', { label, sortBy, is_nested: true })
            return;
        }
        emit('sort', { label: prop, sortBy, is_nested: false })
        return 
    }
    
    let cols = columns.value.find(column => column.label == label);
    
    items.value.sort((a, b) => {

        let objectA = checkIfObjectOrArray(a, cols.prop)
        let objectB = checkIfObjectOrArray(b, cols.prop)

        if(typeof objectA == 'string' && typeof objectB == 'string') {
            let comparison = 0;
            if (objectA.toUpperCase() > objectB.toUpperCase()) {
                comparison = 1;
            } else if (objectA.toUpperCase() < objectB.toUpperCase()) {
                comparison = -1;
            }
            return sortBy == 'desc' ? comparison : comparison * -1;
        }

        else {
            if(sortBy == 'desc') {
                return objectA - objectB;   
            }
            else {
                return objectB - objectA;
            }
        }
    })
    
}

const handleClickValue = ({item, column}) => {
    emit('clickValue', {item, column})
}

const checkIfObjectOrArray = (object, columnProp) => {

    let prop = columnProp.includes(".")

    if (!prop) {
        return object[columnProp]
    }

    return getObject(columnProp, object);
}

const covertLabelToSlot = (label) => {

    if (label.includes(" ")) {
        return label.toLowerCase();
    }
    label = label.toLowerCase();
    return label.replaceAll(" ", "_")
}

const getObject = (columnProp, object) => {
    return columnProp.split(".").reduce((r, k) => r?.[k], object)
}

const showMorePage = (page) => {
    emit('showMorePage', page)
}

const handlePageChanged = (value) => {
    emit('pageChanged', value)
}
</script>
<style></style>