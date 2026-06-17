import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL


export const api = axios.create({
    baseURL:apiUrl,
    headers:{
        'Content-Type':'application/json'
    },
    withCredentials:true

  })


  
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

// Response interceptor
api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;
        console.log(error?.response?.data?.error || error.message)

        if(error.response?.status === 403){
            const code = error.response?.data.code
            console.log("this is code in api interceptor",code)
            if(code === 'NO_ACCESS'){
                window.location.href = '/'
                return 
            }
        }

        // If error is 401 and tokenExpired flag is true
        if (error.response?.status === 401 && 
            error.response?.data?.tokenExpired && 
            !originalRequest._retry) {
            // If already refreshing, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call refresh endpoint
                const fetching = await api.post('/api/auth/refresh-access-token');
                console.log(fetching)
                console.log("your token has been refreshed")
                
                processQueue(null);
                isRefreshing = false;

                // Retry the original request
                return api(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError);
                isRefreshing = false;

                // Redirect to login or dispatch logout action
                window.location.href = '/login';
                
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


