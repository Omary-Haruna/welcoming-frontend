import { useState, useEffect } from 'react';
import styles from './MainPage.module.css';
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Save, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import HeaderTwo from './HeaderTwo';

export default function MainPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editProduct, setEditProduct] = useState<any>({});
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('default');

    useEffect(() => {
        const initialProducts = [
            { id: uuidv4(), name: 'HP Laptop 15s', image: 'https://via.placeholder.com/60', category: 'Laptops', price: 950000, quantity: 10, dateModified: new Date('2025-03-15') },
            { id: uuidv4(), name: 'Lenovo ThinkPad X1', image: 'https://via.placeholder.com/60', category: 'Laptops', price: 870000, quantity: 4, dateModified: new Date('2025-03-14') },
            { id: uuidv4(), name: 'MacBook Pro M1', image: 'https://via.placeholder.com/60', category: 'Laptops', price: 2200000, quantity: 7, dateModified: new Date('2025-03-13') },
            { id: uuidv4(), name: 'Dell Inspiron 14', image: 'https://via.placeholder.com/60', category: 'Laptops', price: 810000, quantity: 5, dateModified: new Date('2025-03-12') },
            { id: uuidv4(), name: 'Samsung Galaxy Tab S8', image: 'https://via.placeholder.com/60', category: 'Tablets', price: 1200000, quantity: 8, dateModified: new Date('2025-03-11') },
            { id: uuidv4(), name: 'Apple iPad Air', image: 'https://via.placeholder.com/60', category: 'Tablets', price: 1350000, quantity: 6, dateModified: new Date('2025-03-10') },
            { id: uuidv4(), name: 'Asus ROG Zephyrus', image: 'https://via.placeholder.com/60', category: 'Gaming', price: 2900000, quantity: 2, dateModified: new Date('2025-03-09') },
            { id: uuidv4(), name: 'HP Pavilion 13', image: 'https://via.placeholder.com/60', category: 'Laptops', price: 780000, quantity: 3, dateModified: new Date('2025-03-08') },
            { id: uuidv4(), name: 'Microsoft Surface Laptop', image: 'https://via.placeholder.com/60', category: 'Laptops', price: 1950000, quantity: 4, dateModified: new Date('2025-03-07') },
            { id: uuidv4(), name: 'Lenovo Legion 5', image: 'https://via.placeholder.com/60', category: 'Gaming', price: 1600000, quantity: 5, dateModified: new Date('2025-03-06') },
        ];
        setProducts(initialProducts);
    }, []);

    const stats = [
        { label: 'Total Products', value: products.length },
        { label: 'Most Bought', value: products.reduce((max, p) => (p.quantity > max.quantity ? p : max), products[0] || {}).name || '—' },
        { label: 'Out of Stock', value: products.filter(p => p.quantity === 0).length },
        { label: 'Low Stock', value: products.filter(p => p.quantity > 0 && p.quantity < 5).length },
    ];

    const handleCardClick = (label: string) => {
        if (label === 'Total Products') return setFilter('all');
        if (label === 'Most Bought') return setFilter('mostBought');
        if (label === 'Out of Stock') return setFilter('outOfStock');
        if (label === 'Low Stock') return setFilter('lowStock');
    };

    const filteredProducts = products
        .filter(product => {
            if (filter === 'mostBought') {
                const max = Math.max(...products.map(p => p.quantity));
                return product.quantity === max;
            }
            if (filter === 'outOfStock') return product.quantity === 0;
            if (filter === 'lowStock') return product.quantity > 0 && product.quantity < 5;
            return true;
        })
        .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(product => {
            if (sortBy === 'priceUnder300') return product.price < 300000;
            if (sortBy === 'price300to500') return product.price >= 300000 && product.price <= 500000;
            if (sortBy === 'price500to1M') return product.price > 500000 && product.price < 1000000;
            if (sortBy === 'priceAbove1M') return product.price >= 1000000;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'priceHigh') return b.price - a.price;
            if (sortBy === 'priceLow') return a.price - b.price;
            if (sortBy === 'quantity') return b.quantity - a.quantity;
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'date') return new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime();
            return 0;
        });

    const handleEditClick = (index: number) => {
        setEditIndex(index);
        setEditProduct({ ...filteredProducts[index] });
    };

    const handleSave = () => {
        if (editIndex !== null) {
            const originalIndex = products.findIndex(p => p.id === filteredProducts[editIndex].id);
            const updated = [...products];
            updated[originalIndex] = {
                ...editProduct,
                dateModified: new Date(),
            };
            setProducts(updated);
            setEditIndex(null);
            Swal.fire('Saved!', 'Product has been updated.', 'success');
        }
    };

    const handleDelete = async (index: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This product will be deleted permanently!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            const idToDelete = filteredProducts[index].id;
            const updated = products.filter(p => p.id !== idToDelete);
            setProducts(updated);
            Swal.fire('Deleted!', 'Product has been removed.', 'success');
        }
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setSelectAll(checked);
        setSelectedProducts(checked ? filteredProducts.map(p => p.id) : []);
    };

    const handleSelect = (id: string) => {
        setSelectedProducts(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        const result = await Swal.fire({
            title: `Delete ${selectedProducts.length} product(s)?`,
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete them!',
        });

        if (result.isConfirmed) {
            const updated = products.filter(p => !selectedProducts.includes(p.id));
            setProducts(updated);
            setSelectedProducts([]);
            setSelectAll(false);
            Swal.fire('Deleted!', 'Selected products have been removed.', 'success');
        }
    };
    const totalQuantity = filteredProducts.reduce((sum, p) => sum + p.quantity, 0);
    const totalPrice = filteredProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);


    return (
        <div className={styles.wrapper}>
            <HeaderTwo stats={stats} onCardClick={handleCardClick} activeFilter={filter} />

            <div className={styles.filtersBar}>
                <input
                    type="text"
                    placeholder="Search product name..."
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
                    <option value="quantity">Quantity: High → Low</option>
                    <option value="name">Name: A → Z</option>
                    <option value="date">Date Modified: Newest → Oldest</option>
                    <option value="priceUnder300">Price: Under 300,000</option>
                    <option value="price300to500">Price: 300,000 → 500,000</option>
                    <option value="price500to1M">Price: 500,000 → 1,000,000</option>
                    <option value="priceAbove1M">Price: Above 1,000,000</option>
                </select>
            </div>

            {selectedProducts.length > 0 && (
                <div className={styles.bulkActions}>
                    <button onClick={handleBulkDelete} className={styles.bulkDeleteBtn}>
                        <Trash2 size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                        Delete Selected ({selectedProducts.length})
                    </button>
                </div>
            )}

            <table className={styles.table}>
                <thead>
                    <tr className={styles.row}>
                        <th className={styles.th}>
                            <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                        </th>
                        <th className={styles.th}>ID</th>
                        <th className={styles.th}>Image</th>
                        <th className={styles.th}>Product</th>
                        <th className={styles.th}>Price</th>
                        <th className={styles.th}>Qty</th>
                        <th className={styles.th}>Category</th>
                        <th className={styles.th}>Last Modified</th>
                        <th className={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((p, index) => {
                        const isEditing = index === editIndex;
                        const isSelected = selectedProducts.includes(p.id);
                        return (
                            <tr key={p.id} className={styles.row}>
                                <td className={styles.td}>
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleSelect(p.id)}
                                    />
                                </td>
                                <td className={styles.td} title={p.id}>{p.id.slice(0, 8)}</td>
                                <td className={styles.td}>
                                    <img src={p.image} alt={p.name} className={styles.image} />
                                </td>

                                {isEditing ? (
                                    <>
                                        <td className={styles.td}>
                                            <input
                                                value={editProduct.name}
                                                onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                                            />
                                        </td>
                                        <td className={styles.td}>
                                            <input
                                                type="number"
                                                value={editProduct.price}
                                                onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
                                            />
                                        </td>
                                        <td className={styles.td}>
                                            <input
                                                type="number"
                                                value={editProduct.quantity}
                                                onChange={(e) => setEditProduct({ ...editProduct, quantity: Number(e.target.value) })}
                                            />
                                        </td>
                                        <td className={styles.td}>
                                            <input
                                                value={editProduct.category}
                                                onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                                            />
                                        </td>
                                        <td className={styles.td}>
                                            {new Date().toLocaleDateString()}
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className={styles.td}>{p.name}</td>
                                        <td className={styles.td}>{p.price.toLocaleString()} TZS</td>
                                        <td className={styles.td}>{p.quantity}</td>
                                        <td className={styles.td}>{p.category}</td>
                                        <td className={styles.td}>
                                            {new Date(p.dateModified).toLocaleDateString()}
                                        </td>
                                    </>
                                )}

                                <td className={styles.td}>
                                    <div className={styles.iconGroup}>
                                        {isEditing ? (
                                            <button className={styles.iconBtn} onClick={handleSave} title="Save">
                                                <Save size={16} />
                                            </button>
                                        ) : (
                                            <button className={styles.iconBtn} onClick={() => handleEditClick(index)} title="Edit">
                                                <Pencil size={16} />
                                            </button>
                                        )}
                                        <button className={styles.iconBtn} onClick={() => handleDelete(index)} title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr className={styles.row}>
                        <td className={styles.td} colSpan={4}><strong>Totals</strong></td>
                        <td className={styles.td}><strong>{totalPrice.toLocaleString()} TZS</strong></td>
                        <td className={styles.td}><strong>{totalQuantity}</strong> pcs</td>
                        <td className={styles.td} colSpan={3}></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}
