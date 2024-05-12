import {
	USER_CREATE_CAN_COMPANY,
	USER_CREATE,
	USER_CREATE_CAN_STORE,
} from '@/privileges/user_management';

export const createUserAccess = () => {
	let privileges = [];
	privileges = JSON.parse(localStorage.getItem('PRIVILEGES'));
	let findUserCreate = privileges.find((value) => value === USER_CREATE);
	let findUserCreateCanCompany = privileges.find(
		(value) => value === USER_CREATE_CAN_COMPANY
	);
	let findUserCreateCanStore = privileges.find(
		(value) => value === USER_CREATE_CAN_STORE
	);

	if (findUserCreate) {
		return true;
	}

    if(findUserCreateCanCompany) {
        return true
    }

    if(findUserCreateCanStore) {
        return true
    }

    return false
};
