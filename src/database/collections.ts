import * as dotenv from 'dotenv';
dotenv.config();

export const COLLECTION_KEYS = {
  CLIENT: process.env.CLIENT_COLLECTION || 'clients',
  FREELANCE: process.env.FREELANCE_COLLECTION || 'freelances',
  CATEGORY: process.env.CATEGORY_COLLECTION || 'categories',
  USER: process.env.USER_COLLECTION || 'users',
  FAQ: process.env.FAQ_COLLECTION || 'faqs',
  CONTACT: process.env.CONTACT_COLLECTION || 'contacts',
  PAYMENT: process.env.PAYMENT_COLLECTION || 'payments',
  PRICING: process.env.PRICING_COLLECTION || 'pricings',
  TRANSACTION: process.env.TRADNSACTION_COLLECTION || 'transactions',
  PROJECT: process.env.PROJECT_COLLECTION || 'projects',
  MESSAGE: process.env.MESSAGE_COLLECTION || 'messages',
  PRODUCT: process.env.PRODUCT_COLLECTION || 'products',
};
