import axios, { AxiosError } from "axios";
import { Statuses } from "./statuses";

const BASE_URL = "http://localhost:8500";

export interface IEvent {
  id: string;
  category: string;
  title: string;
  imgUrl: string;
  content: string;
  startDate: string;
  endDate: string;
  location: string;
  price: number;
  totalTickets: number;
  availableTickets: number;
  discount: number;
  Voucher?: IVoucher;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
  userId: string;
}

export interface IVoucher {
  id: string;
  discount: number;
  code?: string;
  quantity: number;
  validFrom: string;
  validUntil: string;
}

export interface IPricing {
  event: IEvent;
  isOpen: boolean;
  onClose: () => void;
}

export interface IValidateVoucher {
  success: boolean;
  message?: string;
  result?: {
    discount: number;
    finalPrice: number;
  };
}

export async function getNewsHeadline(search?: string): Promise<IEvent[]> {
  try {
    const url = search
      ? `${BASE_URL}/events/all?search=${encodeURIComponent(search)}`
      : `${BASE_URL}/events/all`;

    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function getEventDetail(objectId: string) {
  try {
    const res = await axios.get(`${BASE_URL}/events/${objectId}`);
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getUpcomingEvents(): Promise<IEvent[]> {
  try {
    // hanya ambil 4 artikel terbaru
    const res = await axios.get(
      `${BASE_URL}/events/all?pageSize=4&sortBy=created%20desc`
    ); //?pageSize=3&sortBy=created%20desc
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getEventsByCategory(
  category: string,
  search?: string
): Promise<IEvent[]> {
  try {
    const url = search
      ? `${BASE_URL}/categories/filter/category/${encodeURIComponent(
          category
        )}?search=${encodeURIComponent(search)}`
      : `${BASE_URL}/categories/filter/category/${encodeURIComponent(
          category
        )}`;

    const res = await axios.get(url);
    return res.data.result;
  } catch (error) {
    console.error("Error fetching events by category:", error);
    return [];
  }
}

export async function getAllCategories(): Promise<string[]> {
  try {
    const res = await axios.get(`${BASE_URL}/categories/category`);
    return res.data.result;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getEventsByLocation(
  location: string,
  search?: string
): Promise<IEvent[]> {
  try {
    const url = search
      ? `${BASE_URL}/locations/filter/location/${encodeURIComponent(
          location
        )}?search=${encodeURIComponent(search)}`
      : `${BASE_URL}/locations/filter/location/${encodeURIComponent(location)}`;
    const res = await axios.get(url);
    return res.data.result;
  } catch (error) {
    console.error("Error fetching events by location:", error);
    return [];
  }
}

export async function getAllLocations(): Promise<string[]> {
  try {
    const res = await axios.get(`${BASE_URL}/locations/location`);
    return res.data.result;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}

export async function getEventsByCategoryAndLocation(
  category: string,
  location: string,
  search?: string
): Promise<IEvent[]> {
  try {
    const url = search
      ? `${BASE_URL}/events/filter/${encodeURIComponent(
          category
        )}/${encodeURIComponent(location)}?search=${encodeURIComponent(search)}`
      : `${BASE_URL}/events/filter/${encodeURIComponent(
          category
        )}/${encodeURIComponent(location)}`;
    const res = await axios.get(url);
    return res.data.result;
  } catch (error) {
    console.error("Error fetching events by category and location:", error);
    return [];
  }
}

export async function getEventById(id: string) {
  try {
    const res = await axios.get(`${BASE_URL}/events/detail/${id}`);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching event detail:", error);
    return null;
  }
}

export async function getTransactionById(id: string) {
  try {
    const res = await axios.get(`${BASE_URL}/dashboard/${id}`);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching event detail:", error);
    return null;
  }
}

export type CreateEventData = Omit<IEvent, "id" | "createdAt" | "updatedAt">;
export const createEvent = async (data: CreateEventData): Promise<IEvent> => {
  try {
    const response = await axios.post(`${BASE_URL}/events/create`, data, {
      withCredentials: true,
    });
    return response.data.result;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw err.response?.data || err;
    }
    throw err;
  }
};

// get enum categories
export async function fetchEnumCategories() {
  try {
    const res = await axios.get(`${BASE_URL}/categories/all-enum-categories`);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// export async function validateVoucher(eventId: string, voucherCode: string) {
//   try {
//     const res = await axios.post(`${BASE_URL}/voucher/validate`, {
//       eventId,
//       voucherCode,
//     });

//     // if (res.data.success) {
//     //   return {
//     //     success: true,
//     //     discount: res.data.result.discount,
//     //     finalPrice: res.data.result.finalPrice,
//     //   };
//     // } else {
//     //   return {
//     //     success: false,
//     //     error: res.data.message || "Voucher tidak valid",
//     //   };
//     // }
//   } catch (error) {
//     const message = error.response.data.message;``
//     if (message) {
//       return {
//         success: false,
//         error: message || "Voucher tidak valid",
//       };
//     } else {
//       return { success: false, error: "Terjadi kesalahan tak terduga" };
//     }
//   }
// }

export async function validateVoucher(eventId: string, voucherCode: string) {
  try {
    const res = await axios.post(`${BASE_URL}/vouchers/voucher/validate`, {
      eventId,
      voucherCode,
    });

    const data = res.data;

    return {
      success: data.success ?? true,
      discount: data.result.discount ?? 0,
      finalPrice: data.result.finalPrice ?? 0,
      message: data.message ?? "",
    };
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;

    const message =
      err.response?.data?.message ||
      "Voucher tidak valid atau sudah kadaluarsa";

    return {
      success: false,
      error: message,
    };
  }
}

export async function createTransaction(data: {
  eventId: string;
  totalPrice: number;
  paymentMethod: string;
  paymentProof?: string;
}) {
  try {
    const res = await axios.post(
      `${BASE_URL}/transactions/create/transaction`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Gagal membuat transaksi";
      throw new Error(message);
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Terjadi kesalahan tak terduga");
  }
}

export async function updateTransactionStatus(id: string, status: string) {
  const res = await axios.patch(
    "http://localhost:8500/dashboard/update-transaction",
    { id, status }
  );

  if (!res) throw new Error("Failed to update transaction");
  return res.data;
}
export async function validateCoupon(userId: string, eventId: string) {
  try {
    const res = await axios.post(
      `${BASE_URL}/coupons/coupon/validate`,
      { userId, eventId },
      { withCredentials: true }
    );

    const data = res.data;

    return {
      success: data.success ?? true,
      discount: data.result?.discount ?? 0,
      finalPrice: data.result?.finalPrice ?? 0,
      couponId: data.result?.couponId ?? null, // ⭐ Tambah couponId
      message: data.message ?? "",
    };
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    const message =
      err.response?.data?.message || "Kupon tidak valid atau sudah digunakan";

    return {
      success: false,
      error: message,
    };
  }
}

export async function validateReferralPoint(userId: string, eventId: string) {
  try {
    const res = await axios.post(
      `${BASE_URL}/referrals/referral/validate`,
      { userId, eventId },
      { withCredentials: true }
    );

    const data = res.data;

    return {
      success: data.success ?? true,
      discount: data.result?.discount ?? 0,
      finalPrice: data.result?.finalPrice ?? 0,
      referralId: data.result?.referralId ?? null, // ⭐ Tambah referralId
      message: data.message ?? "",
    };
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    const message =
      err.response?.data?.message ||
      "Referral point tidak valid atau sudah digunakan";

    return {
      success: false,
      error: message,
    };
  }
}

// export enum Statuses {
//   PENDING = "PENDING",
//   SUCCESS = "SUCCESS",
//   FAILED = "FAILED",
//   CANCELLED = "CANCELLED",
// }

// export const statusColors: Record<Statuses, string> = {
//   [Statuses.PENDING]: "bg-yellow-500 text-black",
//   [Statuses.SUCCESS]: "bg-green-600 text-white",
//   [Statuses.FAILED]: "bg-red-600 text-white",
//   [Statuses.CANCELLED]: "bg-gray-600 text-white",
// };

// interface ITicket {
//   id: string;
//   eventTitle: string;
//   startDate: string;
//   endDate: string;
//   totalPrice: number;
//   status: string;
//   purchasedAt: string;
// }

// interface IMyTicketsResponse {
//   success: boolean;
//   tickets: ITicket[];
// }

// export async function getMyTickets(): Promise<IMyTicketsResponse> {
//   try {
//     const res = await axios.get<IMyTicketsResponse>(`${BASE_URL}/ticket/all`, {
//       withCredentials: true, // kirim cookie JWT
//     });
//     return res.data;
//   } catch (err: unknown) {
//     if (axios.isAxiosError(err)) {
//       console.error("Error fetching tickets:", err.response?.data || err.message);
//     } else if (err instanceof Error) {
//       console.error("Unexpected error:", err.message);
//     } else {
//       console.error("Unknown error:", err);
//     }
//     return { success: false, tickets: [] };
//   }
// }

export interface ITicket {
  id: string;
  eventTitle: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: Statuses;
  purchasedAt: string;
}

interface IMyTicketsResponse {
  success: boolean;
  tickets: ITicket[];
}

export async function getMyTickets(): Promise<IMyTicketsResponse> {
  try {
    const res = await axios.get<IMyTicketsResponse>(`${BASE_URL}/tickets/ticket/all`, {
      withCredentials: true, 
    });

    
    const mappedTickets = (res.data.tickets ?? []).map((t) => ({
      ...t,
      status: Object.values(Statuses).includes(t.status as Statuses)
        ? (t.status as Statuses)
        : Statuses.PENDING,
    }));

    return { success: res.data.success, tickets: mappedTickets };
  } catch (err: unknown) {
    console.error("Gagal mengambil tiket:", err);
    return { success: false, tickets: [] };
  }
}
