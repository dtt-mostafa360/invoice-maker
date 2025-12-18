
export interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
}

export interface BankDetails {
  beneficiaryName: string;
  accountNumber: string;
  swiftNumber: string;
  beneficiaryAddress: string;
  bankName: string;
  bankAddress: string;
}

export interface InvoiceData {
  senderName: string;
  senderAddress: string;
  billToName: string;
  billToAddress: string;
  invoiceNumber: string;
  dueDate: string;
  bankDetails: BankDetails;
  items: InvoiceItem[];
}

export const INITIAL_DATA: InvoiceData = {
  senderName: 'MD Gulam Mostafa',
  senderAddress: '59/C, 4th Floor\nNorth Dhanmondi Road\nKalabagan, Dhaka 1205',
  billToName: 'DTT360 Media LLC',
  billToAddress: '30 N Gould St Ste R\nSheridan, WY\n82801-6317, US',
  invoiceNumber: '100298',
  dueDate: '25 Sep 2025',
  bankDetails: {
    beneficiaryName: 'Md Gulam Mostafa',
    accountNumber: '2053339520001',
    swiftNumber: 'BRAKBDDH',
    beneficiaryAddress: '59/C, 4th Floor, North Dhanmondi Road, Kalabagan, Dhaka 1205',
    bankName: 'BRAC Bank PLC',
    bankAddress: '107 Motijheel C/A, Dhaka 1000',
  },
  items: [
    {
      id: '1',
      description: 'Advertising Bill for June 2025',
      qty: 1,
      unitPrice: 60000.0,
    },
  ],
};
