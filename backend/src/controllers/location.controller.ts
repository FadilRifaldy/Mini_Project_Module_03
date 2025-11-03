import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";

// Get all unique locations
export const getAllLocations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const locations = await prisma.event.findMany({
      distinct: ["location"],
      select: { location: true },
      orderBy: { location: "asc" },
    });

    res.status(200).json({
      message: "List of all locations",
      result: locations.map((loc) => loc.location),
    });
  } catch (error) {
    next(error);
  }
};

// get event by location
export const getEventsByLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const location = req.params.location;
    const search = req.query.search as string | undefined;

    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    const events = await prisma.event.findMany({
      where: {
        location: { contains: location, mode: "insensitive" }, // gunakan contains
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { content: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: [{ startDate: "asc" }, { endDate: "asc" }],
    });

    res.status(200).json({
      message: `Events filtered by location '${location}'`,
      result: events,
    });
  } catch (error) {
    next(error);
  }
};