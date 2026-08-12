import axios from 'axios';

const ACCESS_KEY  = 'gv_access';
const REFRESH_KEY = 'gv_refresh';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach the stored access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_KEY);
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// On 401, try refreshing the token once, then give up
let _isRefreshing = false;
let _queue = [];

const processQueue = (error, token = null) => {
  _queue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  _queue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (_isRefreshing) {
        return new Promise((resolve, reject) => {
          _queue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      _isRefreshing = true;

      const refreshToken = localStorage.getItem(REFRESH_KEY);
      if (!refreshToken) {
        _isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/token/refresh/`,
          { refresh: refreshToken }
        );
        localStorage.setItem(ACCESS_KEY, data.access);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
        processQueue(null, data.access);
        originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear stale tokens so the user gets redirected to login
        localStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem('gv_user');
        return Promise.reject(refreshError);
      } finally {
        _isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ── Menu ──────────────────────────────────────────────────────────────────────
export const fetchMenuItems  = (category) => {
  const url = category ? `/menu/items/?category=${category}` : '/menu/items/';
  return api.get(url);
};
export const fetchCategories = () => api.get('/menu/categories/');

// ── Reviews ───────────────────────────────────────────────────────────────────
export const fetchTestimonials = () => api.get('/reviews/testimonials/');

// ── Reservations / Payments ───────────────────────────────────────────────────
export const createCheckoutSession  = (data) => api.post('/reservations/create-checkout-session/', data);
export const createRazorpayOrder    = (data) => api.post('/reservations/create-razorpay-order/', data);
export const verifyRazorpayPayment  = (data) => api.post('/reservations/verify-razorpay-payment/', data);
export const submitReservation      = (data) => api.post('/reservations/submit/', data);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authRegister     = (data) => api.post('/auth/register/', data);
export const authLogin        = (data) => api.post('/auth/login/', data);
export const authGoogleLogin  = (data) => api.post('/auth/google/', data);
export const authRefreshToken = (data) => api.post('/auth/token/refresh/', data);
export const fetchProfile     = ()     => api.get('/auth/profile/');

// ── Site Assets & Gallery ─────────────────────────────────────────────────────
export const fetchSiteAssets     = () => api.get('/menu/site-assets/');
export const fetchGalleryImages  = () => api.get('/menu/gallery/');

export default api;
