import api from "../axiosInstance/api";


export const publicContactAPI = {
  getAllContact: async () => {
    const response = await api.get('/public/contact');
    return response.data;
  },
}; 