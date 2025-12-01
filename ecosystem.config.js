module.exports = {
    apps: [
        {
            name: "cbm-mall-store",
            script: "npm",
            args: "run start",
            env: {
                NODE_ENV: "production",
                PORT: 3000,
            },
        },
        {
            name: "cbm-mall-store-staging",
            script: "npm",
            args: "run start",
            env: {
                NODE_ENV: "staging",
                PORT: 3000,
            },
        },
    ],
};
