import { BadRequestError } from "../../core/ApiErrors";
import Category from "../../database/models/Category";

export const checkCatForDuplicate = async (name: string, greekName: string) => {
  const nameExists = await Category.find({ name: name });
  const greekNameExists = await Category.find({ greekName: greekName });

  if (nameExists) throw new BadRequestError("English name already exists.");
  if (greekNameExists) throw new BadRequestError("Greek name already exists.");
};
