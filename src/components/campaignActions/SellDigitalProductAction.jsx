import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

const SellDigitalProductAction = ({ onSave }) => {
  const [productImage, setProductImage] = useState(null);
  const [productAmount, setProductAmount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [productFile, setProductFile] = useState(null);
  const [isCustomAmount, setIsCustomAmount] = useState(false);

  const handleSave = () => {
    onSave({ productImage, productAmount, quantity, productFile, isCustomAmount });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <ShoppingCart className="mr-2 text-purple-500" />
        Sell Digital Product Details</h3>
      <div className="flex items-center mb-2">
        <input
          className="w-full p-2 mr-2 border rounded"
          type={isCustomAmount ? "text" : "number"}
          placeholder="Product amount"
          value={productAmount}
          onChange={(e) => setProductAmount(e.target.value)}
          disabled={isCustomAmount}
        />
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isCustomAmount}
            onChange={(e) => setIsCustomAmount(e.target.checked)}
          />
          <span className="ml-2">Custom amount</span>
        </label>
      </div>
      <input
        className="w-full p-2 mb-2 border rounded"
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <input
        className="w-full p-2 mb-2 border rounded"
        type="file"
        onChange={(e) => setProductFile(e.target.files[0])}
      />
      <button
        className="w-full p-2 bg-blue-500 text-white rounded"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};

export default SellDigitalProductAction;
