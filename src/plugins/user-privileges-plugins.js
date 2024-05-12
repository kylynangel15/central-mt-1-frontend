import { useUserPrivilegesStore } from "@/store/useUserPrivilegesStore";
import { 
    USER_VIEW, 
    USER_CREATE, 
    USER_CREATE_CAN_COMPANY,
    USER_CREATE_CAN_STORE,
    USER_VIEW_CAN_STORE,
    USER_VIEW_CAN_COMPANY,
    USER_EDIT,
    USER_DELETE
} from "@/privileges/user_management";
export default {
	install: (app, options) => {

		app.directive('user-view', {
            mounted: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(USER_VIEW)) {
                    el.style.display = 'none';
                }
            },
            updated: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(USER_VIEW)) {
                    el.style.display = 'none';
                }
            },
        });

        app.directive('user-view-can-store', {
            mounted: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(USER_VIEW_CAN_STORE)) {
                    el.style.display = 'none';
                }
            },
            updated: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(USER_VIEW_CAN_STORE)) {
                    el.style.display = 'none';
                }
            },
        });

        app.directive('user-view-can-company', {
            mounted: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(USER_VIEW_CAN_COMPANY)) {
                    el.style.display = 'none';
                }
            },
            updated: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(USER_VIEW_CAN_COMPANY)) {
                    el.style.display = 'none';
                }
            },
        });

        app.directive('user-create', {
            mounted: (el, binding) => {

                if (!binding.value && !useUserPrivilegesStore().findPrivilege(USER_CREATE)) {
                    el.style.display = 'none';
                }

                if (!binding.value && !useUserPrivilegesStore().findPrivilege(USER_CREATE_CAN_COMPANY)) {
                    el.style.display = 'none';
                }

                if (!binding.value && !useUserPrivilegesStore().findPrivilege(USER_CREATE_CAN_STORE)) {
                    el.style.display = 'none';
                }

                if (useUserPrivilegesStore().findPrivilege(USER_CREATE)) {
                    el.style.display = "";
                }

                if (useUserPrivilegesStore().findPrivilege(USER_CREATE_CAN_COMPANY)) {
                    el.style.display = "";
                }

                if (useUserPrivilegesStore().findPrivilege(USER_CREATE_CAN_STORE)) {
                    el.style.display = "";
                }

            },
            updated: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(USER_CREATE)) {
                    el.style.display = 'none';
                }

                if (!binding.value && !useUserPrivilegesStore().findPrivilege(USER_CREATE_CAN_COMPANY)) {
                    el.style.display = 'none';
                }

                if (!binding.value && !useUserPrivilegesStore().findPrivilege(USER_CREATE_CAN_STORE)) {
                    el.style.display = 'none';
                }

                if (useUserPrivilegesStore().findPrivilege(USER_CREATE)) {
                    el.style.display = "";
                }

                if (useUserPrivilegesStore().findPrivilege(USER_CREATE_CAN_COMPANY)) {
                    el.style.display = "";
                }

                if (useUserPrivilegesStore().findPrivilege(USER_CREATE_CAN_STORE)) {
                    el.style.display = "";
                }
            },
        })

        app.directive('user-create-can-company', {
            mounted: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(USER_CREATE_CAN_COMPANY)) {
                    el.style.display = 'none';
                }
            },
            updated: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(USER_CREATE_CAN_COMPANY)) {
                    el.style.display = 'none';
                }
            },
        })

        app.directive('user-create-can-store', {
            mounted: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(USER_CREATE_CAN_STORE)) {
                    el.style.display = 'none';
                }
                else {
                    el.style.display = '';
                }
            },
            updated: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(USER_CREATE_CAN_STORE)) {
                    el.style.display = 'none';
                }
                else {
                    el.style.display = '';
                }
            },
        })

        app.directive('user-edit', {
            mounted: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(USER_EDIT)) {
                    el.style.display = 'none';
                }
            },
            updated: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(USER_EDIT)) {
                    el.style.display = 'none';
                }
            },
        })

        app.directive('user-delete', {
            mounted: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(USER_DELETE)) {
                    el.style.display = 'none';
                }
            },
            updated: (el, binding) => {

                if (!useUserPrivilegesStore().findPrivilege(USER_DELETE)) {
                    el.style.display = 'none';
                }
            },
        })
	},
};
