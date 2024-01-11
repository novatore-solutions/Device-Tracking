const required = (message?: string) => (value: string | number) => !!value || message || 'Field is required';
const email = (message?: string) => (value: string) =>
    /.{2,}@.{1,}\..{2,}/.test(value) || message || 'Invalid Email address';

export default {
    required,
    email,
};
