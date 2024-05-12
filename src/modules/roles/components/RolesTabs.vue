<template>
	<div>
		<div class="sm:hidden">
			<label for="tabs" class="sr-only">Select a tab</label>
			<!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
			<select
				id="tabs"
				name="tabs"
				class="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-untitled-gray-500 focus:outline-none focus:ring-untitled-gray-500 sm:text-sm">
				<option
					v-for="tab in tabs"
					:key="tab.name"
					:selected="tab.current">
					{{ tab.name }}
				</option>
			</select>
		</div>
		<div class="hidden sm:block">
			<div class="border-b border-gray-200">
				<nav class="-mb-px flex space-x-8" aria-label="Tabs">
					<span
						v-for="tab in tabs"
						:key="tab.name"
                        @click="handleClickRoleTab(tab.name)"
						:class="[
							tab.current
								? 'border-untitled-gray-500 text-untitled-gray-600'
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
							'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
						]"
						:aria-current="tab.current ? 'page' : undefined">
                        
                        {{ tab.name }}
                    </span>
				</nav>
			</div>
		</div>
	</div>
</template>
<script setup>
import { ref, defineEmits, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const emit = defineEmits(['changeTab'])

const route = useRoute();

const router = useRouter();

const tabs = ref([
	{ name: 'Roles', href: '#', current: true },
	{ name: 'Privileges', href: '#', current: false },
]);

const handleClickRoleTab = (name) => {
    tabs.value.map(tab => {
        if(tab.name == name) {
            tab.current = true
        }
        else {
            tab.current = false
        }
    })

	router.push({ name: 'Roles Home Page', query: {name : name.toLowerCase()}})

    emit('changeTab', tabs.value.find(tab => tab.current == true).name)
}

onMounted(() => {
	if(route.query.name && route.query.name == 'privileges') {
		tabs.value = tabs.value.map(tab => {
			if(tab.name == 'Privileges') {
				tab.current = true
			}
			else { 
				tab.current = false
			}

			return tab
		})
	}
})

</script>
