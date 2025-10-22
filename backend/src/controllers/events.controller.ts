import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";


//Create
export const createEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createEvent = await prisma.event.create({
      data: {
        title: req.body.title,
        imgUrl: req.body.imgUrl,
        content: req.body.content,
        date: new Date(req.body.date),
        location: req.body.location,
        price:req.body.price,
        totalTickets:req.body.totalTickets,
        availableTickets:req.body.availableTickets

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

//read
// search debounce
export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = req.query.search as string;

    const events = await prisma.event.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              // { content: { contains: search, mode: "insensitive" } },
              // { location: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
    });

    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};


//Read
// export const getEvents = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const getAll = await prisma.event.findMany();

//     res.status(200).send(getAll);
//   } catch (error) {
//     next(error);
//   }
// };


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