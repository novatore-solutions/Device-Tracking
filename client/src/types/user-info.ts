import { Changeable } from './base';

export interface UserInfo extends Changeable {
    _id?: string;
    email: string;
    updateToEmail?: string;
    name: string;
    roles: string[];
    profilePicture?: string;
    timeCreated: Date;
    isActive?: boolean;
    email_verified?: boolean;
    blockedUntil?: Date | null;
    deleted?: boolean;
    failedLoginAttempts: number;
    twoFactorEnabled: boolean;
    country?: string;
    currency?: string;
    timezone: string;
    password?: string;
    keyGenerated?: boolean;
    keyActive?: boolean;
    cellScanLimit?: number | null;
    OneTimeDeviceFee?: number | null;
}

export type AuthToken = string | null;

export interface Credentials {
    username: string;
    password: string;
    twoFactorCode?: string;
}

export interface SinupCredentials {
    name: string;
    email: string;
    country?: string;
    currency?: string;
    password: string;
}

export interface UserContainer<T = UserInfo> {
    user: T;
}
