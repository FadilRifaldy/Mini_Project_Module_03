"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { validateVoucher, createTransaction } from "@/lib/backend";
import { IPricing, IValidateVoucher } from "@/lib/backend";

export default function Pricing({ event, isOpen, onClose }: IPricing) {
  const [voucherCode, setVoucherCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [discountInfo, setDiscountInfo] = useState<
    IValidateVoucher["result"] | null
  >(null);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("TRANSFER");
  const [paymentProofUrl, setPaymentProofUrl] = useState("");
  const [paymentProofError, setPaymentProofError] = useState("");

  if (!event) return null;

  const shortVoucherCode = event?.Voucher?.id
    ? event.Voucher.id.slice(0, 8).toUpperCase()
    : null;

  const handleValidateVoucher = async () => {
    setLoading(true);
    setError("");
    setDiscountInfo(null);

    const result = await validateVoucher(event.id, voucherCode);

    if (!result.success) {
      setError(result.error ?? "");
    } else {
      setDiscountInfo({
        discount: result.discount,
        finalPrice: result.finalPrice,
      });
    }

    setLoading(false);
  };

  const handleCheckout = async () => {
    setPaymentProofError("");

    if (!paymentProofUrl.trim()) {
      setPaymentProofError("Bukti pembayaran wajib diisi sebelum checkout.");
      return;
    }

    try {
      setLoading(true);

      const transactionData = {
        eventId: event.id,
        totalPrice: discountInfo ? discountInfo.finalPrice : event.price,
        paymentMethod,
        paymentProof: paymentProofUrl,
        voucherUsed: !!discountInfo,
      };

      const result = await createTransaction(transactionData);

      alert("✅ Transaksi berhasil dibuat!");
      console.log("Transaction result:", result);

      onClose();
    } catch (err) {
      console.error("Gagal membuat transaksi:", err);
      alert((err as Error).message || "Terjadi kesalahan saat transaksi");
    } finally {
      setLoading(false);
    }
  };

  const currentPrice = discountInfo?.finalPrice ?? event?.price ?? 0;

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
            <div className="border border-[#2f2f2f] p-4 bg-[#181818] rounded-lg">
              <p className="font-semibold text-lg text-[#9d4edd]">
                {event?.title ?? "Tanpa Judul"}
              </p>
              <p className="text-sm text-gray-400">{event?.location ?? "-"}</p>
              <p className="text-sm text-gray-500">
                Harga: Rp {(event?.price ?? 0).toLocaleString("id-ID")}
              </p>
            </div>

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
                    <p className="font-semibold text-[#9d4edd]">Berlaku sampai</p>
                    <p>{formatDate(event.Voucher.validUntil?.toString())}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
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
              {error && (
                <p className="text-red-400 text-sm min-h-[1.5rem]">{error}</p>
              )}
            </div>

            {discountInfo && (
              <div className="p-3 bg-[#1b1b1b] border border-[#3a2a50] rounded-lg">
                <p className="text-[#b891f9] font-semibold">Voucher valid</p>
                <p>Diskon: {discountInfo.discount ?? 0}%</p>
                <p>
                  Harga akhir:{" "}
                  <strong>
                    Rp {(discountInfo.finalPrice ?? 0).toLocaleString("id-ID")}
                  </strong>
                </p>
              </div>
            )}

            {/* PAYMENT METHOD */}
            <label className="text-sm text-gray-300">
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

            {/* Bukti Pembayaran */}
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
                  if (e.target.value.trim()) {
                    setPaymentProofError("");
                  }
                }}
              />
              {paymentProofError && (
                <p className="text-red-400 text-sm">{paymentProofError}</p>
              )}
            </div>

            {/* Total dan Checkout */}
            <div className="flex justify-between items-center border-t border-[#2a2a2a] pt-4">
              <span className="font-semibold text-lg text-gray-300">
                Total:
              </span>
              <span className="font-bold text-2xl text-[#b891f9]">
                Rp {(currentPrice ?? 0).toLocaleString("id-ID")}
              </span>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-[#7f5af0] hover:bg-[#9d4edd] text-white font-bold transition-all rounded-lg"
            >
              {loading ? "Memproses..." : "Buy Ticket"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
