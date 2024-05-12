import { registerModules } from "./registerModules";

import DashboardModule from './modules/dashboard';
import CompanyModule from './modules/companies';
import ProductModule from './modules/product';
import CustomerTypeModule from './modules/customerType'
import AppModule from './modules/app'
import LogModule from './modules/logs'
import SettingModule from './modules/settings'
import SupportModule from './modules/support'
import RoleModule from './modules/roles'
import UserModule from './modules/users'
import StoreModule from './modules/stores'
import TagModule from './modules/tags'
import PreferenceModule from './modules/preference'

registerModules({
    dashboard: DashboardModule,
    company: CompanyModule,
    product: ProductModule,
    customerType: CustomerTypeModule,
    app: AppModule,
    log: LogModule,
    setting: SettingModule,
    support: SupportModule,
    role: RoleModule,
    user: UserModule,
    store: StoreModule,
    tags: TagModule,
    preference: PreferenceModule,
})

