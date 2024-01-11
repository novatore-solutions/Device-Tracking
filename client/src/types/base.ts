import Vue from 'vue';

export interface Changeable {
    changed?: boolean;
}

// eslint-disable-next-line
export type Dictionary<T = any> = { [key: string]: T };

export interface Timestampable {
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Validateable extends Vue {
    validate: () => boolean;
    clear: () => void;
}
