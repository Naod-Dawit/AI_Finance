import mongoose, { Schema, model, Document } from "mongoose";

const ExpensesSchema = new Schema({
  monthlyExpenses: [
    {
      month: { type: String },
      userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
      Housing: { type: Number, required: true },
      Transportation: {
        mode: { type: String, enum: ["public", "personal"], required: true },
        cost: {
          type: Number,
          validate: {
            validator: function (this: any) {
              return this.mode === "public" ? this.cost > 0 : true;
            },
            message: "Cost is required if transportation mode is public",
          },
        },
        carPayment: { type: Number },
        insurance: {
          type: Number,
          validate: {
            validator: function (this: any) {
              return this.mode === "personal" ? this.insurance > 0 : true;
            },
            message: "Insurance is required if transportation mode is personal",
          },
        },
      },
      Monthly_saving_Goal: { type: Number },
      food: { type: Number, required: true },
      customExpenses: [
        {
          title: String,
          amount: Number,
          date: { type: Date, default: Date.now },
        },
      ],
      ExpensePercentage: { type: Schema.Types.Mixed },
    },
  ],
});

const Expenses = model("expenses", ExpensesSchema);
export default Expenses;
