<template>
    <div class="flex h-screen page">
        <div class="flex bg-white flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div class="mx-auto w-full max-w-sm lg:w-96">
                <div>
                    <img class="pull-left h-12 w-auto" src="https://revdojo.com/wp-content/uploads/2022/04/logo.png"
                        alt="RevDojo" />
                    <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Sign up
                    </h2>
                </div>

                <div class="mt-8">
                    <div class="my-5 border-red-500 border px-3 py-2 bg-red-500 text-white" v-if="errorShow">
                        {{ errorMessage }}
                    </div>
                    <div class="mt-6">
                        <form class="space-y-6">
                            <div>
                                <label for="name" class="block text-sm font-medium text-untitled-gray-700">
                                    Name
                                </label>
                                <div class="mt-1">
                                    <input id="name" name="name" v-model="user.name" type="text" autocomplete="name"
                                        placeholder="Enter your name"
                                        class="block w-full appearance-none rounded-md border border-untitled-gray-300 px-3 py-2 placeholder-untitled-gray-400 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-untitled-gray-500 sm:text-sm" />
                                </div>
                                <ErrorSpanMessage v-if="errorValue && errorValue.name">
                                    {{ errorValue.name[0] }}
                                </ErrorSpanMessage>
                            </div>

                            <div>
                                <label for="email" class="block text-sm font-medium text-untitled-gray-700">Email
                                    address</label>
                                <div class="mt-1">
                                    <input id="email" name="email" v-model="user.email" type="email"
                                        autocomplete="email" placeholder="Enter your email address"
                                        class="block w-full appearance-none rounded-md border border-untitled-gray-300 px-3 py-2 placeholder-untitled-gray-400 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-untitled-gray-500 sm:text-sm" />
                                </div>
                                <ErrorSpanMessage v-if="errorValue && errorValue.email">
                                    {{ errorValue.email[0] }}
                                </ErrorSpanMessage>
                            </div>

                            <div>
                                <label for="name" class="block text-sm font-medium text-untitled-gray-700">
                                    Company Name
                                </label>
                                <div class="mt-1">
                                    <input id="company" name="company" disabled v-model="user.company" type="text" autocomplete="name" placeholder="Enter your company name"
                                        class="block w-full appearance-none rounded-md border border-untitled-gray-300 px-3 py-2 placeholder-untitled-gray-400 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-untitled-gray-500 sm:text-sm" />
                                </div>
                                <ErrorSpanMessage v-if="errorValue && errorValue.name">
                                    {{ errorValue.name[0] }}
                                </ErrorSpanMessage>
                            </div>

                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox"
                                        class="h-4 w-4 rounded border-untitled-gray-300 text-untitled-gray-600 focus:ring-untitled-gray-500" />
                                    <label for="remember-me" class="ml-2 block text-sm text-untitled-gray-500">I read
                                        and accept the <span class="text-untitled-gray-900 cursor-pointer">terms and
                                            condition</span></label>
                                </div>
                            </div>

                            <div>
                                <button @click="handleClickLogin" type="button"
                                    class="flex w-full justify-center rounded-md border border-transparent bg-untitled-gray-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2">
                                    Submit
                                </button>
                            </div>
                        </form>
                        <div class="text-center mt-4">
                            <span class="mt-2 text-sm text-gray-600">
                                Already have an account?
                                <router-link to="/login" class="font-bold text-md text-indigo-300">
                                    Log in
                                </router-link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="relative hidden w-0 flex-1 lg:block">
            <!-- <img class="absolute inset-0 h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
                alt="" /> -->
        </div>
    </div>
</template>

<script setup>
import { companySignUp } from "@/composables/authentication";
import ErrorSpanMessage from "@/components/ErrorSpanMessage.vue";
import { ref } from "vue";
import { useAuth } from "@websanova/vue-auth";
import { useRouter } from "vue-router";
import SubLabelSpan from "@/components/SubLabelSpan.vue";

const router = useRouter();

const user = ref({
    name: null,
    email: null,
    status: 'UNDER_REVIEW'
});

const errorShow = ref(false);
const errorMessage = ref(null);
const errorValue = ref(null);

const handleClickLogin = async () => {

    const { signup, data, errorData, message } = companySignUp(user.value);

    await signup();

    errorValue.value = errorData.value;

    errorMessage.value = message.value;

    errorShow.value = errorMessage.value ? true : false

    if (data.value) {
        router.push({ name: 'Login' })
    }
};
</script>
