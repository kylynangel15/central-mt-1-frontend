import { STORE_CREATE, STORE_DELETE, STORE_EDIT } from "@/privileges/store_management";
import { useUserPrivilegesStore } from "@/store/useUserPrivilegesStore";
export default {
	install: (app, options) => {
        app.directive('store-create', {
            mounted: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(STORE_CREATE)) {
                    el.style.display = 'none';
                }
                else {
                    el.style.display = ''
                }
            },
            updated: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(STORE_CREATE)) {
                    el.style.display = 'none';
                }
                else {
                    el.style.display = ''
                }
            }
        })

        app.directive('store-edit', {
            mounted: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(STORE_EDIT)) {
                    el.style.display = 'none';
                }
                else {
                    el.style.display = ''
                }
            },
            updated: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(STORE_EDIT)) {
                    el.style.display = 'none';
                }
                else {
                    el.style.display = ''
                }
            }
        })

        app.directive('store-delete', {
            mounted: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(STORE_DELETE)) {
                    el.style.display = 'none';
                }
                else {
                    el.style.display = ''
                }
            },
            updated: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(STORE_DELETE)) {
                    el.style.display = 'none';
                }
                else {
                    el.style.display = ''
                }
            }
        })
	},
};
