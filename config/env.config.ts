import * as dotenv from 'dotenv';
dotenv.config();

// Khai báo tên môi trường
export type EnvironmentName = 'qa' | 'dev' | 'staging' | 'prod';

interface Credentials {
    username: string;
    password: string;
}

interface EnvironmentConfig {
    baseURL: string;
    credentials: Credentials;
}

// Danh sách môi trường
const environments: Record<EnvironmentName, EnvironmentConfig> = {
    qa: {
        baseURL: 'https://www.saucedemo.com/',
        credentials: {
            username: process.env.QA_USERNAME || 'visual_user',
            password: process.env.QA_PASSWORD || 'secret_sauce',
        },
    },
    dev: {
        baseURL: 'https://dev.saucedemo.com/',
        credentials: {
            username: process.env.DEV_USERNAME || 'dev_user',
            password: process.env.DEV_PASSWORD || 'secret_sauce',
        },
    },
    staging: {
        baseURL: 'https://staging.saucedemo.com/',
        credentials: {
            username: process.env.STAGING_USERNAME || 'staging_user',
            password: process.env.STAGING_PASSWORD || 'secret_sauce',
        },
    },
    prod: {
        baseURL: 'https://www.saucedemo.com/',
        credentials: {
            username: process.env.PROD_USERNAME || 'standard_user',
            password: process.env.PROD_PASSWORD || 'secret_sauce',
        },
    },
};

// Lấy ENV từ terminal hoặc mặc định là qa
const currentEnv: EnvironmentName = (process.env.ENV as EnvironmentName) || 'qa';

export const Config: EnvironmentConfig = environments[currentEnv];
