import { COMPANY_CREATE, COMPANY_DELETE, COMPANY_EDIT } from "@/privileges/company_managent";
import { useUserPrivilegesStore } from "@/store/useUserPrivilegesStore";
export default {
	install: (app, options) => {
        app.directive('company-create', {
            mounted: (el, binding) => {
                if (!binding.value && !binding.value && !useUserPrivilegesStore().findPrivilege(COMPANY_CREATE)) {
                    el.style.display = 'none';
                }
            },
            updated: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(COMPANY_CREATE)) {
                    el.style.display = 'none';
                }
            }
        })

        app.directive('company-edit', {
            mounted: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(COMPANY_EDIT)) {
                    el.style.display = 'none';
                }
            },
            updated: (el, binding) => {
                if (!binding.value && !useUserPrivilegesStore().findPrivilege(COMPANY_EDIT)) {
                    el.style.display = 'none';
                }
            }
        })

        app.directive('company-delete', {
            mounted: (el, binding) => {
                if (!binding.value && !binding.value && !useUserPrivilegesStore().findPrivilege(COMPANY_DELETE)) {
                    el.style.display = 'none';
                }
            },
            updated: (el, binding) => {
                if (!binding.value && !binding.value && !useUserPrivilegesStore().findPrivilege(COMPANY_DELETE)) {
                    el.style.display = 'none';
                }
            }
        })
	},
};
