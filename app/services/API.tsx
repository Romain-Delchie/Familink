import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_CLERK_API_KEY}`,
  },
});

const API = {
  getFamilies: () => axiosInstance.get("/families?populate=*"),
  getOneFamily: (id: string) => axiosInstance.get(`/families/${id}`),
  getOneFamilyByUser: (email: string) =>
    axiosInstance.get(
      `/families?filters[user_lists][email][$eq]=${email}&populate[events]=*&populate[user_lists]=*&populate[shopping_lists][populate][list_items]=*&populate[todo_items]=*`
    ),
  createFamily: (family: object) => axiosInstance.post("/families", family),
  updateFamily: (id: string, family: object) =>
    axiosInstance.put(`/families/${id}`, family),
  getUsers: () => axiosInstance.get("/user-lists"),
  getUser: (id: string) => axiosInstance.get(`/user-lists/${id}`),
  getUserByEmail: (email: string) =>
    axiosInstance.get(`/user-lists?filters[email][$eq]=${email}`),
  createUser: (user: object) => axiosInstance.post("/user-lists", user),
  updateUser: (id: string, user: object) =>
    axiosInstance.put(`/user-lists/${id}`, user),
  deleteUser: (id: string) => axiosInstance.delete(`/user-lists/${id}`),
  getEventsByFamily: (id: string) =>
    axiosInstance.get(`/events?filters[family][documentId][$eq]=${id}`),
  createEvent: (event: object) => axiosInstance.post("/events", event),
  deleteEvent: (id: string) => axiosInstance.delete(`/events/${id}`),
  addShoppingList: (list: object) =>
    axiosInstance.post("/shopping-lists", list),
  deleteShoppingList: (id: string) =>
    axiosInstance.delete(`/shopping-lists/${id}`),
  createItemToList: (item: object) => axiosInstance.post("/list-items", item),
  deleteItemFromList: (id: string) => axiosInstance.delete(`/list-items/${id}`),
  createToDoItem: (item: object) => axiosInstance.post("/todo-items", item),
  updateTodoItem: (id: string, item: object) =>
    axiosInstance.put(`/todo-items/${id}`, item),
  deleteToDoItem: (id: string) => axiosInstance.delete(`/todo-items/${id}`),
  getUsersbyOneFamily: (id: string) =>
    axiosInstance.get(`/user-lists?filters[user_lists][family][$eq]=${id}`),
};

export default API;
