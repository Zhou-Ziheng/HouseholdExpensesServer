import mongoose from "mongoose";
import { familyMemberSchema } from "./family-member.js";
import Joi from "joi";

const { Schema } = mongoose;

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
    admins: [{ type: Schema.Types.ObjectId, ref: "FamilyMember" }],
    familyMembers: [{ type: Schema.Types.ObjectId, ref: "FamilyMember" }],
  })
);

function validateFamily(family) {
  const schema = Joi.object({
    familyName: Joi.string().required(),
    admins: Joi.array().items(Joi.string()),
    familyMemberIds: Joi.array().items(Joi.string()),
    totalAllowance: Joi.number(),
  });

  const result = schema.validate(family);
  return result;
}

export { validateFamily as validate };
