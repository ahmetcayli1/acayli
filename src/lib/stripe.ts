import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

export const STRIPE_CONFIG = {
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  priceAmount: parseInt(process.env.FULL_UNLOCK_PRICE_USD || '86364'),
  listPrice: parseInt(process.env.LIST_PRICE_USD || '239900'),
  discountPercent: parseInt(process.env.DISCOUNT_PERCENT || '64'),
  currency: 'usd',
}
