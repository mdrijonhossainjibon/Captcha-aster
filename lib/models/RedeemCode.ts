import mongoose, { Schema, Document } from 'mongoose'

export interface IRedeemCode extends Document {
    code: string
    credits: number
    maxUses: number
    usedCount: number
    expiresAt: Date | null
    isActive: boolean
    createdBy: mongoose.Types.ObjectId
    createdAt: Date
    usedBy: { userId: mongoose.Types.ObjectId; usedAt: Date }[]
}

const RedeemCodeSchema = new Schema<IRedeemCode>({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    credits: { type: Number, required: true, min: 1 },
    maxUses: { type: Number, default: 1, min: 1 },
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    usedBy: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        usedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true })

export default mongoose.models.RedeemCode || mongoose.model<IRedeemCode>('RedeemCode', RedeemCodeSchema)
