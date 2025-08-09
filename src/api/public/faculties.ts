import api from "../axiosInstance/api";


export const publicFacultiesAPI = {
  getAllFaculties: async () => {
    const response = await api.get('/public/faculties');
    return response.data;
  }
}; 