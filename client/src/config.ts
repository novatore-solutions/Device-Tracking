const mandatoryParam = (envVarName: string) => {
    const value = process.env[envVarName];
    if (!value) throw new Error(`Environment variable "${envVarName}" must be defined!`);
    return value;
};

export const environment = mandatoryParam('VUE_APP_ENVIRONMENT');
export const apiBaseUrl = mandatoryParam('VUE_APP_API_ENDPOINT');
