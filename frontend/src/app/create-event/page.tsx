"use client";

import { useEffect, useState } from "react";
import { createEvent, IEvent, fetchEnumCategories } from "@/lib/backend";
import Image from "next/image";

type CreateEventData = Omit<IEvent, "id" | "createdAt" | "updatedAt"> & {
  validFrom?: string;
  validUntil?: string;
};

export default function CreateEventPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [isFree, setIsFree] = useState(false);
  const [formData, setFormData] = useState<CreateEventData>({
    category: "",
    title: "",
    imgUrl: "",
    content: "",
    startDate: "",
    endDate: "",
    location: "",
    price: 0,
    totalTickets: 0,
    availableTickets: 0,
    discount: 0,
    quantity: 1,
    validFrom: "",
    validUntil: "",
  });

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchEnumCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (
      [
        "price",
        "totalTickets",
        "availableTickets",
        "discount",
        "quantity",
      ].includes(name)
    ) {
      if (/^\d*\.?\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value === "" ? 0 : Number(value) });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleToggleFree = () => {
    setIsFree(!isFree);
    setFormData({ ...formData, price: !isFree ? 0 : formData.price });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const createdEvent: IEvent = await createEvent(formData);
      alert("Event created successfully!");
      console.log("Created Event:", createdEvent);

      setFormData({
        category: "",
        title: "",
        imgUrl: "",
        content: "",
        startDate: "",
        endDate: "",
        location: "",
        price: 0,
        totalTickets: 0,
        availableTickets: 0,
        discount: 0,
        quantity: 1,
        validFrom: "",
        validUntil: "",
      });
      setIsFree(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    }
  };

  return (
    <div className="relative font-audiowide min-h-screen flex items-center justify-center text-[#e0e0ff] p-10 overflow-hidden">
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/banner-event.jpg"
          alt="Event background"
          fill
          className="object-cover object-center brightness-75"
          priority
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/100 via-black/80 to-black/100 -z-10"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 max-w-5xl p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <h1 className="font-orbitron col-span-1 sm:col-span-2 lg:col-span-3 text-4xl font-extrabold text-center text-white mb-6">
          Create Event
        </h1>

        <div>
          <label className="text-sm text-[#8a8aff] uppercase tracking-wider">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full mt-2 p-3 bg-[#1a1635]/90 border border-[#6f00ff] rounded-lg focus:ring-2 focus:ring-[#ff00ff] text-[#e0e0ff]"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-[#8a8aff] uppercase tracking-wider">
            Title
          </label>
          <input
            name="title"
            placeholder="Enter title"
            value={formData.title}
            onChange={handleChange}
            className="w-full mt-2 p-3 bg-[#1a1635] border border-[#6f00ff] rounded-lg focus:ring-2 focus:ring-[#6f00ff] text-[#e0e0ff]"
            required
          />
        </div>

        <div>
          <label className="text-sm text-[#8a8aff] uppercase tracking-wider">
            Image URL
          </label>
          <input
            name="imgUrl"
            placeholder="https://..."
            value={formData.imgUrl}
            onChange={handleChange}
            className="w-full mt-2 p-3 bg-[#1a1635] border border-[#6f00ff] rounded-lg focus:ring-2 focus:ring-[#ff00ff] text-[#e0e0ff]"
          />
        </div>

        <div>
          <label className="text-sm text-[#8a8aff] uppercase tracking-wider">
            Location
          </label>
          <input
            name="location"
            placeholder="Event location"
            value={formData.location}
            onChange={handleChange}
            className="w-full mt-2 p-3 bg-[#1a1635] border border-[#6f00ff] rounded-lg focus:ring-2 focus:ring-[#ff00ff] text-[#e0e0ff]"
            required
          />
        </div>

        <div>
          <label className="text-sm text-[#8a8aff] uppercase tracking-wider">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full mt-2 p-3 bg-[#1a1635] border border-[#6f00ff] rounded-lg focus:ring-2 focus:ring-[#ff00ff] text-[#e0e0ff]"
            required
          />
        </div>

        <div>
          <label className="text-sm text-[#8a8aff] uppercase tracking-wider">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full mt-2 p-3 bg-[#1a1635] border border-[#6f00ff] rounded-lg focus:ring-2 focus:ring-[#ff00ff] text-[#e0e0ff]"
            required
          />
        </div>

        <div>
          <label className="text-sm text-[#8a8aff] uppercase tracking-wider">
            Price (IDR)
          </label>
          <input
            type="text"
            name="price"
            placeholder="Enter price"
            value={formData.price === 0 ? "" : formData.price}
            onChange={handleChange}
            disabled={isFree}
            className={`w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-[#ff00ff] ${
              isFree
                ? "bg-[#2a2747] text-gray-400 border-[#555]"
                : "bg-[#1a1635] border-[#6f00ff] text-[#e0e0ff]"
            }`}
          />
          <div className="flex items-center gap-2 mt-2">
            <input
              id="isFree"
              type="checkbox"
              checked={isFree}
              onChange={handleToggleFree}
              className="w-4 h-4 accent-[#ff00ff]"
            />
            <label htmlFor="isFree" className="text-[#b0b0ff]">
              Free Event
            </label>
          </div>
        </div>

        <div>
          <label className="text-sm text-[#8a8aff] uppercase tracking-wider">
            Total Tickets
          </label>
          <input
            type="text"
            name="totalTickets"
            placeholder="Total tickets"
            value={formData.totalTickets === 0 ? "" : formData.totalTickets}
            onChange={handleChange}
            className="w-full mt-2 p-3 bg-[#1a1635] border border-[#6f00ff] rounded-lg focus:ring-2 focus:ring-[#ff00ff] text-[#e0e0ff]"
            required
          />
        </div>

        <div>
          <label className="text-sm text-[#8a8aff] uppercase tracking-wider">
            Voucher Discount (%)
          </label>
          <input
            type="text"
            name="discount"
            placeholder="Enter discount"
            value={formData.discount === 0 ? "" : formData.discount}
            onChange={handleChange}
            className="w-full mt-2 p-3 bg-[#1a1635] border border-[#6f00ff] rounded-lg focus:ring-2 focus:ring-[#ff00ff] text-[#e0e0ff]"
          />
        </div>

        <div>
          <label className="text-sm text-[#8a8aff] uppercase tracking-wider">
            Voucher Quantity
          </label>
          <input
            type="text"
            name="quantity"
            placeholder="Enter quantity"
            value={formData.quantity === 0 ? "" : formData.quantity}
            onChange={handleChange}
            className="w-full mt-2 p-3 bg-[#1a1635] border border-[#6f00ff] rounded-lg focus:ring-2 focus:ring-[#ff00ff] text-[#e0e0ff]"
          />
        </div>

        <div>
          <label className="text-sm text-[#8a8aff] uppercase tracking-wider">
            Voucher Valid From
          </label>
          <input
            type="datetime-local"
            name="validFrom"
            value={formData.validFrom || ""}
            onChange={handleChange}
            className="w-full mt-2 p-3 bg-[#1a1635] border border-[#6f00ff] rounded-lg focus:ring-2 focus:ring-[#ff00ff] text-[#e0e0ff]"
          />
        </div>

        <div>
          <label className="text-sm text-[#8a8aff] uppercase tracking-wider">
            Voucher Valid Until
          </label>
          <input
            type="datetime-local"
            name="validUntil"
            value={formData.validUntil || ""}
            onChange={handleChange}
            className="w-full mt-2 p-3 bg-[#1a1635] border border-[#6f00ff] rounded-lg focus:ring-2 focus:ring-[#ff00ff] text-[#e0e0ff]"
          />
        </div>

        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <label className="text-sm text-[#8a8aff] uppercase tracking-wider">
            Content
          </label>
          <textarea
            name="content"
            placeholder="Describe your event..."
            value={formData.content}
            onChange={handleChange}
            className="w-full mt-2 p-3 bg-[#1a1635] border border-[#6f00ff] rounded-lg focus:ring-2 focus:ring-[#6f00ff] text-[#e0e0ff] h-24"
          />
        </div>
        <button
          type="submit"
          className="col-span-1 sm:col-span-2 lg:col-span-3 mt-6 bg-[#6f00ff] text-black py-3 rounded-xl font-bold text-lg cursor-pointer hover:scale-101 hover:shadow-[0_0_20px_#6f00ff] transition-all duration-300"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}
