import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { MOCK_ROOMS, MOCK_TIMESLOTS } from "@/data/rooms";
import type { Room, TimeSlot } from "@/types/room";
import React from "react";

interface RoomsContextValue {
  rooms: Room[];
  timeSlots: TimeSlot[];
  addRoom: (room: Omit<Room, "id">) => void;
  updateRoom: (id: number, data: Partial<Room>) => void;
  deleteRoom: (id: number) => void;
  getRoom: (id: number) => Room | undefined;
  addTimeSlot: (slot: Omit<TimeSlot, "id">) => void;
  updateTimeSlot: (id: number, data: Partial<TimeSlot>) => void;
  deleteTimeSlot: (id: number) => void;
  getTimeSlot: (id: number) => TimeSlot | undefined;
  getTimeSlotsForRoom: (roomId: number) => TimeSlot[];
}

const RoomsContext = createContext<RoomsContextValue | null>(null);

export function RoomsProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(MOCK_TIMESLOTS);

  const addRoom = useCallback((room: Omit<Room, "id">) => {
    setRooms((prev) => {
      const maxId = prev.reduce((max, r) => Math.max(max, r.id), 0);
      return [{ ...room, id: maxId + 1 }, ...prev];
    });
  }, []);

  const updateRoom = useCallback((id: number, data: Partial<Room>) => {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  }, []);

  const deleteRoom = useCallback((id: number) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
    setTimeSlots((prev) => prev.filter((ts) => ts.salleId !== id));
  }, []);

  const getRoom = useCallback((id: number) => rooms.find((r) => r.id === id), [rooms]);

  const addTimeSlot = useCallback((slot: Omit<TimeSlot, "id">) => {
    setTimeSlots((prev) => {
      const maxId = prev.reduce((max, ts) => Math.max(max, ts.id), 0);
      return [...prev, { ...slot, id: maxId + 1 }];
    });
  }, []);

  const updateTimeSlot = useCallback((id: number, data: Partial<TimeSlot>) => {
    setTimeSlots((prev) => prev.map((ts) => (ts.id === id ? { ...ts, ...data } : ts)));
  }, []);

  const deleteTimeSlot = useCallback((id: number) => {
    setTimeSlots((prev) => prev.filter((ts) => ts.id !== id));
  }, []);

  const getTimeSlot = useCallback((id: number) => timeSlots.find((ts) => ts.id === id), [timeSlots]);

  const getTimeSlotsForRoom = useCallback(
    (roomId: number) => timeSlots.filter((ts) => ts.salleId === roomId),
    [timeSlots]
  );

  return React.createElement(
    RoomsContext.Provider,
    {
      value: {
        rooms,
        timeSlots,
        addRoom,
        updateRoom,
        deleteRoom,
        getRoom,
        addTimeSlot,
        updateTimeSlot,
        deleteTimeSlot,
        getTimeSlot,
        getTimeSlotsForRoom,
      },
    },
    children
  );
}

export function useRooms() {
  const ctx = useContext(RoomsContext);
  if (!ctx) throw new Error("useRooms must be used within a RoomsProvider");
  return ctx;
}
