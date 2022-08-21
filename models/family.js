import mongoose from "mongoose";
import { familyMemberSchema } from "./family-member.js";
import Joi from "joi";

//add admins
export const Family = mongoose.model(
  "Family",
  new mongoose.Schema({
    familyName: {
      type: String,
      required: true,
    },
    totalAllowance: Number,
    totalUsed: Number,
    admins: [familyMemberSchema],
    familyMembers: [familyMemberSchema],
  })
);

function validateFamily(family) {
  const schema = Joi.object({
    familyName: Joi.string().required(),
    admins: Joi.array().items(Joi.string()),
    familyMemberIds: Joi.array().items(Joi.string()),
  });

  const result = schema.validate(family);
  return result;
}

export { validateFamily as validate };
