import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import { Categories } from "../generated/prisma";

//get all categories
export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await prisma.event.findMany({
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    });

    const categoryList = categories.map((c) => c.category);

    res.status(200).json({
      message: "Success get all categories",
      result: categoryList,
    });
  } catch (error) {
    next(error);
  }
};

//get event by category
export const getEventsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = req.params.category as Categories;
    const search = req.query.search as string | undefined;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const events = await prisma.event.findMany({
      where: {
        category,
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { location: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: [{ startDate: "asc" }, { endDate: "asc" }],
    });

    res.status(200).json({
      message: `Events filtered by category '${category}'${
        search ? ` and search '${search}'` : ""
      }`,
      result: events,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEnumCategories = async (req: Request, res: Response) => {
  try {
    const categories = Object.values(Categories);
    res.status(200).json({ data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to load categories" });
  }
};
