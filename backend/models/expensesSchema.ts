import mongoose, { Schema, model, Document } from "mongoose";


// interface IExpenes extends Document {
//   monthlyExpenses: any;
//   userId: mongoose.Schema.Types.ObjectId;
//   rent: number;
//   car_Payment: number;
//   Monthly_saving: number;
//   food: number;
//   others: number;
//   customExpenses: any;
// }


const ExpensesSchema = new Schema({
  monthlyExpenses: [
    {
      month: { type: String },
      userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
      rent: { type: Number, required: true },
      car_Payment: { type: Number },
      Monthly_saving: { type: Number },
      food: { type: Number, required: true },
      others: { type: Number },
      customExpenses: { type: Array },
      ExpensePercentage: { type:String||Number},
    },
  ],
});

const Expenses = model("expenses", ExpensesSchema);
export default Expenses;
