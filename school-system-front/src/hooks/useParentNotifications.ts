import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  parentNotificationsApi,
  type NotifChannel,
  type NotifEvent,
  type NotifStatus,
} from "@/api/parentNotifications.api";

const KEY = "parent-notifications";

export function useNotifyForExamen() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ examenId, channels }: { examenId: number; channels: NotifChannel[] }) =>
      parentNotificationsApi.notifyForExamen(examenId, { channels }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useNotifyForNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ noteId, channels }: { noteId: number; channels: NotifChannel[] }) =>
      parentNotificationsApi.notifyForNote(noteId, { channels }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useNotifyManual() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      studentId,
      message,
      channels,
    }: {
      studentId: number;
      message: string;
      channels: NotifChannel[];
    }) => parentNotificationsApi.notifyManual(studentId, { message, channels }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useNotificationLogs(params: {
  recipientId?: number;
  eventType?: NotifEvent;
  status?: NotifStatus;
  page?: number;
  size?: number;
} = {}) {
  return useQuery({
    queryKey: [KEY, "logs", params],
    queryFn: () => parentNotificationsApi.listLogs(params),
  });
}
