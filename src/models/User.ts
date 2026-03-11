import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    fullName: string;
    email: string;
    phone: string;
    password: string; // Ideally hashed
    role: "customer" | "staff" | "admin";
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["customer", "staff", "admin"],
            default: "customer"
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
