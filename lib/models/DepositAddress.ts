import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IDepositAddress extends Document {
    userId: mongoose.Types.ObjectId
    cryptoId: string
    networkId: string
    address: string
    isActive: boolean
    lastUsedAt?: Date
    createdAt: Date
    updatedAt: Date
}

const DepositAddressSchema: Schema<IDepositAddress> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        cryptoId: {
            type: String,
            required: true,
        },
        networkId: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
            unique: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastUsedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
)

// Compound index for user-specific crypto/network lookups
DepositAddressSchema.index({ userId: 1, cryptoId: 1, networkId: 1 }, { unique: true })

// Prevent model recompilation in development
const DepositAddress: Model<IDepositAddress> =
    mongoose.models.DepositAddress || mongoose.model<IDepositAddress>('DepositAddress', DepositAddressSchema)

export default DepositAddress
