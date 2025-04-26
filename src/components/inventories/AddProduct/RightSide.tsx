import React, { useState } from 'react';
import styles from './RightSide.module.css';
import { Pencil, Trash2, Upload, Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Product {
    id: string;
    name: string;
    image?: string;
    category: string;
    sellingPrice: number;
    quantity: number;
    images?: string[];
}

interface RightSideProps {
    products: Product[];
    onEdit: (updatedProducts: Product[]) => void;
    onDelete: (index: number) => void;
    onUploadImage: (index: number, file: File) => void;
}

export default function RightSide({ products, onEdit, onDelete, onUploadImage }: RightSideProps) {
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editableProduct, setEditableProduct] = useState<Partial<Product>>({});

    const handleEditClick = (index: number) => {
        setEditIndex(index);
        setEditableProduct(products[index]);
    };

    const handleSave = () => {
        if (editIndex !== null) {
            const updated = [...products];
            updated[editIndex] = {
                ...updated[editIndex],
                ...editableProduct,
            } as Product;
            onEdit(updated);
            setEditIndex(null);
        }
    };

    const getMostImportedProduct = (items: Product[]) => {
        const counts: Record<string, number> = {};
        items.forEach((item) => {
            counts[item.name] = (counts[item.name] || 0) + 1;
        });
        const most = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
        if (most) {
            return { name: most[0], count: most[1] };
        }
        return null;
    };

    const mostImported = getMostImportedProduct(products);
    const lastImported = products[products.length - 1];

    const totalQuantity = products.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
    const totalPrice = products.reduce((sum, p) => sum + (p.quantity || 0) * (p.sellingPrice || 0), 0);

    return (
        <div className={styles.container}>
            {/* Summary Cards */}
            <div className={styles.summary}>
                <div className={styles.cardInfo}>
                    <span className={styles.cardLabel}>Most Imported Product</span>
                    {mostImported?.count > 0 ? (
                        <>
                            <strong className={styles.cardValue}>{mostImported.name}</strong>
                            <span className={styles.cardStat}>Imported {mostImported.count} times</span>
                            <span className={styles.cardDate}>{new Date().toLocaleString()}</span>
                        </>
                    ) : (
                        <div className={styles.cardEmpty}>Not recently added</div>
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
                        <div className={styles.cardEmpty}>Not recently added</div>
                    )}
                </div>
            </div>

            <h2 className={styles.title}>Recently Imported Products</h2>
            <ul className={styles.list}>
                {products.map((product, index) => {
                    const isEditing = index === editIndex;
                    const calculatedTotal = (isEditing ? editableProduct.quantity : product.quantity) || 0;
                    const calculatedPrice = (isEditing ? editableProduct.sellingPrice : product.sellingPrice) || 0;
                    const lineTotal = calculatedTotal * calculatedPrice;

                    return (
                        <li key={product.id} className={styles.card}>
                            {product.image && (
                                <div className={styles.image}>
                                    <img src={product.image} alt={product.name} />
                                </div>
                            )}

                            {isEditing ? (
                                <div className={styles.details}>
                                    <input
                                        type="text"
                                        value={editableProduct.name || ''}
                                        onChange={(e) =>
                                            setEditableProduct({ ...editableProduct, name: e.target.value })
                                        }
                                        placeholder="Product Name"
                                    />
                                    <input
                                        type="text"
                                        value={editableProduct.category || ''}
                                        onChange={(e) =>
                                            setEditableProduct({ ...editableProduct, category: e.target.value })
                                        }
                                        placeholder="Category"
                                    />
                                    <input
                                        type="number"
                                        value={editableProduct.sellingPrice || ''}
                                        onChange={(e) =>
                                            setEditableProduct({
                                                ...editableProduct,
                                                sellingPrice: Number(e.target.value),
                                            })
                                        }
                                        placeholder="Selling Price"
                                    />
                                    <input
                                        type="number"
                                        value={editableProduct.quantity || ''}
                                        onChange={(e) =>
                                            setEditableProduct({
                                                ...editableProduct,
                                                quantity: Number(e.target.value),
                                            })
                                        }
                                        placeholder="Quantity"
                                    />
                                    <span className={styles.lineTotal}>Total: {lineTotal.toLocaleString()} TZS</span>
                                </div>
                            ) : (
                                <div className={styles.details}>


                                    <strong>{product.name}</strong>
                                    <span className={styles.productId}>ID: {product.id}</span>
                                    <span>{product.category}</span>
                                    <span>{product.sellingPrice} TZS</span>
                                    <span>Qty: {product.quantity}</span>
                                    <span className={styles.lineTotal}>
                                        Total: {(product.quantity * product.sellingPrice).toLocaleString()} TZS
                                    </span>
                                </div>
                            )}

                            <div className={styles.actions}>
                                <label htmlFor={`upload-${index}`} className={styles.iconButton} title="Upload Image">
                                    <Upload size={16} />
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id={`upload-${index}`}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) onUploadImage(index, file);
                                    }}
                                />

                                {isEditing ? (
                                    <button
                                        onClick={handleSave}
                                        className={styles.iconButton}
                                        title="Save"
                                    >
                                        <Save size={16} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleEditClick(index)}
                                        className={styles.iconButton}
                                        title="Edit"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                )}

                                <button
                                    onClick={() => onDelete(index)}
                                    className={styles.iconButton}
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {/* Totals Summary */}
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
    );
}
