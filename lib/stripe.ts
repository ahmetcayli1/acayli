import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export const CONSULTING_PACKAGE = {
  name: 'Danışmanlık Paketi',
  description: 'Full access to all university match results',
  listPrice: parseInt(process.env.CONSULTING_PACKAGE_LIST_PRICE || '239900'), // $2399.00
  price: parseInt(process.env.CONSULTING_PACKAGE_PRICE || '86364'), // $863.64
  discount: parseInt(process.env.CONSULTING_PACKAGE_DISCOUNT || '64'), // 64%
  currency: 'usd',
}
