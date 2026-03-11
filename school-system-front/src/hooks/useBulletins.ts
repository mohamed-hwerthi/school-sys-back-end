import { useQuery } from "@tanstack/react-query";
import { bulletinsApi, type BulletinDTO } from "@/api/bulletins.api";

const KEY = "bulletins";

export function useBulletins(
  classeId: number,
  trimestre: number,
  version: string = "etatique"
) {
  return useQuery<BulletinDTO[]>({
    queryKey: [KEY, classeId, trimestre, version],
    queryFn: () => bulletinsApi.getAll(classeId, trimestre, version),
    enabled: classeId > 0 && trimestre > 0,
  });
}

export function useBulletin(
  classeId: number,
  studentId: number,
  trimestre: number,
  version: string = "etatique"
) {
  return useQuery<BulletinDTO>({
    queryKey: [KEY, "single", classeId, studentId, trimestre, version],
    queryFn: () => bulletinsApi.getOne(classeId, studentId, trimestre, version),
    enabled: classeId > 0 && studentId > 0 && trimestre > 0,
  });
}
