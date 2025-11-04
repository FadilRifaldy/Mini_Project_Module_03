export enum Statuses {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export const statusColors: Record<Statuses, string> = {
  [Statuses.PENDING]: "bg-yellow-500 text-black",
  [Statuses.SUCCESS]: "bg-green-600 text-white",
  [Statuses.FAILED]: "bg-red-600 text-white",
  [Statuses.CANCELLED]: "bg-gray-600 text-white",
};

export function getStatusColor(status: string): string {
  if (Object.values(Statuses).includes(status as Statuses)) {
    return statusColors[status as Statuses];
  }
  return "bg-gray-600 text-white";
}
