"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  validateVoucher,
  validateCoupon,
  validateReferralPoint,
  createTransaction,
} from "@/lib/backend";
import { verifyToken } from "@/lib/auth-backend";
import { IPricing } from "@/lib/backend";


interface DiscountState {
  voucherDiscount: number;
  couponOrReferralDiscount: number;
  priceAfterVoucher: number;
  finalPrice: number;
}

export default function Pricing({ event, isOpen, onClose }: IPricing) {
  const [voucherCode, setVoucherCode] = useState("");
  const [loading, setLoading] = useState(false);

  
  const [discountState, setDiscountState] = useState<DiscountState>({
    voucherDiscount: 0,
    couponOrReferralDiscount: 0,
    priceAfterVoucher: event?.price ?? 0,
    finalPrice: event?.price ?? 0,
  });

  
  const [claimedCouponId, setClaimedCouponId] = useState<string | null>(null);
  const [claimedReferralId, setClaimedReferralId] = useState<string | null>(
    null
  );
  const [discountType, setDiscountType] = useState<
    "voucher" | "coupon" | "referral" | null
  >(null);

  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("TRANSFER");
  const [paymentProofUrl, setPaymentProofUrl] = useState("");
  const [paymentProofError, setPaymentProofError] = useState("");
  const [userId, setUserId] = useState<{ id: string; email: string } | null>(
    null
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await verifyToken();
        if (res?.user) {
          setUserId(res.user);
          console.log("User login:", res.user);
        } else {
          console.warn("Belum login.");
        }
      } catch (err) {
        console.error("Gagal verifikasi token:", err);
      }
    };
    fetchUser();
  }, []);

  
  useEffect(() => {
    if (event) {
      setDiscountState({
        voucherDiscount: 0,
        couponOrReferralDiscount: 0,
        priceAfterVoucher: event.price,
        finalPrice: event.price,
      });
      setClaimedCouponId(null);
      setClaimedReferralId(null);
      setDiscountType(null);
    }
  }, [event]);

  if (!event) return null;

  const shortVoucherCode = event?.Voucher?.id
    ? event.Voucher.id.slice(0, 8).toUpperCase()
    : null;

  
  const handleValidateVoucher = async () => {
    setLoading(true);
    setError("");

    const result = await validateVoucher(event.id, voucherCode);

    if (!result.success) {
      setError(result.error ?? "Voucher tidak valid");
    } else {
      const voucherDiscount = result.discount ?? 0;
      const priceAfterVoucher = result.finalPrice ?? event.price;

      
      setDiscountState({
        voucherDiscount,
        couponOrReferralDiscount: 0,
        priceAfterVoucher,
        finalPrice: priceAfterVoucher,
      });

      setClaimedCouponId(null);
      setClaimedReferralId(null);
      setDiscountType("voucher");

      console.log("Voucher applied:", {
        voucherDiscount,
        priceAfterVoucher,
      });
    }

    setLoading(false);
  };

  
  const handleClaimCoupon = async () => {
    if (!userId) {
      setError("User belum login. Tidak dapat claim coupon.");
      return;
    }

    console.log("Claiming coupon for:", {
      userId: userId.id,
      eventId: event.id,
    });

    setLoading(true);
    setError("");

    try {
      const result = await validateCoupon(userId.id, event.id);
      console.log("Coupon result:", result);

      if (!result.success) {
        setError(result.error ?? "Coupon tidak valid atau sudah digunakan");
      } else {
        const couponDiscount = result.discount ?? 0;
        const basePrice = discountState.priceAfterVoucher; 
        const finalPrice = basePrice - couponDiscount;

        setDiscountState({
          ...discountState,
          couponOrReferralDiscount: couponDiscount,
          finalPrice: finalPrice > 0 ? finalPrice : 0,
        });

        setClaimedCouponId(result.couponId ?? null); 
        setClaimedReferralId(null);
        setDiscountType("coupon");

        console.log("Coupon applied:", { couponDiscount, finalPrice });
      }
    } catch (err) {
      console.error("Coupon error:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

 
  const handleClaimReferralPoint = async () => {
    if (!userId) {
      setError("User belum login. Tidak dapat claim referral point.");
      return;
    }

    console.log("Claiming referral for:", {
      userId: userId.id,
      eventId: event.id,
    });

    setLoading(true);
    setError("");

    try {
      const result = await validateReferralPoint(userId.id, event.id);
      console.log("Referral result:", result);

      if (!result.success) {
        setError(
          result.error ?? "Referral point tidak valid atau sudah digunakan"
        );
      } else {
        const referralDiscount = result.discount ?? 0;
        const basePrice = discountState.priceAfterVoucher; 
        const finalPrice = basePrice - referralDiscount;

        setDiscountState({
          ...discountState,
          couponOrReferralDiscount: referralDiscount,
          finalPrice: finalPrice > 0 ? finalPrice : 0,
        });

        setClaimedReferralId(result.referralId ?? null); 
        setClaimedCouponId(null);
        setDiscountType("referral");

        console.log("Referral applied:", { referralDiscount, finalPrice });
      }
    } catch (err) {
      console.error("Referral error:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  
  const handleCheckout = async () => {
    setPaymentProofError("");

    if (!paymentProofUrl.trim()) {
      setPaymentProofError("Bukti pembayaran wajib diisi sebelum checkout.");
      return;
    }

    if (!userId) {
      alert("User belum login.");
      return;
    }

    try {
      setLoading(true);

      const transactionData = {
        userId: userId.id, 
        eventId: event.id,
        totalPrice: discountState.finalPrice,
        paymentMethod,
        paymentProof: paymentProofUrl,
        voucherUsed: discountState.voucherDiscount > 0,
        couponId: claimedCouponId, 
        referralId: claimedReferralId, 
      };

      console.log("Creating transaction:", transactionData);

      const result = await createTransaction(transactionData);

      alert("Transaksi berhasil dibuat!");
      console.log("Transaction result:", result);
      onClose();
    } catch (err) {
      console.error("Gagal membuat transaksi:", err);
      alert((err as Error).message || "Terjadi kesalahan saat transaksi");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr?: string) =>
    dateStr
      ? new Date(dateStr).toLocaleString("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "-";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#111111] text-gray-100 shadow-[0_0_40px_rgba(0,0,0,0.6)] p-0 rounded-2xl border border-[#2a2a2a] backdrop-blur-md">
        <div className="max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center mb-5 text-white font-orbitron tracking-wide">
              Transaksi Tiket
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* === DETAIL EVENT === */}
            <div className="border border-[#2f2f2f] p-4 bg-[#181818] rounded-lg">
              <p className="font-semibold text-lg text-[#9d4edd] font-audiowide">
                {event?.title ?? "Tanpa Judul"}
              </p>
              <p className="text-sm text-gray-400">{event?.location ?? "-"}</p>
              <p className="text-sm text-gray-500">
                Harga Awal: Rp {(event?.price ?? 0).toLocaleString("id-ID")}
              </p>
            </div>

            {/* === VOUCHER INFO === */}
            {shortVoucherCode && event.Voucher && (
              <div className="p-6 bg-gradient-to-r from-[#1b1325] via-[#1a1420] to-[#0e0c14] border border-[#3a2a50] rounded-xl shadow-inner">
                <p className="text-sm text-gray-300 mb-2 text-center">
                  Gunakan kode voucher ini:
                </p>
                <p className="text-2xl font-bold text-[#b891f9] tracking-widest text-center mb-3">
                  {shortVoucherCode}
                </p>

                <div className="grid grid-cols-3 gap-4 text-sm text-gray-400 text-center">
                  <div className="flex flex-col items-center">
                    <p className="font-semibold text-[#9d4edd]">Quantity</p>
                    <p>{event.Voucher.quantity ?? 0}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-semibold text-[#9d4edd]">Berlaku dari</p>
                    <p>{formatDate(event.Voucher.validFrom?.toString())}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-semibold text-[#9d4edd]">
                      Berlaku sampai
                    </p>
                    <p>{formatDate(event.Voucher.validUntil?.toString())}</p>
                  </div>
                </div>
              </div>
            )}

            {/* === INPUT VOUCHER === */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-semibold">
                Gunakan Voucher Global (Opsional)
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Masukkan kode voucher"
                  className="bg-[#181818] border border-[#333] text-gray-200 placeholder:text-gray-500 focus:border-[#7f5af0]"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
                <Button
                  onClick={handleValidateVoucher}
                  disabled={loading || !voucherCode}
                  className="bg-[#7f5af0] hover:bg-[#9d4edd] text-white font-semibold transition-all"
                >
                  {loading ? "Cek..." : "Apply"}
                </Button>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>

            {/* === CLAIM COUPON & REFERRAL === */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-semibold">
                Gunakan Coupon / Referral Point (Pilih Salah Satu)
              </label>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleClaimCoupon}
                  disabled={loading}
                  className="bg-[#7f5af0] hover:bg-[#9d4edd] text-white font-semibold transition-all"
                >
                  {loading ? "Memeriksa Kupon..." : "Claim Coupon"}
                </Button>

                <Button
                  onClick={handleClaimReferralPoint}
                  disabled={loading}
                  className="bg-[#9d4edd] hover:bg-[#b891f9] text-white font-semibold transition-all"
                >
                  {loading ? "Memeriksa Referral..." : "Claim Referral Point"}
                </Button>
              </div>
            </div>

            {/* === BREAKDOWN DISKON === */}
            {(discountState.voucherDiscount > 0 ||
              discountState.couponOrReferralDiscount > 0) && (
              <div className="p-4 bg-[#1b1b1b] border border-[#3a2a50] rounded-lg space-y-2">
                <p className="text-[#b891f9] font-semibold mb-2">
                  Rincian Diskon
                </p>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Harga Awal:</span>
                  <span>Rp {event.price.toLocaleString("id-ID")}</span>
                </div>

                {discountState.voucherDiscount > 0 && (
                  <>
                    <div className="flex justify-between text-sm text-green-400">
                      <span>
                        Diskon Voucher ({discountState.voucherDiscount}%):
                      </span>
                      <span>
                        - Rp{" "}
                        {(
                          (event.price * discountState.voucherDiscount) /
                          100
                        ).toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-[#333] pt-2">
                      <span className="text-gray-400">
                        Harga Setelah Voucher:
                      </span>
                      <span className="font-semibold">
                        Rp{" "}
                        {discountState.priceAfterVoucher.toLocaleString(
                          "id-ID"
                        )}
                      </span>
                    </div>
                  </>
                )}

                {discountState.couponOrReferralDiscount > 0 && (
                  <>
                    <div className="flex justify-between text-sm text-green-400">
                      <span>
                        Diskon{" "}
                        {discountType === "coupon"
                          ? "Coupon"
                          : "Referral Point"}
                        :
                      </span>
                      <span>
                        - Rp{" "}
                        {discountState.couponOrReferralDiscount.toLocaleString(
                          "id-ID"
                        )}
                      </span>
                    </div>
                  </>
                )}

                <div className="flex justify-between text-lg font-bold border-t-2 border-[#7f5af0] pt-3 mt-2">
                  <span className="text-[#b891f9]">Harga Final:</span>
                  <span className="text-[#b891f9]">
                    Rp {discountState.finalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            )}

            {/* === PEMBAYARAN === */}
            <label className="text-sm text-gray-300 font-semibold">
              Pilih Metode Pembayaran
            </label>
            <select
              className="w-full bg-[#181818] border border-[#333] rounded-md p-2 text-sm text-gray-200 focus:border-[#7f5af0]"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="TRANSFER">Manual Transfer</option>
              <option value="EWALLET">E-Wallet</option>
              <option value="VIRTUAL">Virtual Account</option>
              <option value="CREDIT">Kartu Kredit</option>
            </select>

            {/* === BUKTI PEMBAYARAN === */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">
                Bukti Pembayaran (URL)
              </label>
              <Input
                type="text"
                placeholder="Masukkan bukti pembayaran"
                className="bg-[#181818] border border-[#333] text-gray-200 placeholder:text-gray-500 focus:border-[#7f5af0]"
                value={paymentProofUrl}
                onChange={(e) => {
                  setPaymentProofUrl(e.target.value);
                  if (e.target.value.trim()) setPaymentProofError("");
                }}
              />
              {paymentProofError && (
                <p className="text-red-400 text-sm">{paymentProofError}</p>
              )}
            </div>

            {/* === TOTAL DAN CHECKOUT === */}
            <div className="flex justify-between items-center border-t border-[#2a2a2a] pt-4">
              <span className="font-semibold text-lg text-gray-300">
                Total Pembayaran:
              </span>
              <span className="font-bold text-2xl text-[#b891f9]">
                Rp {discountState.finalPrice.toLocaleString("id-ID")}
              </span>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-[#7f5af0] hover:bg-[#9d4edd] text-white font-bold transition-all rounded-lg py-6 text-lg"
            >
              {loading ? "Memproses..." : "Buy Ticket"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
