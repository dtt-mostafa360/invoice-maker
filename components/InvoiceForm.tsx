
import React from 'react';
import { InvoiceData, InvoiceItem } from '../types';

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      onChange({
        ...data,
        [parent]: {
          ...(data[parent as keyof InvoiceData] as object),
          [child]: value,
        },
      });
    } else {
      onChange({ ...data, [name]: value });
    }
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    const newItems = data.items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      qty: 1,
      unitPrice: 0,
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const removeItem = (id: string) => {
    onChange({ ...data, items: data.items.filter(i => i.id !== id) });
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
          <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
          General Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1">Invoice Number</label>
            <input 
              name="invoiceNumber" 
              value={data.invoiceNumber} 
              onChange={handleChange} 
              className="border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1">Due Date</label>
            <input 
              name="dueDate" 
              value={data.dueDate} 
              onChange={handleChange} 
              className="border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
          <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
          Sender & Recipient
        </h3>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1">Sender Name</label>
            <input 
              name="senderName" 
              value={data.senderName} 
              onChange={handleChange} 
              className="border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1">Sender Address</label>
            <textarea 
              name="senderAddress" 
              value={data.senderAddress} 
              onChange={handleChange} 
              className="border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1">Bill To Name</label>
            <input 
              name="billToName" 
              value={data.billToName} 
              onChange={handleChange} 
              className="border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1">Bill To Address</label>
            <textarea 
              name="billToAddress" 
              value={data.billToAddress} 
              onChange={handleChange} 
              className="border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24"
            />
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
          <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
          Bank Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data.bankDetails).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <label className="text-xs font-bold text-gray-500 uppercase mb-1">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input 
                name={`bankDetails.${key}`} 
                value={value} 
                onChange={handleChange} 
                className="border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-blue-900 flex items-center">
            <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
            Line Items
          </h3>
          <button 
            onClick={addItem}
            className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-semibold"
          >
            + Add Item
          </button>
        </div>
        <div className="space-y-4">
          {data.items.map((item, index) => (
            <div key={item.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
              <button 
                onClick={() => removeItem(item.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2 flex flex-col">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Description</label>
                  <input 
                    value={item.description} 
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    className="border border-gray-200 rounded-lg p-2 bg-white"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Qty</label>
                  <input 
                    type="number"
                    value={item.qty} 
                    onChange={(e) => handleItemChange(item.id, 'qty', parseFloat(e.target.value) || 0)}
                    className="border border-gray-200 rounded-lg p-2 bg-white"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Unit Price</label>
                  <input 
                    type="number"
                    value={item.unitPrice} 
                    onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="border border-gray-200 rounded-lg p-2 bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default InvoiceForm;
