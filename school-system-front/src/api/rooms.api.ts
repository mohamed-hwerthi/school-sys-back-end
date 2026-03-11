import api from "./axios";
import type { Room, TimeSlot } from "@/types/room";

const BASE = "/rooms";

export const roomsApi = {
  getAll: () => api.get<Room[]>(BASE).then((res) => res.data),

  getById: (id: number) =>
    api.get<Room>(`${BASE}/${id}`).then((res) => res.data),

  create: (data: Omit<Room, "id">) =>
    api.post<Room>(BASE, data).then((res) => res.data),

  update: (id: number, data: Partial<Room>) =>
    api.put<Room>(`${BASE}/${id}`, data).then((res) => res.data),

  delete: (id: number) => api.delete(`${BASE}/${id}`).then((res) => res.data),
};

export const timeSlotsApi = {
  getAll: () => api.get<TimeSlot[]>("/timeslots").then((res) => res.data),

  getByRoom: (roomId: number) =>
    api.get<TimeSlot[]>(`${BASE}/${roomId}/timeslots`).then((res) => res.data),

  create: (data: Omit<TimeSlot, "id">) =>
    api.post<TimeSlot>("/timeslots", data).then((res) => res.data),

  update: (id: number, data: Partial<TimeSlot>) =>
    api.put<TimeSlot>(`/timeslots/${id}`, data).then((res) => res.data),

  delete: (id: number) =>
    api.delete(`/timeslots/${id}`).then((res) => res.data),
};
