import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import styles from './SalesPoint.module.css';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import { Search } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { regionOptions } from '../../data/regionOptions';
import { regionDistricts } from '../../data/regionDistricts';

interface Product {
    _id: string;
    name: string;
    category: string;
    sellingPrice: number;
    buyingPrice: number;
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
    const [region, setRegion] = useState<{ value: string; label: string }>({ value: 'Dar es Salaam', label: 'Dar es Salaam' });
    const [districtOptions, setDistrictOptions] = useState<{ value: string; label: string }[]>([]);
    const [district, setDistrict] = useState<{ value: string; label: string } | null>(null);

    const [lastCustomerInfo, setLastCustomerInfo] = useState<{
        name: string;
        phone: string;
        region: { value: string; label: string };
        district?: { value: string; label: string };
        paymentMethod: string;
    } | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('lastCustomerInfo');
        if (saved) setLastCustomerInfo(JSON.parse(saved));
    }, []);

    useEffect(() => {
        if (lastCustomerInfo) localStorage.setItem('lastCustomerInfo', JSON.stringify(lastCustomerInfo));
    }, [lastCustomerInfo]);

    const fetchProductQuantity = async (productId: string) => {
        try {
            const res = await fetch(`https://welcoming-backend.onrender.com/api/products/quantity/${productId}`);
            const data = await res.json();
            return data.success ? data.quantity : null;
        } catch {
            toast.error('Could not fetch quantity');
            return null;
        }
    };

    const handleSell = async (product: Product) => {
        const quantity = await fetchProductQuantity(product._id);
        if (quantity === null || quantity === 0) {
            toast.error(`${product.name} is out of stock! ❌`);
            return;
        }

        if (lastCustomerInfo) {
            const result = await Swal.fire({
                title: 'Use previous customer info?',
                text: `Name: ${lastCustomerInfo?.name || 'N/A'}, Phone: ${lastCustomerInfo?.phone || 'N/A'}`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            });

            if (result.isConfirmed) {
                setCustomerName(lastCustomerInfo.name || '');
                setCustomerPhone(lastCustomerInfo.phone || '');
                setRegion(lastCustomerInfo.region);
                setDistrict(lastCustomerInfo.district || null);
                setPaymentMethod(lastCustomerInfo.paymentMethod);
                const districts = regionDistricts[lastCustomerInfo.region.value] || [];
                setDistrictOptions(districts.map(d => ({ value: d, label: d })));
            } else {
                setCustomerName('');
                setCustomerPhone('');
                setRegion({ value: 'Dar es Salaam', label: 'Dar es Salaam' });
                setDistrict(null);
                setDistrictOptions([]);
                setPaymentMethod('Cash');
            }
        }

        setSelectedProduct(product);
        setShowPopup(true);
    };

    const handleRegionChange = (selected: any) => {
        setRegion(selected);
        const districts = regionDistricts[selected.value] || [];
        setDistrictOptions(districts.map((d) => ({ value: d, label: d })));
        setDistrict(null);
    };

    const handleQuantityChange = (id: string, value: number) => {
        setQuantities(prev => ({ ...prev, [id]: value }));
    };

    const handlePriceChange = (id: string, value: number) => {
        setPrices(prev => ({ ...prev, [id]: value }));
    };

    const formatTZS = (amount: number) => `Tsh ${amount.toLocaleString()}`;

    const filteredProducts = products.filter(product => {
        const matchCategory = category === 'All' || product.category === category;
        const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());
        return matchCategory && matchSearch;
    });

    return (
        <div className={styles.container}>
            {/* Search and Category Filter */}
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

                <select
                    value={category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className={styles.searchInput}
                >
                    <option value="All">All Categories</option>
                    {[...new Set(products.map((p) => p.category))].map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Product Cards */}
            <div className={styles.grid}>
                {filteredProducts.map((product) => {
                    const quantity = quantities[product._id] ?? 1;
                    const price = prices[product._id] ?? product.sellingPrice;

                    return (
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
                                value={price}
                                onChange={(e) => handlePriceChange(product._id, parseFloat(e.target.value) || 0)}
                            />
                            <p className={styles.tzs}>({formatTZS(price)})</p>

                            <label className={styles.label}>Quantity</label>
                            <input
                                type="number"
                                min="1"
                                className={styles.input}
                                value={quantity}
                                onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value) || 1)}
                            />

                            <button className={styles.sellBtn} onClick={() => handleSell(product)}>
                                Add to Cart
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Popup */}
            {showPopup && selectedProduct && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <h3>Add to Cart</h3>
                        <p><strong>Product:</strong> {selectedProduct.name}</p>

                        <input
                            type="text"
                            placeholder="Customer Name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className={styles.popupInput}
                        />

                        <input
                            type="text"
                            placeholder="Customer Phone"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className={styles.popupInput}
                        />

                        <Select
                            options={regionOptions}
                            placeholder="Select Region"
                            value={region}
                            onChange={handleRegionChange}
                            className={styles.popupSelect}
                        />

                        {districtOptions.length > 0 && (
                            <Select
                                options={districtOptions}
                                placeholder="Select District"
                                value={district}
                                onChange={(selected) => setDistrict(selected)}
                                className={styles.popupSelect}
                            />
                        )}

                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className={styles.popupInput}
                        >
                            <option value="Cash">Cash</option>
                            <option value="Mobile Payment">Mobile Payment</option>
                            <option value="Bank">Bank</option>
                        </select>

                        <p className={styles.popupTotal}>
                            Total: <strong>{formatTZS(
                                (prices[selectedProduct._id] ?? selectedProduct.sellingPrice) *
                                (quantities[selectedProduct._id] ?? 1)
                            )}</strong>
                        </p>

                        <button
                            className={styles.popupButton}
                            onClick={() => {
                                const quantity = quantities[selectedProduct._id] ?? 1;
                                const price = prices[selectedProduct._id] ?? selectedProduct.sellingPrice;
                                const total = price * quantity;

                                const newItem = {
                                    cartId: uuidv4(),
                                    id: selectedProduct._id,
                                    name: selectedProduct.name,
                                    image: selectedProduct.image,
                                    price,
                                    quantity,
                                    total,
                                    customerName,
                                    customerPhone,
                                    paymentMethod,
                                    region: region?.value || '',
                                    district: district?.value || '',
                                    buyingPrice: selectedProduct.buyingPrice
                                };

                                addToCart(newItem);

                                if (customerName && customerPhone) {
                                    setLastCustomerInfo({
                                        name: customerName,
                                        phone: customerPhone,
                                        region,
                                        district,
                                        paymentMethod
                                    });
                                }

                                toast.success(`${selectedProduct.name} (${formatTZS(price)}) added to cart! ✅`);

                                setQuantities(prev => ({ ...prev, [selectedProduct._id]: 1 }));
                                setPrices(prev => ({ ...prev, [selectedProduct._id]: selectedProduct.sellingPrice }));
                                setShowPopup(false);
                                setSelectedProduct(null);
                            }}
                        >
                            Add to Cart
                        </button>

                        <button className={styles.closeBtn} onClick={() => setShowPopup(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesPoint;
