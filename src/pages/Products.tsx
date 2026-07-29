import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Package, Plus, Trash2, Edit } from 'lucide-react';
import api from '../api/axios';

interface Product {
  id: string;
  name: string;
  pricePerKg: number;
  stockQuantityKg: number;
  category: string;
  imageUrl?: string;
  farmerId: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Product Listings</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage all products listed by farmers on the marketplace.
          </p>
        </div>
        <button className="flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-full font-bold shadow-md shadow-primary/20 hover:scale-105 transition-transform text-sm">
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center">
          <Package className="h-5 w-5 text-slate-400 mr-2" />
          <h3 className="text-sm font-bold text-slate-700">All Products</h3>
        </div>
        <div className="p-4">
          {loading ? (
            <div className="py-8 text-center text-slate-500 text-sm font-medium">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">No products listed.</div>
          ) : (
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-600">Product</TableHead>
                    <TableHead className="font-semibold text-slate-600">Category</TableHead>
                    <TableHead className="font-semibold text-slate-600">Price (₹)</TableHead>
                    <TableHead className="font-semibold text-slate-600">Stock</TableHead>
                    <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover rounded-lg" />
                            ) : (
                              <Package className="h-5 w-5 text-slate-400" />
                            )}
                          </div>
                          <span className="font-bold text-slate-700 text-sm">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-semibold">
                          {product.category}
                        </span>
                      </TableCell>
                      <TableCell className="font-bold text-slate-900">₹{product.pricePerKg}</TableCell>
                      <TableCell>
                        <span className={`font-bold text-xs px-2.5 py-1 rounded-md ${product.stockQuantityKg > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {product.stockQuantityKg} {product.stockQuantityKg > 0 ? 'in stock' : 'out of stock'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <button className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
