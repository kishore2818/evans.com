import API_BASE_URL from '@/config/api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from '@/router-shim';
import { Package, Save, Shield, Edit2, Eye, EyeOff, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error('Unauthorized Access');
      navigate('/admin/login');
      return;
    }
    fetchProducts(token);
  }, [navigate]);

  const fetchProducts = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      } else {
        toast.error('Failed to load products');
      }
    } catch (error) {
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (productId, currentProductData) => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(currentProductData)
      });
      if (response.ok) {
        toast.success('Product updated successfully!');
        fetchProducts(token);
      } else {
        toast.error('Update failed');
      }
    } catch (error) {
      toast.error('Server error');
    }
  };

  const updateLocalState = (id, field, value) => {
    setProducts(products.map(p => p._id === id ? { ...p, [field]: value } : p));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-purple-900 font-serif">Loading Protocol...</div>;
  }

  return (
    <div className="min-h-screen bg-beige-50 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Shield className="text-purple-700 w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-purple-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage Store Inventory & Status</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-beige-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-purple-50 text-purple-900 border-b border-purple-100">
                  <th className="p-4 font-semibold text-sm">Product Name</th>
                  <th className="p-4 font-semibold text-sm">Price (₹)</th>
                  <th className="p-4 font-semibold text-sm">Discount (%)</th>
                  <th className="p-4 font-semibold text-sm">Visibility</th>
                  <th className="p-4 font-semibold text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <motion.tr 
                    key={product._id} 
                    className="border-b border-beige-100 hover:bg-beige-50 transition-colors"
                  >
                    <td className="p-4">
                      <input 
                        type="text" 
                        value={product.name} 
                        onChange={(e) => updateLocalState(product._id, 'name', e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-purple-200 focus:border-purple-500 focus:outline-none w-full font-medium text-gray-800"
                      />
                    </td>
                    <td className="p-4">
                      <input 
                        type="number" 
                        value={product.price} 
                        onChange={(e) => updateLocalState(product._id, 'price', Number(e.target.value))}
                        className="bg-transparent border-b border-transparent hover:border-purple-200 focus:border-purple-500 focus:outline-none w-24 text-gray-800"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        <Tag className="w-4 h-4 text-gold-500" />
                        <input 
                          type="number" 
                          max="100"
                          min="0"
                          value={product.discountPercentage} 
                          onChange={(e) => updateLocalState(product._id, 'discountPercentage', Number(e.target.value))}
                          className="bg-transparent border-b border-transparent hover:border-purple-200 focus:border-purple-500 focus:outline-none w-16 text-gray-800 font-bold"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => updateLocalState(product._id, 'isActive', !product.isActive)}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${product.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                      >
                        {product.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                        <span>{product.isActive ? 'Visible' : 'Hidden'}</span>
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleUpdate(product._id, product)}
                        className="flex items-center justify-center space-x-2 ml-auto bg-purple-100 text-purple-700 hover:bg-purple-200 hover:text-purple-900 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                      >
                        <Save size={16} />
                        <span>Update</span>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
