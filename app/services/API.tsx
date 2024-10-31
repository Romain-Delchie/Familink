import axios from "axios";
import { create } from "react-test-renderer";

const baseURL = "http://192.168.1.147:1337/api";
// const baseURL = "http://192.168.1.104:1337/api";

const API_KEY =
  "1776f7fec3bdf35929e562d12127c24ea054aa4f197f9011bfe4f2969e5af99bce05034ba9162c3613f1c54d24bfc241d4df5c76eeaac8c16d64a46e87521888de4f054b50341c711ba6f1c03fb77d2906ed952d4722aa57123ef9e47e26058a2695dfe06f77211db544dea10d286771762363f6f53af918f0d777c91e1639c2";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_CLERK_API_KEY}`,
  },
});

const API = {
  getFamilies: () => axiosInstance.get("/families?populate=*"),
  getOneFamily: (id: number) => axiosInstance.get(`/families/${id}`),
  getOneFamilyByUser: (email: string) =>
    axiosInstance.get(
      `/families?filters[user_lists][email][$eq]=${email}&populate=*`
    ),
  createFamily: (family: object) => axiosInstance.post("/families", family),
  updateFamily: (id: number, family: object) =>
    axiosInstance.put(`/families/${id}`, family),
  getUsers: () => axiosInstance.get("/user-lists"),
  getUser: (id: number) => axiosInstance.get(`/user-lists/${id}`),
  getUserByEmail: (email: string) =>
    axiosInstance.get(`/user-lists?filters[email][$eq]=${email}`),
  createUser: (user: object) => axiosInstance.post("/user-lists", user),
  updateUser: (id: number, user: object) =>
    axiosInstance.put(`/user-lists/${id}`, user),
  getEventsByFamily: (id: string) =>
    axiosInstance.get(`/events?filters[family][documentId][$eq]=${id}`),
  //   getCalendmy: () =>
  //     axiosInstance.get(
  //       `/calend-mies?populate[0]=events,shopping_lists,to_do&populate[1]=shopping_lists.list_items,to_do.todo_items`
  //     ),
  //   addEvent: (event) => axiosInstance.post(`/events`, event),
  //   deleteEvent: (id) => axiosInstance.delete(`/events/${id}`),
  //   updateEvent: (id, event) => axiosInstance.put(`/events/${id}`, event),
  //   addShoppingList: (list) => axiosInstance.post(`/shopping-lists`, list),
  //   deleteShoppingList: (id) => axiosInstance.delete(`/shopping-lists/${id}`),
  //   updateShoppingList: (id, list) =>
  //     axiosInstance.put(`/shopping-lists/${id}`, list),
  //   addItemToList: (item) => axiosInstance.post(`/list-items`, item),
  //   deleteItemFromList: (id) => axiosInstance.delete(`/list-items/${id}`),
  //   updateItemFromList: (id, item) =>
  //     axiosInstance.put(`/list-items/${id}`, item),
  //   addToDoItem: (item) => axiosInstance.post(`/todo-items`, item),
  //   deleteToDoItem: (id) => axiosInstance.delete(`/todo-items/${id}`),
  //   updateToDoItems: (id, item) => axiosInstance.put(`/todo-items/${id}`, item),
};

export default API;
