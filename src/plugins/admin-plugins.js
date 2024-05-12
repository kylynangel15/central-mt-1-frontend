import DataTable from '@/components/dataTable/DataTable.vue';
import GlobalPopupNotification from '@/components/GlobalPopupNotification.vue';
import GlobalDeleteConfirmation from '@/components/GlobalDeleteConfirmation.vue';
import GlobalPhoneNumber  from '@/components/forms/phoneNumber/PhoneNumber.vue';
import { useAdminSettingStore } from '@/store/useAdminSettingStore';
export default {
	install: (app, options) => {
		app.component('data-table', DataTable);

		app.component('global-popup-notification', GlobalPopupNotification);

		app.component('global-delete-confirmation', GlobalDeleteConfirmation);

        app.component('global-phone-number', GlobalPhoneNumber);

		app.directive('page-permission-create', (el, binding, vnode) => {
			el.style.display = 'none';
		});

        app.directive('administrator', {
            mounted: (el, binding) => {
                if (!useAdminSettingStore().isAdministrator) {
                    el.style.display = 'none';
                }
            },
            updated: (el, binding) => {
                if (!useAdminSettingStore().isAdministrator) {
                    el.style.display = 'none';
                }
            },
        });
	},
};
