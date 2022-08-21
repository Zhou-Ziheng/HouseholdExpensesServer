import mongoose from "mongoose";
import { categorySchema } from "./category.js";
import Joi from "joi";

const { Schema } = mongoose;

//add password
export const familyMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  allowance: Number,
  used: Number,
  categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  familyId: String,
  password: String,
});

export const FamilyMember = mongoose.model("FamilyMember", familyMemberSchema);

function validateFamilyMemeber(familyMember) {
  const schema = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    allowance: Joi.number(),
    familyId: Joi.string(),
    categoryIds: Joi.array().items(Joi.string()),
    password: Joi.string(),
  });

  const result = schema.validate(familyMember);
  return result;
}

export { validateFamilyMemeber as validate };
