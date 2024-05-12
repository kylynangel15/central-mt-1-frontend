<template>
    <div class="mt-2">
      <div class="relative mt-1 rounded-md shadow-sm">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassCircleIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input type="text" name="email" id="email" class="block w-full rounded-md border-gray-300 pl-10 focus:border-gray-500 focus:ring-gray-500 sm:text-sm" placeholder="Search Companies" />
      </div>
      <div class="mt-5">
        <div class="grid grid-cols-8 gap-4">
            <div>
                <select id="location" name="location" class="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm">
                    <option selected disabled>Status</option>
                    <option>option1</option>
                    <option>option2</option>
                </select>
            </div>
            <div>
                <select id="location" name="location" class=" block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm">
                    <option selected disabled>Service</option>
                    <option>option1</option>
                    <option>option2</option>
                </select>
            </div>
            <div class>
                <button type="button" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">Clear Filter</button>
            </div>
            <div></div>
            <div></div>
            <div></div>
            <div class="col-span-2">
                <button type="button" @click="handleClickCreateCompanyPage" class=" w-2/3 inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm text-center font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                    <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    New Company
                </button>
            </div>
        </div>
      </div>
      
    </div>
  </template>
  
  <script setup>
  import { MagnifyingGlassCircleIcon,PlusIcon } from '@heroicons/vue/20/solid';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const handleClickCreateCompanyPage = () => {
      router.push('companies/create');
    }
  </script>