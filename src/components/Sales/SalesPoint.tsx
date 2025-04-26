import React, { useState } from 'react';
import styles from './SalesPoint.module.css';
import { useCart } from '../../context/CartContext';
import { toast } from "react-toastify";
import { Search } from 'lucide-react';
import CustomDropdown from '../cards/CustomDropdown';





interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
}

const mockProducts: Product[] = [
    {
        id: 1,
        name: 'Dell Laptop',
        category: 'Computers',
        price: 1200,
        image: 'https://rukminim2.flixcart.com/image/850/1000/xif0q/computer/i/7/r/latitude-3420-business-laptop-dell-original-imagn6hrwnczrmzv.jpeg?q=90&crop=false',
    },
    {
        id: 2,
        name: 'Wireless Mouse',
        category: 'Accessories',
        price: 25,
        image: 'https://empire.co.tz/cdn/shop/files/1_c954f9ab-4762-4a27-96ae-2ce269d70a85.jpg?v=1698743105',
    },
    {
        id: 3,
        name: 'HP Printer',
        category: 'Printers',
        price: 150,
        image: 'https://empire.co.tz/cdn/shop/files/hp4003dn.jpg?v=1692621722',
    },
    {
        id: 4,
        name: '24" Monitor',
        category: 'Monitors',
        price: 200,
        image: 'https://goldentech.com.sa/media/catalog/product/cache/3b63c6023d7836f7abeed5960b50eab1/d/e/dell_s2421hn_24_computer_monitor.jpg',
    },
    {
        id: 5,
        name: 'Keyboard',
        category: 'Accessories',
        price: 40,
        image: 'https://ctl.net/cdn/shop/products/ctl-ctl-wireless-keyboard-for-chrome-os-works-with-chromebook-29142051258456.jpg?v=1647376204',
    },
];

interface Props {
    category: string;
}

const SalesPoint: React.FC<Props> = ({ category, onCategoryChange }) => {
    const { addToCart } = useCart(); // ✅ Hook must be inside component

    const [search, setSearch] = useState('');
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
    const [prices, setPrices] = useState<{ [key: number]: number }>({});
    const [showPopup, setShowPopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [selectedSubCategory, setSelectedSubCategory] = useState('All');



    const handleQuantityChange = (id: number, value: number) => {
        setQuantities((prev) => ({ ...prev, [id]: value }));
    };

    const handlePriceChange = (id: number, value: number) => {
        setPrices((prev) => ({ ...prev, [id]: value }));
    };

    const handleSell = (product: Product) => {
        setSelectedProduct(product);
        setShowPopup(true);
    };

    const filteredProducts = mockProducts.filter((product) => {
        const matchMainCategory =
            category === 'All' || product.category === category;

        const matchSubCategory =
            selectedSubCategory === 'All' || product.category === selectedSubCategory;

        const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());

        // Show products only in the selected sidebar category,
        // and filter them again using dropdown filter
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
                    options={[
                        { value: 'All', label: 'All Categories' },
                        { value: 'Computers', label: 'Computers' },
                        { value: 'Accessories', label: 'Accessories' },
                        { value: 'Printers', label: 'Printers' },
                        { value: 'Monitors', label: 'Monitors' },
                    ]}
                    selected={category}
                    onChange={onCategoryChange}
                    placeholder="Select Category"
                />
            </div>


            <div className={styles.grid}>
                {filteredProducts.map((product) => (
                    <div key={product.id} className={styles.card}>
                        <img src={product.image} alt={product.name} className={styles.image} />
                        <h4>{product.name}</h4>
                        <p className={styles.category}>{product.category}</p>

                        <label className={styles.label}>Price ($)</label>
                        <input
                            type="number"
                            min="0"
                            className={styles.input}
                            value={prices[product.id] ?? product.price}
                            onChange={(e) =>
                                handlePriceChange(product.id, parseFloat(e.target.value) || 0)
                            }
                        />

                        <label className={styles.label}>Quantity</label>
                        <input
                            type="number"
                            min="1"
                            className={styles.input}
                            value={quantities[product.id] ?? 1}
                            onChange={(e) =>
                                handleQuantityChange(product.id, parseInt(e.target.value) || 1)
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
                                const quantity = quantities[selectedProduct.id] ?? 1;
                                const price = prices[selectedProduct.id] ?? selectedProduct.price;
                                const total = quantity * price;

                                const cartItem = {
                                    ...selectedProduct,
                                    quantity,
                                    price,
                                    total,
                                    customerName,
                                    customerPhone,
                                    paymentMethod,
                                };

                                addToCart(cartItem); // ✅ add to context
                                toast.success(`${selectedProduct.name} added to cart! ✅`);

                                // reset popup
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