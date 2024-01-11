import { HistoryData } from '@/types/history';
import {
    locationPinColors,
    locationPinClasses,
    defaultLocationPinColor,
    defaultLocationPinClass,
} from '@/constants/locationHistory';

export function fill(location: HistoryData, type = 'color') {
    return type === 'color'
        ? location.type
            ? locationPinColors[location.type] ?? defaultLocationPinColor
            : defaultLocationPinColor
        : location.type
        ? locationPinClasses[location.type] ?? defaultLocationPinClass
        : defaultLocationPinClass;
}
