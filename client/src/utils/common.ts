export const getErrorMessage = (error: any, returnMessage = ''): string => {
    // eslint-disable-next-line
    const errorObj = error as any;
    const message = errorObj?.response?.data?.error
        ? errorObj?.response?.data?.error[0]
        : errorObj?.response?.data?.message ?? '';

    return message ? message : returnMessage ? returnMessage : 'Something went wrong';
};
