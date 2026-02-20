'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  Image as ImageIcon,
  X,
  RefreshCw,
  IndianRupee,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ProductService } from '@/services/api';
import { toast } from 'sonner';

export default function ProductsPage() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [form, setForm] = useState({ name: '', price: '', quantity: '', imageUrl: '' });
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        price: editingProduct.price.toString(),
        quantity: editingProduct.quantity.toString(),
        imageUrl: editingProduct.imageUrl || '',
      });
      setShowModal(true);
    } else {
      setForm({ name: '', price: '', quantity: '', imageUrl: '' });
    }
  }, [editingProduct]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) { router.push('/login'); return; }
    setUser(JSON.parse(userData));
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await ProductService.getAll();
      setProducts(data);
    } catch {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const result = await ProductService.uploadImage(file);
      if (result.url) {
        setForm(p => ({ ...p, imageUrl: result.url }));
        toast.success('Image uploaded successfully');
      }
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isEditing = !!editingProduct;
      let result;

      if (isEditing) {
        result = await ProductService.update(editingProduct.id, {
          name: form.name,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity),
          imageUrl: form.imageUrl
        });
      } else {
        result = await ProductService.create({
          name: form.name,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity),
          imageUrl: form.imageUrl,
          createdById: user.id
        });
      }

      const saved = isEditing ? result.data?.updateProduct : result.data?.createProduct;

      if (saved) {
        if (isEditing) {
          setProducts(products.map(p => p.id === saved.id ? { ...p, ...saved } : p));
          toast.success('Product updated successfully');
        } else {
          setProducts([...products, { ...saved, createdBy: user }]);
          toast.success('Product created successfully');
        }
        setForm({ name: '', price: '', quantity: '', imageUrl: '' });
        setEditingProduct(null);
        setShowModal(false);
      } else if (result.errors) {
        toast.error(result.errors[0]?.message || 'Failed to save product');
      }
    } catch {
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    toast.promise(
      async () => {
        const result = await ProductService.delete(id);
        if (result.data?.removeProduct) {
          setProducts(products.filter(p => p.id !== id));
          return 'Product deleted';
        }
        throw new Error('Failed');
      },
      {
        loading: 'Deleting product...',
        success: 'Product deleted successfully',
        error: 'Failed to delete product',
      }
    );
  };

  const isAdmin = user?.role === 'MANAGER';
  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!user) return null;

  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const totalQty = products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Product Inventory</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {products.length} commodities • Total value: ₹{totalValue.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchProducts} className="h-9">
            <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh
          </Button>
          {isAdmin && (
            <Button size="sm" onClick={() => { setEditingProduct(null); setShowModal(true); }} className="h-9 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <div className="relative w-4 h-4">
                <Image
                  src="/icons/icons8-add-shopping-cart-50.png"
                  alt="Add"
                  fill
                  className="object-contain invert brightness-0"
                />
              </div>
              Add Product
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: products.length, iconPath: '/icons/icons8-product-50.png', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Total Quantity', value: totalQty.toLocaleString('en-IN'), iconPath: '/icons/icons8-products-pile-50.png', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Portfolio Value', value: `₹${totalValue.toLocaleString('en-IN')}`, iconPath: '/icons/icons8-budget-50.png', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
          { label: 'Avg. Price', value: `₹${products.length ? Math.round(products.reduce((s, p) => s + p.price, 0) / products.length).toLocaleString('en-IN') : 0}`, iconPath: '/icons/icons8-transaction-50.png', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm relative overflow-hidden">
            <div className={cn("absolute inset-0 opacity-5 blur-xl", stat.color.split(' ')[1])} />
            <CardContent className="pt-4 pb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-black mt-1">{stat.value}</p>
              </div>
              <div className="relative w-8 h-8 opacity-80">
                <Image
                  src={stat.iconPath}
                  alt={stat.label}
                  fill
                  className="object-contain"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Table */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9 h-9 w-full border-muted bg-muted/30"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-bold text-xs uppercase tracking-wider w-12"></TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Product</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-right">Price (₹)</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-right">Quantity</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-right">Total Value</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider">Added By</TableHead>
                  {isAdmin && <TableHead className="font-bold text-xs uppercase tracking-wider text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(4).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      {Array(isAdmin ? 7 : 6).fill(0).map((_, j) => (
                        <TableCell key={j}><div className="h-4 bg-muted animate-pulse rounded w-3/4" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 7 : 6} className="text-center py-16 text-muted-foreground">
                      <Package className="w-10 h-10 mx-auto mb-3 opacity-20" />
                      <p className="font-semibold">No products found</p>
                      {isAdmin && <p className="text-xs mt-1">Click "Add Product" to get started.</p>}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((product) => (
                    <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-600 opacity-60" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Commodity</p>
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        ₹{product.price.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className={cn(
                          "font-bold",
                          product.quantity < 20 ? "border-red-300 text-red-600" :
                            product.quantity < 60 ? "border-orange-300 text-orange-600" :
                              "border-green-300 text-green-600"
                        )}>
                          {product.quantity.toLocaleString('en-IN')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-700 dark:text-green-400">
                        ₹{(product.price * product.quantity).toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium truncate max-w-[120px]">{product.createdBy?.email}</span>
                          <Badge variant="secondary" className="text-[9px] w-fit mt-0.5 uppercase tracking-wide">
                            {product.createdBy?.role?.replace('_', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                              onClick={() => setEditingProduct(product)}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:bg-red-50"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {!loading && filtered.length > 0 && (
            <p className="text-xs text-muted-foreground mt-3 text-right">
              Showing {filtered.length} of {products.length} products
            </p>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 pb-8 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20"
                onClick={() => { setShowModal(false); setEditingProduct(null); }}
              >
                <X className="w-5 h-5" />
              </Button>
              <CardTitle className="text-xl font-black">{editingProduct ? 'Update Product' : 'Add Product'}</CardTitle>
              <CardDescription className="text-blue-100">
                {editingProduct ? 'Modify existing commodity.' : 'Register a new commodity to the ledger.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 -mt-4 bg-card rounded-t-3xl space-y-5">
              <form onSubmit={handleSave} className="space-y-4">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Image (Optional)</Label>
                  <div
                    className="group relative aspect-video rounded-xl bg-muted/40 border-2 border-dashed border-muted-foreground/20 overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {form.imageUrl ? (
                      <>
                        <img src={form.imageUrl} className="w-full h-full object-cover" alt="preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <ImageIcon className="w-6 h-6 opacity-40" />
                        <p className="text-xs font-bold uppercase tracking-widest">
                          {uploading ? 'Uploading...' : 'Click to Upload'}
                        </p>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product Name</Label>
                  <Input id="name" placeholder="e.g. Wheat Grade A" className="h-10 rounded-xl bg-muted/40 border-none" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price (₹)</Label>
                    <Input id="price" type="number" step="0.01" placeholder="0.00" className="h-10 rounded-xl bg-muted/40 border-none" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required min="0" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="quantity" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Quantity</Label>
                    <Input id="quantity" type="number" placeholder="0" className="h-10 rounded-xl bg-muted/40 border-none" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} required min="0" />
                  </div>
                </div>

                <Button type="submit" disabled={saving} className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl">
                  {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
