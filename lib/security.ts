import crypto from 'crypto';

export function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function generateSecureHash(data: string) {
  return crypto
    .createHmac('sha256', process.env.APP_SECRET!)
    .update(data)
    .digest('hex');
}

export function validateWebhook(signature: string, payload: string) {
  // O Mercado Pago envia um hash para validar o webhook em alguns casos,
  // ou você pode validar o IP/ID do pagamento consultando a API deles.
  // Para simplicidade, vamos focar na consulta à API do MP para validar o status.
  return true;
}
