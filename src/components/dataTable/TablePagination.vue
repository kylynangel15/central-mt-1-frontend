<template>
    <div class="w-full mt-2 bg-white">
        <div class="flex justify-center">
            <div class="flex">
                <select id="location" name="location" v-model="pageSize" @change="handleChangePageSize"
                    class="rounded-sm text-sm border focus:border-untitled-gray-300 focus:outline-none focus:ring-untitled-gray-300 h-9 py-0 border-untitled-gray-100 no-underline text-untitled-gray-500 mx-2">
                    <option v-for="(size, index) in pageSizes" :key="index" :value="size">{{ size }}</option>
                </select>
            </div>
            <ul class="pagination bg-white mb-2 rounded">
                <li class="pagination-item">
                    <span
                        class="rounded-l rounded-sm border border-untitled-gray-100 px-3 py-2 cursor-not-allowed no-underline text-untitled-gray-600 h-10"
                        v-if="isInFirstPage">&laquo;</span>
                    <a v-else @click.prevent="onClickFirstPage"
                        class="rounded-l rounded-sm border-t border-b border-l border-untitled-gray-100 px-3 py-2 text-untitled-gray-600 hover:bg-untitled-gray-100 no-underline"
                        href="#" role="button" rel="prev">
                        &laquo;
                    </a>
                </li>
        
                <li class="pagination-item">
                    <button type="button" @click="onClickPreviousPage" :disabled="isInFirstPage"
                        aria-label="Go to previous page"
                        class="rounded-sm border border-untitled-gray-100 px-3 py-2 hover:bg-untitled-gray-100 text-untitled-gray-600 no-underline mx-2 text-sm"
                        :class="{ 'cursor-not-allowed': isInFirstPage }">Previous</button>
                </li>
        
                <li v-for="page in pages" class="pagination-item" :key="page.name">
                    <span
                        class="rounded-sm border border-untitled-gray-100 px-3 py-2 bg-untitled-gray-100 no-underline text-untitled-gray-500 cursor-not-allowed mx-2"
                        v-if="isPageActive(page.name)">{{ page.name }}</span>
                    <a class="rounded-sm border border-untitled-gray-100 px-3 py-2 hover:bg-untitled-gray-100 text-untitled-gray-600 no-underline mx-2"
                        href="#" v-else @click.prevent="onClickPage(page.name)" role="button">{{ page.name }}</a>
                </li>
        
                <li class="pagination-item">
                    <button type="button" @click="onClickNextPage" :disabled="isInLastPage" aria-label="Go to next page"
                        class="rounded-sm border border-untitled-gray-100 px-3 py-2 hover:bg-untitled-gray-100 text-untitled-gray-600 no-underline mx-2 text-sm"
                        :class="{ 'cursor-not-allowed': isInLastPage }">Next</button>
                </li>
        
                <li class="pagination-item">
                    <a class="rounded-r rounded-sm border border-untitled-gray-100 px-3 py-2 hover:bg-untitled-gray-100 text-untitled-gray-600 no-underline"
                        href="#" @click.prevent="onClickLastPage" rel="next" role="button" v-if="hasMorePages">&raquo;</a>
                    <span
                        class="rounded-r rounded-sm border border-untitled-gray-100 px-3 py-2 hover:bg-untitled-gray-100 text-untitled-gray-600 no-underline cursor-not-allowed"
                        v-else>&raquo;</span>
                </li>
            </ul>
            <div class="px-2 h-9 flex">
                <span class="text-sm place-self-center text-untitled-gray-600">Total {{ total }}</span>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, defineProps, computed, defineEmits } from 'vue';

const props = defineProps({
    pages: {
        type: Array,
        default: () => []
    },
    hasMorePages: {
        type: Boolean,
        default: false
    },
    maxVisibleButtons: {
        type: Number,
        required: false,
        default: 7
    },

    totalPages: {
        type: Number,
        required: true
    },

    total: {
        type: Number,
        required: true,
    },

    perPage: {
        type: Number,
        required: true,
        default: 10,
    },

    currentPage: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['pagechanged', 'pageSizeChange'])


const hasMorePages = computed(() => props.hasMorePages)

const pageSizes = ref(['10', '30', '50', '100', '200']);

const pageSize = ref(props.perPage)

const total = computed(() => props.total);

const startPage = computed({
    get() {
        if (props.currentPage === 1) {
            return 1;
        }

        if (props.currentPage === props.totalPages) {
            return props.totalPages - props.maxVisibleButtons + 1;
        }

        return props.currentPage - 1;
    },
    set(newValue) {
        newValue
    }
});

const endPage = computed( {
    get() {
        return Math.min(
            startPage.value + props.maxVisibleButtons - 1,
            props.totalPages
        );
    },
    set(newValue) {
        newValue
    } 
})

const pages = computed({
    get() {
        const range = [];
        for (let i = startPage.value; i <= endPage.value; i += 1) {
            range.push({
                name: i,
                isDisabled: i === this.currentPage
            });
        }

        return range.filter(r => r.name > 0);
    },
    set(newValue) {
        newValue
    }
});

const isInFirstPage = computed({
    get() {
        return props.currentPage === 1;
    },
    set(newValue) {
        newValue
    }
});

const isInLastPage = computed({
    get() {
        return props.currentPage === props.totalPages;
    },
    set(newValue) {
        newValue
    }
});


const onClickFirstPage = () => {
    emit("pagechanged", 1);
}

const isPageActive = (page) => {
    return props.currentPage === page;
}

const onClickPage = (page) => {
    emit("pagechanged", page)
}

const onClickNextPage = () => {
    emit("pagechanged", props.currentPage + 1)
}

const onClickPreviousPage = () => {
    emit("pagechanged", props.currentPage - 1)
}

const onClickLastPage = () => {
    emit("pagechanged", props.totalPages)
}

const handleChangePageSize = (event) => {
    emit('pageSizeChange', event.target.value)
}
</script>
<style scoped>
.pagination {
    list-style-type: none;
}

.pagination-item {
    display: inline-block;
}


</style>