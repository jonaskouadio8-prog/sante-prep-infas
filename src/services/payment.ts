import { PaymentOperator } from '../types';

export class PaymentService {
  private static readonly PREMIUM_PRICE = 5000;
  private static readonly MERCHANT_ACCOUNTS: Record<PaymentOperator, string> = {
    ORANGE: '0715431667',
    MTN: '0595158016',
    MOOV: '0170214554',
    WAVE: '0595158016'
  };

  public static getMerchantNumber(operator: PaymentOperator): string {
    return this.MERCHANT_ACCOUNTS[operator];
  }

  public static getPriceFormatted(): string {
    return `${this.PREMIUM_PRICE.toLocaleString('fr-FR')} FCFA / an`;
  }

  public static getOperatorDetails(operator: PaymentOperator): string {
    const number = this.getMerchantNumber(operator);
    return `*${operator === 'ORANGE' ? '110' : operator === 'MTN' ? '111' : operator === 'MOOV' ? '112' : '113'}*${number}#`;
  }
}
