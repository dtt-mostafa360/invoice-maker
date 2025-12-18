
import React, { useState, useCallback } from 'react';
import { InvoiceData, INITIAL_DATA } from './types';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import { extractInvoiceData } from './services/geminiService';

const App: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(INITIAL_DATA);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDataChange = useCallback((newData: InvoiceData) => {
    setInvoiceData(newData);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result?.toString().split(',')[1];
      if (base64) {
        try {
          const extracted = await extractInvoiceData(base64);
          // Merge with initial data to ensure required fields exist
          setInvoiceData(prev => ({
            ...prev,
            ...extracted,
            bankDetails: {
              ...prev.bankDetails,
              ...(extracted.bankDetails || {}),
            },
            // Mapping items correctly if they came in
            items: extracted.items?.map((it: any, idx: number) => ({
              id: Date.now() + idx + '',
              description: it.description || '',
              qty: it.qty || 1,
              unitPrice: it.unitPrice || 0,
            })) || prev.items
          }));
        } catch (err) {
          setError("Failed to extract data. Please fill it manually.");
          console.error(err);
        } finally {
          setIsProcessing(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">ProInvoice Designer</h1>
        </div>
        
        <div className="flex gap-4">
          <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all font-semibold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {isProcessing ? 'Processing AI...' : 'Import from Image'}
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isProcessing} />
          </label>
          <button 
            onClick={handlePrint}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md font-semibold flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Save PDF
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col lg:flex-row gap-8 p-8 max-w-[1800px] mx-auto w-full">
        {/* Editor Sidebar */}
        <aside className="w-full lg:w-[450px] flex-shrink-0 no-print">
          <div className="sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-700">Editor</h2>
              <button 
                onClick={() => setInvoiceData(INITIAL_DATA)}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                Reset to Default
              </button>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">
                {error}
              </div>
            )}
            <InvoiceForm data={invoiceData} onChange={handleDataChange} />
          </div>
        </aside>

        {/* Preview Area */}
        <section className="flex-grow flex justify-center bg-gray-200 rounded-3xl p-12 border-4 border-dashed border-gray-300 min-h-[600px] print:p-0 print:border-none print:bg-white overflow-x-auto">
          <div className="print-container">
            <InvoicePreview data={invoiceData} />
          </div>
        </section>
      </main>

      {/* Mobile Disclaimer */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 bg-yellow-50 border border-yellow-200 p-4 rounded-xl shadow-lg no-print z-50">
        <p className="text-yellow-800 text-sm font-medium">
          Note: This designer is best viewed on a larger screen for the full side-by-side editing experience.
        </p>
      </div>
    </div>
  );
};

export default App;
