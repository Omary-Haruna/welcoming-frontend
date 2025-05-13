import { useState, useEffect } from 'react';
import styles from './MainPage.module.css';
import { Pencil, Save, Trash2, AlertTriangle, Ban } from 'lucide-react';
import Swal from 'sweetalert2';
import HeaderTwo from './HeaderTwo';

interface Product {
    _id: string;
    name: string;
    image?: string;
    category: string;
    sellingPrice: number;
    quantity: number;
    dateModified?: string;
}

export default function MainPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editProduct, setEditProduct] = useState<Partial<Product>>({});
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [filterBy, setFilterBy] = useState('all');

    const fetchProducts = async () => {
        try {
            const res = await fetch('https://welcoming-backend.onrender.com/api/products/all');
            const data = await res.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleEditClick = (index: number) => {
        setEditIndex(index);
        setEditProduct({ ...filteredProducts[index] });
    };

    const handleSave = async () => {
        if (editIndex !== null) {
            const currentProduct = filteredProducts[editIndex];
            const updatedProduct = { ...editProduct };

            if (updatedProduct.quantity !== undefined && updatedProduct.quantity < 0) {
                Swal.fire('Error', 'Quantity cannot be negative.', 'error');
                return;
            }

            try {
                await fetch(`https://welcoming-backend.onrender.com/api/products/update/${currentProduct._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedProduct),
                });

                Swal.fire('Saved!', 'Product updated successfully!', 'success');
                fetchProducts();
                setEditIndex(null);
            } catch (error) {
                console.error('Save failed', error);
                Swal.fire('Error', 'Failed to update product.', 'error');
            }
        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Delete product?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await fetch(`https://welcoming-backend.onrender.com/api/products/delete/${id}`, {
                    method: 'DELETE',
                });
                Swal.fire('Deleted!', 'Product deleted.', 'success');
                fetchProducts();
            } catch (error) {
                console.error('Delete failed', error);
                Swal.fire('Error', 'Failed to delete product.', 'error');
            }
        }
    };

    const handleBulkDelete = async () => {
        const result = await Swal.fire({
            title: `Delete ${selectedProducts.length} products?`,
            text: 'They will be deleted permanently!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete all!',
        });

        if (result.isConfirmed) {
            for (const id of selectedProducts) {
                await fetch(`https://welcoming-backend.onrender.com/api/products/delete/${id}`, {
                    method: 'DELETE',
                });
            }
            Swal.fire('Deleted!', 'Selected products deleted.', 'success');
            fetchProducts();
            setSelectedProducts([]);
        }
    };

    const handleSelect = (id: string) => {
        setSelectedProducts((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedProducts(filteredProducts.map((p) => p._id));
        } else {
            setSelectedProducts([]);
        }
    };

    const filteredProducts = products
        .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter((p) => {
            if (filterBy === 'lowStock') return p.quantity > 0 && p.quantity < 5;
            if (filterBy === 'outOfStock') return p.quantity === 0;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'priceHigh') return b.sellingPrice - a.sellingPrice;
            if (sortBy === 'priceLow') return a.sellingPrice - b.sellingPrice;
            if (sortBy === 'quantity') return b.quantity - a.quantity;
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'date') return new Date(b.dateModified || '').getTime() - new Date(a.dateModified || '').getTime();
            return 0;
        });

    const totalQuantity = filteredProducts.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const totalPrice = filteredProducts.reduce((sum, p) => sum + (p.quantity || 0) * (p.sellingPrice || 0), 0);

    return (
        <div className={styles.wrapper}>
            <HeaderTwo
                stats={[
                    { label: 'Total Products', value: products.length },
                    { label: 'Low Stock', value: products.filter((p) => p.quantity > 0 && p.quantity < 5).length },
                    { label: 'Out of Stock', value: products.filter((p) => p.quantity === 0).length },
                ]}
                onCardClick={(label) => {
                    if (label === 'Low Stock') setFilterBy('lowStock');
                    else if (label === 'Out of Stock') setFilterBy('outOfStock');
                    else setFilterBy('all');
                }}
                activeFilter={filterBy}
            />

            <div className={styles.filtersBar}>
                <input
                    type="text"
                    placeholder="Search product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={styles.sortSelect}
                >
                    <option value="default">Sort By</option>
                    <option value="priceHigh">Price: High → Low</option>
                    <option value="priceLow">Price: Low → High</option>
                    <option value="quantity">Quantity</option>
                    <option value="name">Name</option>
                    <option value="date">Date</option>
                </select>
            </div>

            {selectedProducts.length > 0 && (
                <div className={styles.bulkActions}>
                    <button onClick={handleBulkDelete} className={styles.bulkDeleteBtn}>
                        Delete Selected ({selectedProducts.length})
                    </button>
                </div>
            )}

            <table className={styles.table}>
                <thead>
                    <tr className={styles.row}>
                        <th className={styles.th}>
                            <input
                                type="checkbox"
                                checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th className={styles.th}>Image</th>
                        <th className={styles.th}>Product</th>
                        <th className={styles.th}>Price</th>
                        <th className={styles.th}>Qty</th>
                        <th className={styles.th}>Category</th>
                        <th className={styles.th}>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredProducts.map((p, index) => {
                        const isEditing = index === editIndex;
                        const isSelected = selectedProducts.includes(p._id);

                        return (
                            <tr key={p._id} className={styles.row}>
                                <td className={styles.td} data-label="Select">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleSelect(p._id)}
                                    />
                                </td>
                                <td className={styles.td} data-label="Image">
                                    <img
                                        src={p.image || '/default-product.png'}
                                        alt={p.name}
                                        className={styles.image}
                                    />
                                </td>

                                {isEditing ? (
                                    <>
                                        <td className={styles.td} data-label="Product">
                                            <input
                                                value={editProduct.name || ''}
                                                onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                                            />
                                        </td>
                                        <td className={styles.td} data-label="Price">
                                            <input
                                                type="number"
                                                value={editProduct.sellingPrice || ''}
                                                onChange={(e) =>
                                                    setEditProduct({ ...editProduct, sellingPrice: Number(e.target.value) })
                                                }
                                            />
                                        </td>
                                        <td className={styles.td} data-label="Quantity">
                                            <input
                                                type="number"
                                                value={editProduct.quantity || ''}
                                                onChange={(e) =>
                                                    setEditProduct({ ...editProduct, quantity: Number(e.target.value) })
                                                }
                                            />
                                        </td>
                                        <td className={styles.td} data-label="Category">
                                            <input
                                                value={editProduct.category || ''}
                                                onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                                            />
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className={styles.td} data-label="Product">{p.name}</td>
                                        <td className={styles.td} data-label="Price">{p.sellingPrice.toLocaleString()} TZS</td>
                                        <td className={styles.td} data-label="Qty">
                                            {p.quantity === 0 ? (
                                                <span style={{ color: 'red', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <Ban size={14} /> Out of Stock
                                                </span>
                                            ) : p.quantity > 0 && p.quantity < 5 ? (
                                                <span style={{ color: 'orange', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <AlertTriangle size={14} /> Low Stock ({p.quantity} pcs left)
                                                </span>
                                            ) : (
                                                `${p.quantity}`
                                            )}
                                        </td>
                                        <td className={styles.td} data-label="Category">{p.category}</td>
                                    </>
                                )}

                                <td className={styles.td} data-label="Actions">
                                    {isEditing ? (
                                        <button className={styles.iconBtn} onClick={handleSave}>
                                            <Save size={16} />
                                        </button>
                                    ) : (
                                        <button className={styles.iconBtn} onClick={() => handleEditClick(index)}>
                                            <Pencil size={16} />
                                        </button>
                                    )}
                                    <button className={styles.iconBtn} onClick={() => handleDelete(p._id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>


                <tfoot>
                    <tr className={styles.row}>
                        <td className={styles.td} colSpan={2}><strong>Totals:</strong></td>
                        <td className={styles.td}><strong>{totalPrice.toLocaleString()} TZS</strong></td>
                        <td className={styles.td}><strong>{totalQuantity} pcs</strong></td>
                        <td className={styles.td} colSpan={3}></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}
