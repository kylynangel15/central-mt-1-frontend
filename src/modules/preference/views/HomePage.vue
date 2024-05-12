<template>
  <GlobalBreadCrumbs :pages="pages" />
  <PageLoader v-if="loadingPreference" />
  <div class="py-6" v-else>
    <div class="mx-auto max-w-7xl px-4 pt-10 mb-4 sm:px-6 md:px-8">
      <h1 class="text-2xl font-semibold text-gray-600">
        Preference
        <span class="text-lg font-thin">Default Preference</span>
      </h1>
    </div>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div class="flex-1 mt-8 xs:mt-2">
        <div class="md:grid md:grid-cols-5 md:gap-6">
          <div class="lg:col-span-2 md:col-span-5">
            <PreferenceForm
              :preference="preference"
            />
          </div>

          <div class="mt-5 lg:col-span-3 md:col-span-5 md:mt-0">
            <div class="mx-auto">
              <div>
                <div class="sm:hidden">
                  <label for="tabs" class="sr-only">Select a tab</label>
                  <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
                  <select
                    id="tabs"
                    name="tabs"
                    class="block w-full rounded-md border-gray-300 focus:border-untitled-gray-500 focus:ring-untitled-gray-500"
                  >
                    <option
                      v-for="tab in tabs"
                      :key="tab.name"
                      :selected="tab.current"
                    >
                      {{ tab.name }}
                    </option>
                  </select>
                </div>
                <div class="hidden sm:block">
                  <div class="border-b border-gray-200">
                    <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                      <span
                        v-for="tab in tabs"
                        @click="handleClickTag(tab.name)"
                        :key="tab.name"
                        :class="[
                          tab.current
                            ? 'border-untitled-gray-500 text-untitled-gray-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                          'group cursor-pointer inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm',
                        ]"
                        :aria-current="tab.current ? 'page' : undefined"
                      >
                        <component
                          :is="tab.icon"
                          :class="[
                            tab.current
                              ? 'text-untitled-gray-500'
                              : 'text-gray-400 group-hover:text-gray-500',
                            '-ml-0.5 mr-2 h-5 w-5',
                          ]"
                          aria-hidden="true"
                        />
                        <span>{{ tab.name }}</span>
                      </span>
                    </nav>
                  </div>
                </div>
              </div>
            </div>

            <keep-alive>
              <component
                :is="
                  componentList[
                    tabs.find((tab) => tab.current == true).componentName
                  ]
                "
                :preference="preference"
              />
            </keep-alive>
          </div>
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
import { EnvelopeIcon, ComputerDesktopIcon } from "@heroicons/vue/20/solid";
import {
  defineProps,
  ref,
  computed,
  defineAsyncComponent,
  onMounted,
} from "vue";
import PreferenceForm from "../components/PreferenceForm.vue";
import GlobalBreadCrumbs from "@/components/GlobalBreadCrumbs.vue";
import PageLoader from "@/components/loader/PageLoader.vue";
import { getPreference } from "../composables/default_preference";

const loadingPreference = ref(false);

const componentList = {
  WebPreview: defineAsyncComponent(() =>
    import("../components/PreferenceWebPreview.vue")
  ),
  EmailPreview: defineAsyncComponent(() =>
    import("../components/PreferenceEmailPreview.vue")
  ),
};

const pages = computed({
  get() {
    return [
      {
        name: "Preference",
        to: {
          name: "Preference Home Page",
        },
        current: false,
      },
    ];
  },
  set(newValue) {
    newValue;
  },
});

const preference = ref({
  logo_photo: null,
  favicon_photo: null,
  signature_name: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  facebook: "",
  youtube: "",
  linkedin: "",
  technical_email: "",
  sales_email: "",
  footer: "",
  phone_number: "",
  phone_code: "",
  phone_country: "",
  overwrite: false,
});

const tabs = ref([
  {
    name: "Email Preview",
    href: "#",
    icon: EnvelopeIcon,
    current: true,
    componentName: "EmailPreview",
  },
  {
    name: "Web Preview",
    href: "#",
    icon: ComputerDesktopIcon,
    current: false,
    componentName: "WebPreview",
  },
]);

const handleClickTag = (name) => {
  tabs.value = tabs.value.map((tab) => {
    if (tab.name === name) {
      tab.current = true;
    } else {
      tab.current = false;
    }
    return tab;
  });
};

const loadDefaultPreference = async () => {
  loadingPreference.value = true;

  const { get, data } = getPreference();
  await get();

  preference.value = data.value;
  loadingPreference.value = false;

};

onMounted(() => {
  loadDefaultPreference();

});
</script>
