import React from 'react';
import { LineItem } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
  readOnly?: boolean;
  startIndex?: number;
}

const LineItemsTable: React.FC<Props> = ({ items, onChange, readOnly = false, startIndex = 0 }) => {

  const handleItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    if (readOnly) return;
    const newItems = items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange(newItems);
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 0,
      unitPrice: 0,
    };
    onChange([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (readOnly) return;
    if (items.length <= 1) return; 
    onChange(items.filter(item => item.id !== id));
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  return (
    <div className="mt-6 mb-6">
      <table className="w-full border-collapse border border-black text-sm">
        <thead>
          <tr className="bg-gray-300 font-bold text-gray-900">
            <th className="border border-black p-2 w-12 text-center">No</th>
            <th className="border border-black p-2 text-left">Description Of Materials/ Services/ Reasons</th>
            <th className="border border-black p-2 w-24 text-center">Quantity</th>
            <th className="border border-black p-2 w-32 text-right">Unit Price</th>
            <th className="border border-black p-2 w-32 text-right">Amount (RM)</th>
            {!readOnly && <th className="border border-black p-2 w-10 bg-white border-none"></th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="border border-black p-2 text-center">{startIndex + index + 1}</td>
              <td className="border border-black p-0">
                {readOnly ? (
                   <div className="p-2 min-h-[2rem]">{item.description}</div>
                ) : (
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    className="w-full h-full p-2 outline-none bg-transparent"
                  />
                )}
              </td>
              <td className="border border-black p-0">
                {readOnly ? (
                   <div className="p-2 text-center">{item.quantity || ''}</div>
                ) : (
                  <input
                    type="number"
                    min="0"
                    value={item.quantity || ''}
                    onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-full h-full p-2 text-center outline-none bg-transparent"
                  />
                )}
              </td>
              <td className="border border-black p-0">
                {readOnly ? (
                   <div className="p-2 text-right">{item.unitPrice ? item.unitPrice.toFixed(2) : ''}</div>
                ) : (
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice || ''}
                    onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-full h-full p-2 text-right outline-none bg-transparent"
                  />
                )}
              </td>
              <td className="border border-black p-2 text-right font-mono bg-gray-50">
                {(item.quantity * item.unitPrice).toFixed(2)}
              </td>
              {!readOnly && (
                <td className="border-0 p-1 text-center bg-white">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Remove Row"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
        {!readOnly && (
            <tfoot>
              <tr className="bg-gray-300 font-bold text-gray-900">
                <td colSpan={4} className="border border-black p-2 text-right uppercase">Total</td>
                <td className="border border-black p-2 text-right">{totalAmount.toFixed(2)}</td>
                <td className="border-0 bg-white"></td>
              </tr>
            </tfoot>
        )}
      </table>
      
      {!readOnly && (
        <div className="mt-2">
          <button
            onClick={addItem}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <Plus size={16} /> Add Row
          </button>
        </div>
      )}
    </div>
  );
};

export default LineItemsTable;