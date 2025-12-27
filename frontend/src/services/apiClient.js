apiClient.interceptors.response.use(
    (response) => {
        window.__APP_CONNECTION__.rest.status = "connected";
        window.__APP_CONNECTION__.rest.lastSuccess = {
            url: response.config.url,
            time: new Date().toISOString()
        };
        return response;
    },
    (error) => {
        window.__APP_CONNECTION__.rest.status = "disconnected";
        window.__APP_CONNECTION__.rest.lastError = {
            url: error.config?.url,
            message: error.message,
            time: new Date().toISOString()
        };

        console.error("🚨 BACKEND REST DISCONNECTED", error.message);
        return Promise.reject(error);
    }
);
