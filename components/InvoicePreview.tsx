
import React from 'react';
import { InvoiceData } from '../types';

interface InvoicePreviewProps {
  data: InvoiceData;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data }) => {
  const total = data.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const BLUE_HEADER = "bg-[#4a83bc]"; // The specific blue from the image
  const TEXT_BLUE = "text-[#4a83bc]";
  const BORDER_COLOR = "border-[#d1d5db]";

  return (
    <div className="bg-white p-12 w-[800px] min-h-[1030px] mx-auto shadow-xl flex flex-col font-sans text-gray-800 print:shadow-none print:p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className={`${TEXT_BLUE} text-2xl font-bold mb-2`}>{data.senderName}</h1>
          <div className="whitespace-pre-line text-sm leading-relaxed font-semibold">
            {data.senderAddress}
          </div>
        </div>
        <div className={`${TEXT_BLUE} text-7xl font-light tracking-wider opacity-90`}>
          INVOICE
        </div>
      </div>

      {/* Info Bars */}
      <div className="flex justify-between mb-8 gap-1">
        <div className="flex-grow">
          <div className={`${BLUE_HEADER} text-white text-sm font-bold px-4 py-1.5 uppercase`}>
            BILL TO
          </div>
          <div className="p-4 bg-white text-sm leading-relaxed min-h-[100px]">
            <div className="font-bold">{data.billToName}</div>
            <div className="whitespace-pre-line">{data.billToAddress}</div>
          </div>
        </div>
        <div className="w-[180px]">
          <div className={`${BLUE_HEADER} text-white text-sm font-bold px-4 py-1.5 uppercase`}>
            INVOICE #
          </div>
          <div className="p-4 text-center font-bold text-lg">
            {data.invoiceNumber}
          </div>
        </div>
        <div className="w-[180px]">
          <div className={`${BLUE_HEADER} text-white text-sm font-bold px-4 py-1.5 uppercase`}>
            DUE DATE
          </div>
          <div className="p-4 text-center font-bold text-lg">
            {data.dueDate}
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="mb-12">
        <div className={`${BLUE_HEADER} text-white text-sm font-bold px-4 py-1.5 uppercase w-fit min-w-[340px] mb-2`}>
          Beneficiary Bank Details
        </div>
        <div className="text-[13px] leading-6 px-1">
          <div><span className="font-bold">Beneficiary Name:</span> {data.bankDetails.beneficiaryName}</div>
          <div><span className="font-bold">Account Number:</span> {data.bankDetails.accountNumber}</div>
          <div><span className="font-bold">SWIFT Number:</span> {data.bankDetails.swiftNumber}</div>
          <div><span className="font-bold">Beneficiary Address:</span> {data.bankDetails.beneficiaryAddress}</div>
          <div><span className="font-bold">Bank Name:</span> {data.bankDetails.bankName}</div>
          <div><span className="font-bold">Bank Address:</span> {data.bankDetails.bankAddress}</div>
        </div>
      </div>

      {/* Items Table */}
      <div className="flex-grow">
        <div className="flex text-white font-bold text-[13px] uppercase">
          <div className={`${BLUE_HEADER} flex-grow px-4 py-1.5`}>DESCRIPTION</div>
          <div className={`${BLUE_HEADER} w-[80px] text-center border-l border-white py-1.5`}>QTY</div>
          <div className={`${BLUE_HEADER} w-[140px] text-center border-l border-white py-1.5`}>UNIT PRICE</div>
          <div className={`${BLUE_HEADER} w-[140px] text-center border-l border-white py-1.5`}>AMOUNT</div>
        </div>
        
        {data.items.map((item) => (
          <div key={item.id} className="flex border-b border-gray-300 text-[13px] font-medium">
            <div className="flex-grow px-4 py-2 border-l border-gray-300">{item.description}</div>
            <div className="w-[80px] text-center py-2 border-l border-gray-300">{item.qty}</div>
            <div className="w-[140px] text-right px-4 py-2 border-l border-gray-300">{formatCurrency(item.unitPrice)}</div>
            <div className="w-[140px] text-right px-4 py-2 border-l border-r border-gray-300 font-bold">{formatCurrency(item.qty * item.unitPrice)}</div>
          </div>
        ))}
        {/* Placeholder row matching image */}
        <div className="flex border-b border-gray-300 text-[13px]">
          <div className="flex-grow px-4 py-2 border-l border-gray-300">&nbsp;</div>
          <div className="w-[80px] py-2 border-l border-gray-300"></div>
          <div className="w-[140px] py-2 border-l border-gray-300"></div>
          <div className="w-[140px] text-right px-4 py-2 border-l border-r border-gray-300">-</div>
        </div>

        {/* Total Row */}
        <div className="flex mt-1">
          <div className="flex-grow flex items-center px-4 italic font-bold text-lg text-blue-500">
            Thank you for your business!
          </div>
          <div className={`${BLUE_HEADER} w-[220px] text-white font-bold text-xl py-2 px-4 flex justify-between`}>
            <span>TOTAL</span>
            <span>$</span>
          </div>
          <div className="w-[140px] bg-gray-100 flex items-center justify-end px-4 font-bold text-xl">
            {formatCurrency(total)}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-[13px] text-gray-600">
        If you have any questions about this invoice, please contact
      </div>
    </div>
  );
};

export default InvoicePreview;
