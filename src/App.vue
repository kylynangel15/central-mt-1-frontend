<template>
  <router-view v-slot="{Component}">
    <Transition 
      name="fade"
      mode="out-in">
      <component :is="Component" />
    </Transition>
  </router-view>
</template>
<script setup>
import { getUserProfile } from '@/composables/authentication';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { tabBrowserSetting } from './composables/tab_browser';
import { useUserStore } from './modules/companies/store/user/useUserStore';
import { useAdminSettingStore } from './store/useAdminSettingStore';
import { useUserPrivilegesStore } from './store/useUserPrivilegesStore';

const route = useRoute();
const userStore = useUserStore();
const adminStore = useAdminSettingStore();
const privilegesStore = useUserPrivilegesStore()

const loading = ref(true);
const getLoggedInUser = async () => {
  const { loadUser, data } = getUserProfile();
  await loadUser();
  userStore.setUser(data.value)
  adminStore.setLoginUser(data.value)
  localStorage.setItem('PRIVILEGES', JSON.stringify(data.value.privileges))
  loading.value = false
}

onMounted(async () => {
  await getLoggedInUser();
  tabBrowserSetting(route.meta.title);
})
watch(route, () => {
	tabBrowserSetting(route.meta.title);
})
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
