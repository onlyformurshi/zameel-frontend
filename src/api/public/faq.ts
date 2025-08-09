import api from "../axiosInstance/api";


export const publicFAQAPI = {
  getAllFAQCategories: async () => {
    const response = await api.get('/public/faq/categories');
    return response.data;
  },
  getAllFAQ: async () => {
    const response = await api.get('/public/faq');
    return response.data;
  }
}; 