import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import { Categories, PaymentMethod } from "../generated/prisma";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

interface UserJWTPayload extends JwtPayload {
  username: string;
  email: string;
  role: string;
  userId: string;
}

// create event + voucher
export const createEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authToken = req.cookies.authToken;
    if (!authToken) {
      return res
        .status(401)
        .json({ message: "Access Denied. No Token Provided" });
    }

    const user = jwt.verify(authToken, "rahasia") as UserJWTPayload;

    const createEvent = await prisma.event.create({
      data: {
        category: req.body.category,
        title: req.body.title,
        imgUrl: req.body.imgUrl,
        content: req.body.content,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        location: req.body.location,
        price: req.body.price,
        totalTickets: req.body.totalTickets,
        availableTickets: req.body.totalTickets, // otomatis sama dengan totalTickets
        Voucher:
          req.body.discount > 0
            ? {
                create: {
                  discount: req.body.discount,
                  quantity: req.body.quantity ?? 1,
                  validFrom: req.body.validFrom
                    ? new Date(req.body.validFrom)
                    : undefined,
                  validUntil: req.body.validUntil
                    ? new Date(req.body.validUntil)
                    : undefined,
                },
              }
            : undefined,
        userId: user.userId,
      },
      include: {
        Voucher: true, // agar response include voucher
      },
    });

    res.status(200).send({
      message: "Create event success",
      result: createEvent,
    });
  } catch (error) {
    next(error);
  }
};

//read all
// search debounce
export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const search = req.query.search as string;
    const pageSize = parseInt(req.query.pageSize as string) || undefined;

    const events = await prisma.event.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { content: { contains: search, mode: "insensitive" } },
              { location: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

// // Read all
// export const getAllEvents = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const createEvent = await prisma.event.create({
//       data: {
//         title: req.body.title,
//         imgUrl: req.body.imgUrl,
//         content: req.body.content,
//         date: new Date(req.body.date),
//         location: req.body.location,
//         price:req.body.price,
//         totalTickets:req.body.totalTickets,
//         availableTickets:req.body.availableTickets

//       },
//     });

//     res.status(200).send({
//       message: "Create event success",
//       result: createEvent,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// get event by id
export const getEventByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventDetail = await prisma.event.findUnique({
      where: {
        id: String(req.params.id),
      },
      include: {
        Voucher: true, // ✅ tambahkan ini
      },
    });

    if (!eventDetail) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: eventDetail,
    });
  } catch (error) {
    console.error("Error fetching event detail:", error);
    next(error);
  }
};

//     const events = await prisma.event.findMany({
//       where: search
//         ? {
//             OR: [
//               { title: { contains: search, mode: "insensitive" } },
//               // { content: { contains: search, mode: "insensitive" } },
//               // { location: { contains: search, mode: "insensitive" } },
//             ],
//           }
//         : {},
//     });

//Update
export const updateEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updateEvent = await prisma.event.update({
      where: { id: String(req.params.id) },
      data: req.body,
    });
    res.status(200).send({
      message: "Event updated",
      result: updateEvent,
    });
  } catch (error) {
    console.log(error);
  }
};

//Delete
export const deleteEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleteEvent = await prisma.event.delete({
      where: { id: String(req.params.id) },
    });
    res.status(200).send({
      message: "Event has been delete",
      result: deleteEvent,
    });
  } catch (error) {
    console.log(error);
  }
};

// get event by category AND location
export const getEventsByCategoryAndLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = req.params.category as Categories;
    const location = req.params.location;
    const search = req.query.search as string | undefined;

    if (!category || !location) {
      return res
        .status(400)
        .json({ message: "Category and location are required" });
    }

    const events = await prisma.event.findMany({
      where: {
        ...(category && { category }),
        ...(location &&
          location !== "All" && {
            location: { contains: location, mode: "insensitive" },
          }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: [{ startDate: "asc" }, { endDate: "asc" }],
    });

    res.status(200).json({
      message: `Events filtered by category '${category}' and location '${location}'`,
      result: events,
    });
  } catch (error) {
    next(error);
  }
};
