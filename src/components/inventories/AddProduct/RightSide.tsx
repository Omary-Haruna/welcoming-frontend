import React, { useState, useRef } from 'react';
import styles from './RightSide.module.css';
import { Pencil, Trash2, Save, Search } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Product {
    _id: string;
    name: string;
    image?: string;
    category: string;
    sellingPrice: number;
    buyingPrice?: number;
    quantity: number;
    images?: string[];
}

interface RightSideProps {
    products: Product[];
    fetchProducts: () => void;
}

const CLOUDINARY_UPLOAD_PRESET = 'unsigned_upload';
const CLOUDINARY_CLOUD_NAME = 'duaahnhgf';

export default function RightSide({ products, fetchProducts }: RightSideProps) {
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editableProduct, setEditableProduct] = useState<Partial<Product>>({});
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleEditClick = (index: number) => {
        setEditIndex(index);
        setEditableProduct(products[index]);
    };

    const handleSave = async () => {
        if (editIndex !== null) {
            setLoading(true);
            const currentProduct = products[editIndex];

            const updatedProduct = {
                name: editableProduct.name || currentProduct.name,
                category: editableProduct.category || currentProduct.category,
                sellingPrice: editableProduct.sellingPrice ?? currentProduct.sellingPrice,
                buyingPrice: editableProduct.buyingPrice ?? currentProduct.buyingPrice,
                quantity: editableProduct.quantity ?? currentProduct.quantity,
                image: editableProduct.image || currentProduct.image,
            };

            try {
                const res = await fetch(`https://welcoming-backend.onrender.com/api/products/update/${currentProduct._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedProduct),
                });

                if (res.ok) {
                    toast.success('✅ Product updated successfully!');
                    fetchProducts();
                    setEditableProduct({});
                    setEditIndex(null);
                } else {
                    toast.error('❌ Failed to update product!');
                }
            } catch (error) {
                console.error('Failed to save product:', error);
                toast.error('❌ Server error while saving!');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`https://welcoming-backend.onrender.com/api/products/delete/${id}`, {
                method: 'DELETE',
            });
            toast.success('🗑️ Product deleted successfully!');
            fetchProducts();
        } catch (error) {
            console.error('Failed to delete product:', error);
            toast.error('❌ Failed to delete product!');
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok && data.secure_url) {
                setEditableProduct((prev) => ({
                    ...prev,
                    image: data.secure_url,
                }));
                toast.success('✅ Image uploaded successfully!');
            } else {
                console.error('Cloudinary upload failed:', data);
                toast.error('❌ Failed to upload image');
            }
        } catch (err) {
            console.error('Image upload failed:', err);
            toast.error('❌ Image upload error');
        }
    };

    const getImage = (image?: string) => {
        if (!image || !image.trim().startsWith('http')) {
            return '/default-product.png';
        }
        return image.trim();
    };

    const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
    const filteredProducts = products.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === '' || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const totalQuantity = filteredProducts.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const totalPrice = filteredProducts.reduce((sum, p) => sum + (p.quantity || 0) * (p.sellingPrice || 0), 0);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.topBar}>
                    <div className={styles.searchBox}>
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search by name or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className={styles.dropdown}
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <h2 className={styles.title}>Recently Imported Products</h2>

                <div className={styles.scrollContainer}>
                    <ul className={styles.list}>
                        {filteredProducts.map((product, index) => {
                            const realIndex = products.findIndex((p) => p._id === product._id);
                            const isEditing = realIndex === editIndex;
                            const lineTotal = (product.sellingPrice || 0) * (product.quantity || 0);

                            return (
                                <li key={product._id} className={styles.card}>
                                    <div
                                        className={styles.image}
                                        onClick={() => {
                                            if (isEditing && fileInputRef.current) {
                                                fileInputRef.current.click();
                                            }
                                        }}
                                        style={{ cursor: isEditing ? 'pointer' : 'default' }}
                                    >
                                        <img
                                            src={isEditing ? getImage(editableProduct.image) : getImage(product.image)}
                                            alt={product.name}
                                            onError={(e) => (e.currentTarget.src = '/default-product.png')}
                                        />
                                    </div>

                                    {isEditing && (
                                        <input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            style={{ display: 'none' }}
                                        />
                                    )}

                                    <div className={styles.details}>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editableProduct.name || ''}
                                                    placeholder="Name"
                                                    onChange={(e) => setEditableProduct({ ...editableProduct, name: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    value={editableProduct.category || ''}
                                                    placeholder="Category"
                                                    onChange={(e) => setEditableProduct({ ...editableProduct, category: e.target.value })}
                                                />
                                                <input
                                                    type="number"
                                                    value={editableProduct.buyingPrice || ''}
                                                    placeholder="Buying Price"
                                                    onChange={(e) => setEditableProduct({ ...editableProduct, buyingPrice: Number(e.target.value) })}
                                                />
                                                <input
                                                    type="number"
                                                    value={editableProduct.sellingPrice || ''}
                                                    placeholder="Selling Price"
                                                    onChange={(e) => setEditableProduct({ ...editableProduct, sellingPrice: Number(e.target.value) })}
                                                />
                                                <input
                                                    type="number"
                                                    value={editableProduct.quantity || ''}
                                                    placeholder="Quantity"
                                                    onChange={(e) => setEditableProduct({ ...editableProduct, quantity: Number(e.target.value) })}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Paste Image URL (optional)"
                                                    value={editableProduct.image || ''}
                                                    onChange={(e) => setEditableProduct({ ...editableProduct, image: e.target.value })}
                                                />
                                                <span className={styles.lineTotal}>
                                                    Total: {(Number(editableProduct.sellingPrice || 0) * Number(editableProduct.quantity || 0)).toLocaleString()} TZS
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <strong>{product.name}</strong>
                                                <span>{product.category}</span>
                                                <span>Buying: {product.buyingPrice?.toLocaleString() || 'N/A'} TZS</span>
                                                <span>Selling: {product.sellingPrice.toLocaleString()} TZS</span>
                                                <span>Qty: {product.quantity}</span>
                                                <span className={styles.lineTotal}>
                                                    Total: {lineTotal.toLocaleString()} TZS
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <div className={styles.actions}>
                                        {isEditing ? (
                                            <button className={styles.iconButton} onClick={handleSave} disabled={loading}>
                                                {loading ? 'Saving...' : <Save size={16} />}
                                            </button>
                                        ) : (
                                            <button className={styles.iconButton} onClick={() => handleEditClick(realIndex)}>
                                                <Pencil size={16} />
                                            </button>
                                        )}
                                        <button className={styles.iconButton} onClick={() => handleDelete(product._id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className={styles.totals}>
                    <div>
                        <span className={styles.totalLabel}>Total Quantity:</span>
                        <strong className={styles.totalValue}>{totalQuantity}</strong>
                    </div>
                    <div>
                        <span className={styles.totalLabel}>Total Value:</span>
                        <strong className={styles.totalValue}>{totalPrice.toLocaleString()} TZS</strong>
                    </div>
                </div>
            </div>

            <ToastContainer position="bottom-center" autoClose={2000} />
        </>
    );
}
