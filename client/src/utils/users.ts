import { UserInfo } from '@/types/user-info';
import { defaultCellScanLimit } from '@/constants/constants';

export const userObj = (data: UserInfo): UserInfo => {
    return {
        _id: data._id,
        email: data.email,
        name: data.name,
        roles: data.roles,
        timeCreated: data.timeCreated,
        country: data.country,
        currency: data.currency,
        timezone: data.timezone,
        failedLoginAttempts: data.failedLoginAttempts,
        twoFactorEnabled: data.twoFactorEnabled,
        profilePicture: data.profilePicture ?? '',
        updateToEmail: data.updateToEmail ?? '',
        keyGenerated: data.keyGenerated ?? false,
        keyActive: data.keyActive ?? false,
        cellScanLimit: data.cellScanLimit || defaultCellScanLimit,
        OneTimeDeviceFee: data.OneTimeDeviceFee ?? 0,
    };
};
