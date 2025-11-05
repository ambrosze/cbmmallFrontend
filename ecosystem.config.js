module.exports = {
    apps: [
        {
            name: "cbm-mall-shop",
            script: "npm",
            args: "run start",
            env: {
                NODE_ENV: "production",
                PORT: 3002,
            },
        },
        {
            name: "cbm-mall-shop-staging",
            script: "npm",
            args: "run start",
            env: {
                NODE_ENV: "production",
                PORT: 3003,
            },
        },
    ],
};
