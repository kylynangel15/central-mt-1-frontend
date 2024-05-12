<template>
	<div class="flex h-screen page">
		<div
			class="flex flex-1 bg-white flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
		>
			<div class="mx-auto w-full max-w-sm lg:w-96">
				<div>
					<img
						class="pull-left h-12 w-auto"
						src="https://webinarinc-central.s3.us-west-1.amazonaws.com/public/company_logo/revdojo_logo.png"
						alt="RevDojo"
					/>
					<h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900">
						Login (Admin)
					</h2>
					<p class="mt-2 text-sm text-gray-600">
						Welcome Back! Please enter your details.
					</p>
				</div>

				<div class="mt-8">
					<div
						class="my-5 border-red-500 border px-3 py-2 bg-red-500 text-white"
						v-if="errorShow"
					>
						{{ errorMessage }}
					</div>
					<div class="mt-6">
						<form class="space-y-6">
							<div>
								<label
									for="email"
									class="block text-sm font-medium text-untitled-gray-700"
									>Email address</label
								>
								<div class="mt-1">
									<input
										id="email"
										name="email"
										v-model="user.email"
										type="email"
										placeholder="Enter your email address"
										autocomplete="email"
										class="block w-full appearance-none rounded-md border border-untitled-gray-300 px-3 py-2 placeholder-untitled-gray-400 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-untitled-gray-500 sm:text-sm"
									/>
								</div>
								<ErrorSpanMessage v-if="errorValue && errorValue.email">
									{{ errorValue.email[0] }}
								</ErrorSpanMessage>
							</div>

							<div>
								<label
									for="password"
									class="block text-sm font-medium text-untitled-gray-700"
									>Password</label
								>
								<div class="mt-1 relative">
									<input
										id="password"
										name="password"
										:type="!isViewPassword ? 'password' : 'text'"
										autocomplete="current-password"
										v-model="user.password"
										placeholder="Enter your password"
										class="block w-full appearance-none rounded-md border border-untitled-gray-300 px-3 py-2 placeholder-untitled-gray-400 shadow-sm focus:border-untitled-gray-500 focus:outline-none focus:ring-untitled-gray-500 sm:text-sm"
									/>
									<div
										class="absolute inset-y-0 right-0 flex items-center pr-3"
									>
										<component
											:is="viewPasswordIcon"
											@click="handleCLickViewPassword"
											class="h-5 w-5 text-untitled-gray-500 cursor-pointer"
											aria-hidden="true"
										/>
									</div>
								</div>
								<ErrorSpanMessage
									v-if="errorValue && errorValue.password"
								>
									{{ errorValue.password[0] }}
								</ErrorSpanMessage>
							</div>

							<div class="flex items-center justify-between">
								<div class="flex items-center">
									<input
										id="remember-me"
										name="remember-me"
										type="checkbox"
										class="h-4 w-4 rounded border-untitled-gray-300 text-untitled-gray-600 focus:ring-untitled-gray-500"
									/>
									<label
										for="remember-me"
										class="ml-2 block text-sm text-untitled-gray-900"
										>Remember me</label
									>
								</div>

								<div class="text-sm">
									<router-link
										to="/forgot-password"
										class="font-medium text-untitled-gray-600 hover:text-untitled-gray-500"
										>Forgot your password?
									</router-link>
								</div>
							</div>

							<div>
								<button
									@click="handleClickLogin"
									type="button"
									class="flex w-full justify-center rounded-md border border-transparent bg-untitled-gray-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-untitled-gray-500 focus:outline-none focus:ring-2 focus:ring-untitled-gray-500 focus:ring-offset-2"
								>
									Sign in
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
		<div class="relative hidden w-0 flex-1 lg:block">
			<!-- <img
            class="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
            alt=""
          /> -->
		</div>
	</div>
</template>

<script setup>
import { loginUser } from "@/composables/authentication";
import ErrorSpanMessage from "@/components/ErrorSpanMessage.vue";
import { ref, inject } from "vue";
import { useAuth } from "@websanova/vue-auth";
import { useRouter } from "vue-router";
import { useUserStore } from "@/modules/companies/store/user/useUserStore";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import { useAdminSettingStore } from "@/store/useAdminSettingStore";
import { useUserPrivilegesStore } from "@/store/useUserPrivilegesStore";

const router = useRouter();

const user = ref({
	email: null,
	password: null,
});

const auth = useAuth();
const errorShow = ref(false);
const errorMessage = ref(null);
const errorValue = ref(null);
const isViewPassword = ref(false);
const viewPasswordIcon = ref(EyeIcon);

const userStore = useUserStore();
const adminStore = useAdminSettingStore();
const privilegesStore = useUserPrivilegesStore()

const handleClickLogin = async () => {
	const { login, data, message, errorData, hasErrorMessage } = loginUser(
		user.value
	);
	await login();
	errorMessage.value = message.value;
	errorValue.value = errorData.value;
	errorShow.value = hasErrorMessage.value;

	if (!hasErrorMessage.value) {
		auth.user(data.value.user);
		auth.token(null, data.value.access_token, false);
		auth.remember(JSON.stringify(auth.user()));
		userStore.setUser(JSON.parse(auth.remember()));
		adminStore.setLoginUser(JSON.parse(auth.remember()));

		router.push("/");
	}
};

const handleCLickViewPassword = () => {
	isViewPassword.value = !isViewPassword.value;

	if (isViewPassword.value) {
		viewPasswordIcon.value = EyeSlashIcon;
		return;
	}

	viewPasswordIcon.value = EyeIcon;
};
</script>
