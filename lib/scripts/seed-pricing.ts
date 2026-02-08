import connectDB from '@/lib/mongodb'
import PricingPlan from '@/lib/models/PricingPlan'

/**
 * Seed script originating pricing plans database
 * Run with: npx ts-node --project tsconfig.json lib/scripts/seed-pricing.ts
 * Or add to package.json scripts: "seed:pricing": "npx tsx lib/scripts/seed-pricing.ts"
 */

const pricingPlans = [
    // COUNT packages
    { code: "C-PROMO-01", type: "count", count: 22000, price: 5.00, priceDisplay: "$5.00", validity: "1d", validityDays: 1, recognition: "Image", isPromo: true, sortOrder: 1 },
    { code: "C-PROMO-02", type: "count", count: 30000, price: 6.00, priceDisplay: "$6.00", validity: "1d", validityDays: 1, recognition: "Image", isPromo: true, sortOrder: 2 },
    { code: "C01", type: "count", count: 50000, price: 10.00, priceDisplay: "$10.00", validity: "30d", validityDays: 30, recognition: "Image", isPromo: false, sortOrder: 3 },
    { code: "C01A", type: "count", count: 150000, price: 30.00, priceDisplay: "$30.00", validity: "30d", validityDays: 30, recognition: "Image", isPromo: false, sortOrder: 4 },
    { code: "C02", type: "count", count: 200000, price: 49.00, priceDisplay: "$49.00", validity: "30d", validityDays: 30, recognition: "Image", isPromo: false, sortOrder: 5 },
    { code: "C03", type: "count", count: 400000, price: 99.00, priceDisplay: "$99.00", validity: "30d", validityDays: 30, recognition: "Image", isPromo: false, sortOrder: 6 },
    { code: "C04", type: "count", count: 1600000, price: 299.00, priceDisplay: "$299.00", validity: "30d", validityDays: 30, recognition: "Image", isPromo: false, sortOrder: 7 },
    { code: "C05", type: "count", count: 4600000, price: 999.00, priceDisplay: "$999.00", validity: "30d", validityDays: 30, recognition: "Image", isPromo: false, sortOrder: 8 },
    { code: "C06", type: "count", count: 12000000, price: 2499.00, priceDisplay: "$2499.00", validity: "30d", validityDays: 30, recognition: "Image", isPromo: false, sortOrder: 9 },
    { code: "C07", type: "count", count: 32000000, price: 5999.00, priceDisplay: "$5999.00", validity: "30d", validityDays: 30, recognition: "Image", isPromo: false, sortOrder: 10 },

    // DAILY packages
    { code: "D01", type: "daily", dailyLimit: 1000, price: 15.00, priceDisplay: "$15.00", validity: "30d", validityDays: 30, recognition: "Image", isPromo: false, sortOrder: 1 },
    { code: "D02", type: "daily", dailyLimit: 5000, price: 49.00, priceDisplay: "$49.00", validity: "30d", validityDays: 30, recognition: "Image", isPromo: false, sortOrder: 2 },
    { code: "D03", type: "daily", dailyLimit: 10000, price: 89.00, priceDisplay: "$89.00", validity: "30d", validityDays: 30, recognition: "Image", isPromo: false, sortOrder: 3 },
    { code: "D04", type: "daily", dailyLimit: 25000, price: 199.00, priceDisplay: "$199.00", validity: "30d", validityDays: 30, recognition: "Image", isPromo: false, sortOrder: 4 },
    { code: "D05", type: "daily", dailyLimit: 50000, price: 349.00, priceDisplay: "$349.00", validity: "30d", validityDays: 30, recognition: "Image", isPromo: false, sortOrder: 5 },

    // MINUTE packages
    { code: "M01", type: "minute", rateLimit: 10, price: 25.00, priceDisplay: "$25.00", validity: "30d", validityDays: 30, recognition: "Image", isPromo: false, sortOrder: 1 },
    { code: "M02", type: "minute", rateLimit: 30, price: 59.00, priceDisplay: "$59.00", validity: "30d", validityDays: 30, recognition: "Image", isPromo: false, sortOrder: 2 },
    { code: "M03", type: "minute", rateLimit: 60, price: 99.00, priceDisplay: "$99.00", validity: "30d", validityDays: 30, recognition: "Image", isPromo: false, sortOrder: 3 },
    { code: "M04", type: "minute", rateLimit: 120, price: 179.00, priceDisplay: "$179.00", validity: "30d", validityDays: 30, recognition: "Image", isPromo: false, sortOrder: 4 },
    { code: "M05", type: "minute", rateLimit: 300, price: 399.00, priceDisplay: "$399.00", validity: "30d", validityDays: 30, recognition: "Image", isPromo: false, sortOrder: 5 },
]

async function seedPricingPlans() {
    try {
        await connectDB()
        console.log('🔌 Connected to MongoDB')

        // Clear existing pricing plans (optional - comment out if you want to keep existing)
        await PricingPlan.deleteMany({})
        console.log('🗑️  Cleared existing pricing plans')

        // Insert new pricing plans
        const result = await PricingPlan.insertMany(pricingPlans)
        console.log(`✅ Inserted ${result.length} pricing plans`)

        // Log summary
        const countPlans = pricingPlans.filter(p => p.type === 'count').length
        const dailyPlans = pricingPlans.filter(p => p.type === 'daily').length
        const minutePlans = pricingPlans.filter(p => p.type === 'minute').length

        console.log('\n📊 Summary:')
        console.log(`   - Count packages: ${countPlans}`)
        console.log(`   - Daily packages: ${dailyPlans}`)
        console.log(`   - Minute packages: ${minutePlans}`)
        console.log(`   - Total: ${pricingPlans.length}`)

        process.exit(0)
    } catch (error) {
        console.error('❌ Error seeding pricing plans:', error)
        process.exit(1)
    }
}

// Run if called directly
seedPricingPlans()

export { pricingPlans, seedPricingPlans }
