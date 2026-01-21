import React, { useState, useEffect } from 'react';
import { WorkData, PricingData } from '../types';
import { pricingService } from '../services/api';

interface WorkEntryFormProps {
  onAdd: (workData: WorkData) => void;
}

const WorkEntryForm: React.FC<WorkEntryFormProps> = ({ onAdd }) => {
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [category, setCategory] = useState<'taklob' | 'lawas'>('taklob');
  const [subcategory, setSubcategory] = useState<string>('');
  const [size, setSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const data = await pricingService.getPricing();
        setPricingData(data);
      } catch (error) {
        console.error('Error fetching pricing:', error);
      }
    };
    fetchPricing();
  }, []);

  useEffect(() => {
    if (pricingData && category && subcategory && size) {
      let itemPrice = 0;
      
      if (category === 'taklob' && subcategory && pricingData.taklob[subcategory as keyof typeof pricingData.taklob]) {
        itemPrice = pricingData.taklob[subcategory as keyof typeof pricingData.taklob][size] || 0;
      } else if (category === 'lawas' && subcategory && pricingData.lawas[subcategory as keyof typeof pricingData.lawas]) {
        itemPrice = pricingData.lawas[subcategory as keyof typeof pricingData.lawas][size] || 0;
      } else if (pricingData.additional[size]) {
        itemPrice = pricingData.additional[size];
      }
      
      setPrice(itemPrice);
    }
  }, [category, subcategory, size, pricingData]);

  const handleCategoryChange = (newCategory: 'taklob' | 'lawas') => {
    setCategory(newCategory);
    setSubcategory('');
    setSize('');
    setPrice(0);
  };

  const handleSubcategoryChange = (newSubcategory: string) => {
    setSubcategory(newSubcategory);
    setSize('');
    setPrice(0);
  };

  const handleSizeChange = (newSize: string) => {
    setSize(newSize);
  };

  const handleAdd = () => {
    if (size && quantity > 0 && price > 0) {
      onAdd({
        category,
        subcategory: subcategory || undefined,
        size,
        quantity,
        price
      });
      
      setSize('');
      setQuantity(1);
      setPrice(0);
    }
  };

  const getSubcategories = () => {
    if (category === 'taklob') {
      return Object.keys(pricingData?.taklob || {});
    } else if (category === 'lawas') {
      return Object.keys(pricingData?.lawas || {});
    }
    return [];
  };

  const getSizes = () => {
    if (category === 'taklob' && subcategory && pricingData?.taklob[subcategory as keyof typeof pricingData.taklob]) {
      return Object.keys(pricingData.taklob[subcategory as keyof typeof pricingData.taklob]);
    } else if (category === 'lawas' && subcategory && pricingData?.lawas[subcategory as keyof typeof pricingData.lawas]) {
      return Object.keys(pricingData.lawas[subcategory as keyof typeof pricingData.lawas]);
    } else if (pricingData?.additional) {
      return Object.keys(pricingData.additional);
    }
    return [];
  };

  const getAdditionalItems = () => {
    return pricingData?.additional ? Object.keys(pricingData.additional) : [];
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Add Work Entry</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => handleCategoryChange('taklob')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                category === 'taklob'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Taklob
            </button>
            <button
              type="button"
              onClick={() => handleCategoryChange('lawas')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                category === 'lawas'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Lawas
            </button>
          </div>
        </div>

        {category && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategory
            </label>
            <select
              value={subcategory}
              onChange={(e) => handleSubcategoryChange(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            >
              <option value="">Select subcategory</option>
              {getSubcategories().map(sub => (
                <option key={sub} value={sub}>
                  {sub.charAt(0).toUpperCase() + sub.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size / Item
          </label>
          <select
            value={size}
            onChange={(e) => handleSizeChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          >
            <option value="">Select size/item</option>
            {getSizes().map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Items
          </label>
          <select
            value={size}
            onChange={(e) => handleSizeChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          >
            <option value="">Select additional item</option>
            {getAdditionalItems().map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              min="1"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per Unit
            </label>
            <input
              type="number"
              value={price}
              readOnly
              className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm border p-2"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-gray-700">
            Total: ₱{(price * quantity).toFixed(2)}
          </div>
          
          <button
            onClick={handleAdd}
            disabled={!size || quantity <= 0 || price <= 0}
            className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Add Work Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkEntryForm;
