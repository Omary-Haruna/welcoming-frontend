import React, { useState } from 'react';
import styles from './SalesPoint.module.css';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import { Search } from 'lucide-react';
import CustomDropdown from '../cards/CustomDropdown';
import { v4 as uuidv4 } from 'uuid'; // 👈 add this import

interface Product {
    _id: string;
    name: string;
    category: string;
    sellingPrice: number;
    image?: string;
}

interface Props {
    category: string;
    onCategoryChange: (category: string) => void;
    products: Product[];
}

const SalesPoint: React.FC<Props> = ({ category, onCategoryChange, products }) => {
    const { addToCart } = useCart();

    const [search, setSearch] = useState('');
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [prices, setPrices] = useState<{ [key: string]: number }>({});
    const [showPopup, setShowPopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [selectedSubCategory, setSelectedSubCategory] = useState('All');

    const handleQuantityChange = (id: string, value: number) => {
        setQuantities((prev) => ({ ...prev, [id]: value }));
    };

    const handlePriceChange = (id: string, value: number) => {
        setPrices((prev) => ({ ...prev, [id]: value }));
    };

    const handleSell = (product: Product) => {
        setSelectedProduct(product);
        setShowPopup(true);
    };

    const filteredProducts = products.filter((product) => {
        const matchMainCategory = category === 'All' || product.category === category;
        const matchSubCategory = selectedSubCategory === 'All' || product.category === selectedSubCategory;
        const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());

        return matchMainCategory && matchSubCategory && matchSearch;
    });

    return (
        <div className={styles.container}>
            <div className={styles.searchControls}>
                <div className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <CustomDropdown
                    options={[...new Set(products.map((p) => p.category))]
                        .map((cat) => ({ value: cat, label: cat }))
                        .concat({ value: 'All', label: 'All Categories' })}
                    selected={category}
                    onChange={onCategoryChange}
                    placeholder="Select Category"
                />
            </div>

            <div className={styles.grid}>
                {filteredProducts.map((product) => (
                    <div key={product._id} className={styles.card}>
                        <img
                            src={product.image || 'https://via.placeholder.com/100?text=No+Image'}
                            alt={product.name}
                            className={styles.image}
                        />
                        <h4>{product.name}</h4>
                        <p className={styles.category}>{product.category}</p>

                        <label className={styles.label}>Price</label>
                        <input
                            type="number"
                            min="0"
                            className={styles.input}
                            value={prices[product._id] ?? product.sellingPrice}
                            onChange={(e) =>
                                handlePriceChange(product._id, parseFloat(e.target.value) || 0)
                            }
                        />

                        <label className={styles.label}>Quantity</label>
                        <input
                            type="number"
                            min="1"
                            className={styles.input}
                            value={quantities[product._id] ?? 1}
                            onChange={(e) =>
                                handleQuantityChange(product._id, parseInt(e.target.value) || 1)
                            }
                        />

                        <button className={styles.sellBtn} onClick={() => handleSell(product)}>
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>

            {showPopup && selectedProduct && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <h3>Add to Cart</h3>
                        <p><strong>Product:</strong> {selectedProduct.name}</p>

                        <input
                            type="text"
                            placeholder="Customer Name (optional)"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className={styles.popupInput}
                        />

                        <input
                            type="text"
                            placeholder="Customer Phone (optional)"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className={styles.popupInput}
                        />

                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className={styles.popupInput}
                        >
                            <option value="Cash">Cash</option>
                            <option value="Mobile Payment">Mobile Payment</option>
                            <option value="Bank">Bank</option>
                        </select>

                        <button
                            className={styles.popupButton}
                            onClick={() => {
                                const quantity = quantities[selectedProduct._id] ?? 1;
                                const price = prices[selectedProduct._id] ?? selectedProduct.sellingPrice;

                                const cartItem = {
                                    id: uuidv4(), // 🔑 Unique each time
                                    name: selectedProduct.name,
                                    image: selectedProduct.image,
                                    price,
                                    quantity,
                                    customerName,
                                    customerPhone,
                                    paymentMethod,
                                };

                                addToCart(cartItem);
                                toast.success(`${selectedProduct.name} added to cart! ✅`);

                                // Reset state
                                setShowPopup(false);
                                setSelectedProduct(null);
                                setCustomerName('');
                                setCustomerPhone('');
                                setPaymentMethod('Cash');
                            }}
                        >
                            Add to Cart
                        </button>

                        <button className={styles.closeBtn} onClick={() => setShowPopup(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesPoint;
