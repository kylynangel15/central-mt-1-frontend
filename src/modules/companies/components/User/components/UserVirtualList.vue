<template>
    <nav class="min-h-0 flex-1 overflow-y-auto" aria-label="Directory">
            <ul role="list" class="relative  z-0 divide-y divide-gray-200"
                v-infinite-scroll="loadMoreUsers" 
                :infinite-scroll-immediate-check="false"
                infinite-scroll-watch-disabled="disableScroll">
                <li v-for="person in users" :key="person.id">
                    <div
                        @click="handleClickUser(person)"
                        class="relative flex items-center space-x-3 px-6 py-4 hover:bg-gray-50"
                        :class="[userId == person.id ? 'border border-untitled-gray-500 bg-untitled-gray-100': '']">
                        <div class="flex-shrink-0">
                            <img v-if="person.profile_photo" class="h-10 shadow-sm w-10 object-cover rounded-full" :src="person.profile_photo" alt="" />
                            <UserCircleIcon v-else class="w-12 -ml-1 text-untitled-gray-500 "/>
                        </div>
                        <div class="min-w-0 flex-1">
                            <a href="#" class="focus:outline-none">
                                <!-- Extend touch target to entire panel -->
                                <span class="absolute inset-0" aria-hidden="true" />
                                <p class="text-xs float-right" :class="[ 
                                person.status == 'ACTIVE' ? 'bg-green-500 text-white p-1 mt-1 rounded-full w-3 h-3 text-center' : '',
                                person.status == 'UNDER_REVIEW' ? 'bg-yellow-600 text-white p-1 mt-1 rounded-full w-3 h-3 text-center' : '',
                                person.status == 'INACTIVE' ? 'bg-stone-600 text-white p-1 mt-1 rounded-full w-3 h-3 text-center' : '',
                                person.status == 'REJECTED' ? 'bg-red-600 text-white p-1 mt-1 rounded-full w-3 h-3 text-center' : '']"></p>
                                <p class="text-sm font-semibold text-gray-900">{{ person.name }}</p>
                                <p class=" text-xs text-gray-500">{{ person.email }}</p>
                               
                            </a>
                        </div>
                    </div>
                </li>
                <div class="w-full h-12 text-center" v-if="showLoading">
                    <span class="text-sm text-untitled-gray-500">loading....</span>
                </div>
            </ul>
            <NoDataLoader v-if="!loadingUsers && isNoData"/>
        </nav>
</template>
<script setup>
import { defineProps, inject, computed } from 'vue'

const props = defineProps({
    users: {
        type: Array,
        default: () => []
    }
})

const userFunctionInject = inject('usersListProvide')

const users = computed(() => props.users)

const loadMoreUsers = () => {
    userFunctionInject.loadMoreUsers();
}

const handleClickUser = (user) => {
    userFunctionInject.handleClickUser(user)
}
</script>