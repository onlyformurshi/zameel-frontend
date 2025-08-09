import api from "../axiosInstance/api";


export const publicEventsAPI = {
  getAllEvents: async () => {
    const response = await api.get('/public/events');
    return response.data;
  }
}; 