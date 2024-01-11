export const locationPinColors = {
    mcell: '#0877DB',
    scell: '#F30051',
    gps: '#009083',
};

export const locationPinClasses = {
    mcell: 'dark-blue',
    scell: 'dark-red',
    gps: 'dark-green',
};

export type locationType = keyof typeof locationPinColors;

export const defaultLocationPinColor = locationPinColors.mcell;
export const defaultLocationPinClass = locationPinClasses.mcell;
