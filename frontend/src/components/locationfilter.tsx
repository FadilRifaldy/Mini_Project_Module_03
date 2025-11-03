"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

interface LocationSelectProps {
  locations: string[];
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
}

export function LocationSelect({
  locations,
  selectedLocation,
  setSelectedLocation,
}: LocationSelectProps) {
  return (
    <div className="flex justify-center font-audiowide">
      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
        <SelectTrigger
          className="text-[#E5E5E5] !h-13.5 w-48 bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg shadow-[0_0_3px_#6f00ff]
                     flex items-center gap-2 px-3 cursor-pointer transition-all duration-200
                     focus:border-[#5865F2] focus:ring-2 focus:ring-[#6f00ff] hover:border-[#6f00ff]/60"
        >
          <Image
            src="/images/location.png"
            alt="icon"
            width={20}
            height={20}
            className="object-contain invert brightness-150"
          />
          <SelectValue placeholder="All Locations" />
        </SelectTrigger>

        <SelectContent className="bg-[#1A1A1A] border border-[#2D2D2D] text-[#E5E5E5] rounded-md shadow-lg">
          {locations.map((loc) => (
            <SelectItem
              key={loc}
              value={loc}
              className="hover:bg-[#C000FF]/20 hover:text-[#6f00ff] cursor-pointer transition-colors duration-150"
            >
              {loc}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
