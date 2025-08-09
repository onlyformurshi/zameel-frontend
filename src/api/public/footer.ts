import api from "../axiosInstance/api";


export const publicFooterAPI = {
  getFooter: async () => {
    const response = await api.get('/public/footer');
    return response.data;
  }
}; 