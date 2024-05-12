<template>
    <aside
        class="hidden w-96 bg-white h-screen overflow-y-auto flex-shrink-0 border-r border-gray-200 xl:order-first xl:flex xl:flex-col">
        <div class="px-6 pt-6 pb-4 border-b border-b-untitled-gray-300">
            <h2 class="text-lg font-medium text-gray-900">Users</h2>
            <p class="mt-1 text-sm text-gray-600">Search user of {{ totalUser }} users</p>
            <form class="mt-6 flex space-x-4" action="#">
                <div class="min-w-0 flex-1">
                    <label for="search" class="sr-only">Search</label>
                    <div class="relative rounded-md shadow-sm">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input type="search" v-model="search" name="search" id="search"
                            class="block w-full rounded-md border-gray-300 pl-10 focus:border-untitled-gray-500 focus:ring-untitled-gray-500 sm:text-sm"
                            placeholder="Search" />
                    </div>
                </div>
                <button type="button"
                    @click="showFilter = !showFilter"
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
                    <FunnelIcon v-if="!showFilter" class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    <XMarkIcon v-if="showFilter" class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    <span class="sr-only">Search</span>
                </button>
            </form>
            <div class="w-full" v-if="showFilter">
                <SelectStatus v-model="statusUser"/>
                <SelectRoles v-model="userRoles" @clearRoles="handleClearRoles"/>
                <SelectStore 
                    v-model="userStore" v-if="companyProfile.type === GROUP_COMPANY" 
                    @clearStore="handleClearStore"
                    :company-id="companyId"/>
                <button 
                    type="button"
                    @click="handleClickClearFilter"
                    class="flex float-right mt-1 justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-untitled-gray-500 shadow-lg mr-2 hover:bg-untitled-gray-100 focus:outline-none focus:ring-2 focus:ring-untitled-gray-400 focus:ring-offset-2">Clear
                    Filter</button>
            </div>
        </div>
        <!-- Directory list -->
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
    </aside>
</template>
<script setup>
import { getUsers } from '@/modules/companies/composables/user/get_users';
import { UserCircleIcon, XMarkIcon } from '@heroicons/vue/20/solid';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { ref, defineProps, computed, onMounted, watch, defineEmits, provide } from 'vue';
import { debounce as _debounce } from 'lodash-es';
import SelectStatus from '@/modules/companies/utilities/user/SelectStatus.vue';
import SelectRoles from '@/modules/roles/utilities/SelectRoles.vue';
import roles from '@/modules/roles';
import NoDataLoader from '@/components/loader/NoDataLoader.vue';
import SelectStore from '../../store/utilities/SelectStore.vue';
import { useEmitter } from '@/composables/useEmitter';
import { useRouter } from 'vue-router';
import { GROUP_COMPANY } from '@/composables/default_variables/company_type';
const props = defineProps({
    companyId: {
        type: Number,
        default: null
    },
    userId: {
        type: Number,
        default: null
    },
    companyProfile: {
        type: Object,
        default: () => {},
        required: true
    }
})

const emit = defineEmits(['clickUser'])
const emitter = useEmitter;

const companyId = computed(() => props.companyId)
const userId = computed(() => props.userId)
const router = useRouter()
const companyProfile = computed(() => props.companyProfile)

const search = ref('')
const showFilter = ref(false)

const users = ref([])
const totalUser = ref(0)
const loadingUsers = ref(true)
const hasMorePage = ref(true)

const showLoading = ref(false)

const statusUser = ref('')
const userRoles = ref([])
const userStore = ref({})

const params = ref({
    search: '',
    page: 1,
    size: 10,
})

const newUsers = ref([])
const isNoData = ref(false)


const fetchUsers = async () => {
    loadingUsers.value = true
    const p = {
        search: search.value,
        page: params.value.page,
        size: 10,
        company_id: companyId.value,
        status: statusUser.value,
        roles: userRoles.value.map(r => r.id),
        store_id: userStore.value.id
    }

    const { load, data, totalPages, totalUsers, hasLastPage } = getUsers(p);
    await load();
    hasMorePage.value = hasLastPage.value
    users.value = users.value.concat(data.value);
    loadingUsers.value = false
    totalUser.value = totalUsers.value
    isNoData.value = totalUser.value == 0 ? true : false
}

const loadMoreUsers = () => {
    if(!hasMorePage.value) return;
    params.value.page = params.value.page + 1
}

const handleClickUser = (user) => {
    emit('clickUser', user)
}

const handleClearRoles = () => {
    userRoles.value = []
}

const handleClearStore = () => {
    userStore.value = {}
}

const handleClickClearFilter = () => {
    statusUser.value = ''
    userRoles.value = []
    userStore.value = {}
}

const changeUrl = (id) => {
    router.push({name: 'View Company User Page', 
        params: { 
            id: companyId.value,
            userId: id
        }, 
    })
}


const onChangeSearchText = _debounce((value) => {   
    users.value = []
    fetchUsers();
}, 500)

provide('usersListProvide', {
    loadMoreUsers,
    handleClickUser
})

onMounted( async () => {
    await fetchUsers();

    emitter.on('changeUserPreview', async (user_id) => {
        let userIndex = users.value.findIndex(user => user.id == user_id)
        if(users.value[userIndex + 1] && users.value[userIndex + 1].id) {
            emit('clickUser', users.value[userIndex + 1])
            changeUrl(users.value[userIndex + 1].id)
            users.value.splice(userIndex, 1)
            return;
        }

        if(users.value[userIndex - 1] && users.value[userIndex - 1].id) {
            emit('clickUser', users.value[userIndex - 1])
            changeUrl(users.value[userIndex - 1].id)
            users.value.splice(userIndex, 1)
            return;
        }

        router.push({ name: 'Company Details Page', params: {id: companyId} })
    })
})

watch(params.value, () => {
    showLoading.value = true
    fetchUsers();
    showLoading.value = false
})

watch(statusUser, () => {
    params.value.page = 1
    users.value = []
    onChangeSearchText();
})

watch(userStore, () => {
    params.value.page = 1
    users.value = []
    onChangeSearchText();
})

watch(userRoles, () => {
    params.value.page = 1
    users.value = []
    onChangeSearchText();
})

watch(search, (val) => {
    params.value.page = 1
    onChangeSearchText(val)
})
</script>