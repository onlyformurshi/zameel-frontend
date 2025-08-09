import api from "../axiosInstance/api";


export const publicGalleryAPI = {
  getAllGallery: async () => {
    const response = await api.get('/public/gallery');
    return response.data;
  },
  getGalleryCategories: async () => {
    const response = await api.get('/public/gallery/categories');
    return response.data;
  }
}; 