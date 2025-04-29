import React, { useState, useRef } from 'react';
import styles from './RightSide.module.css';
import { Pencil, Trash2, Save } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Product {
    _id: string;
    name: string;
    image?: string;
    category: string;
    sellingPrice: number;
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
        return image && image.trim() !== '' ? image : '/default-product.png';
    };

    const mostImported = products.reduce((acc: Record<string, number>, curr) => {
        acc[curr.name] = (acc[curr.name] || 0) + 1;
        return acc;
    }, {});
    const most = Object.entries(mostImported).sort((a, b) => b[1] - a[1])[0];
    const mostImportedProduct = most ? { name: most[0], count: most[1] } : null;
    const lastImported = products[products.length - 1];
    const totalQuantity = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const totalPrice = products.reduce((sum, p) => sum + (p.quantity || 0) * (p.sellingPrice || 0), 0);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.summary}>
                    <div className={styles.cardInfo}>
                        <span className={styles.cardLabel}>Most Imported Product</span>
                        {mostImportedProduct ? (
                            <>
                                <strong className={styles.cardValue}>{mostImportedProduct.name}</strong>
                                <span className={styles.cardStat}>Imported {mostImportedProduct.count} times</span>
                                <span className={styles.cardDate}>{new Date().toLocaleString()}</span>
                            </>
                        ) : (
                            <div className={styles.cardEmpty}>No products yet</div>
                        )}
                    </div>
                    <div className={styles.cardInfo}>
                        <span className={styles.cardLabel}>Last Imported</span>
                        {lastImported ? (
                            <>
                                <strong className={styles.cardValue}>{lastImported.name}</strong>
                                <span className={styles.cardStat}>Just now</span>
                                <span className={styles.cardDate}>{new Date().toLocaleString()}</span>
                            </>
                        ) : (
                            <div className={styles.cardEmpty}>No products yet</div>
                        )}
                    </div>
                </div>

                <h2 className={styles.title}>Recently Imported Products</h2>

                {products.length === 0 ? (
                    <p className={styles.noProducts}>No products found in the system.</p>
                ) : (
                    <ul className={styles.list}>
                        {products.map((product, index) => {
                            const isEditing = index === editIndex;
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
                                                    placeholder="Product Name"
                                                    value={editableProduct.name || ''}
                                                    onChange={(e) => setEditableProduct({ ...editableProduct, name: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Category"
                                                    value={editableProduct.category || ''}
                                                    onChange={(e) => setEditableProduct({ ...editableProduct, category: e.target.value })}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Selling Price"
                                                    value={editableProduct.sellingPrice || ''}
                                                    onChange={(e) => setEditableProduct({ ...editableProduct, sellingPrice: Number(e.target.value) })}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Quantity"
                                                    value={editableProduct.quantity || ''}
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
                                                <span className={styles.productId}>ID: {product._id}</span>
                                                <span>{product.category}</span>
                                                <span>{product.sellingPrice.toLocaleString()} TZS</span>
                                                <span>Qty: {product.quantity}</span>
                                                <span className={styles.lineTotal}>
                                                    Total: {lineTotal.toLocaleString()} TZS
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <div className={styles.actions}>
                                        {isEditing ? (
                                            <button disabled={loading} className={styles.iconButton} onClick={handleSave} title="Save">
                                                {loading ? 'Saving...' : <Save size={16} />}
                                            </button>
                                        ) : (
                                            <button className={styles.iconButton} onClick={() => handleEditClick(index)} title="Edit">
                                                <Pencil size={16} />
                                            </button>
                                        )}
                                        <button className={styles.iconButton} onClick={() => handleDelete(product._id)} title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}

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

            {/* Toast notifications */}
            <ToastContainer position="top-right" autoClose={2000} />
        </>
    );
}
