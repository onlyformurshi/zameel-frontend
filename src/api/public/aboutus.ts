import api from "../axiosInstance/api";


export const aboutUsAPI = {
  getAboutUs: async () => {
    const response = await api.get('/public/about-us');
    return response.data;
  },
  getFaculty: async () => {
    const response = await api.get('/public/faculty');
    return response.data;
  }
}; 