import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const planSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Plan price is required'],
      min: 0,
    },
    features: {
      type: [String],
      default: [],
    },
    // Subscription length in days; used to compute the subscription end date.
    duration: {
      type: Number,
      required: [true, 'Plan duration (in days) is required'],
      min: 1,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Plan = model('Plan', planSchema);
