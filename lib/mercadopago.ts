import { MercadoPagoConfig, Payment } from 'mercadopago';

const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || '';
console.log('🔑 MP Token loaded ending in:', accessToken.slice(-4));

export const mpConfig = new MercadoPagoConfig({
  accessToken,
  options: { timeout: 5000 }
});

export const paymentClient = new Payment(mpConfig);
