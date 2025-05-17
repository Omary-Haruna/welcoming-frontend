import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface CartItem {
    cartId: string;
    id: string | number;
    name: string;
    price: number;
    buyingPrice: number;
    quantity: number;
    total: number;
    image?: string;
    customerName?: string;
    customerPhone?: string;
    paymentMethod?: string;
    region?: string;
    district?: string; // ✅ Added district
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'cartId' | 'total'>) => void;
    clearCart: () => void;
    removeFromCart: (cartId: string) => void;
    updateQuantity: (cartId: string, quantity: number) => void;
    setCart: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCartState] = useState<CartItem[]>([]);
    const [loaded, setLoaded] = useState(false);

    // 🧠 Get unique cart key based on user
    const getCartKey = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return `sales_cart_${user?.name || 'guest'}`;
    };

    // ✅ Load from localStorage or backend on startup
    useEffect(() => {
        const loadCart = async () => {
            const key = getCartKey();
            const stored = localStorage.getItem(key);

            if (stored) {
                try {
                    setCart(JSON.parse(stored));
                    return;
                } catch (err) {
                    console.error('Failed to parse local cart:', err);
                }
            }

            // Try to fetch from backend
            try {
                const res = await fetch('https://welcoming-backend.onrender.com/api/pending-cart/get');
                const data = await res.json();
                if (data.success && data.cart) {
                    setCart(data.cart);
                }
            } catch (err) {
                console.error('Failed to fetch pending cart:', err);
            }
        };

        loadCart().finally(() => setLoaded(true));
    }, []);

    // ✅ Save to localStorage and backend on change
    useEffect(() => {
        if (!loaded) return;

        const key = getCartKey();
        localStorage.setItem(key, JSON.stringify(cart));

        // Sync to backend
        if (cart.length > 0) {
            fetch('https://welcoming-backend.onrender.com/api/pending-cart/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart }),
            }).catch((err) => console.error('Failed to sync cart to backend:', err));
        }
    }, [cart, loaded]);

    const addToCart = (item: Omit<CartItem, 'cartId' | 'total'>) => {
        setCartState((prev) => {
            const index = prev.findIndex(p => p.id === item.id);

            if (index !== -1) {
                const existing = prev[index];
                const safeQuantity = item.quantity > 0 ? item.quantity : 1;
                const newQuantity = existing.quantity + safeQuantity;

                const updatedItem: CartItem = {
                    ...existing,
                    price: item.price,
                    buyingPrice: item.buyingPrice,
                    quantity: newQuantity,
                    total: newQuantity * item.price,
                    customerName: item.customerName,
                    customerPhone: item.customerPhone,
                    paymentMethod: item.paymentMethod,
                    region: item.region,
                    district: item.district,
                };

                const updatedCart = [...prev];
                updatedCart[index] = updatedItem;
                return updatedCart;
            }

            const safeQuantity = item.quantity > 0 ? item.quantity : 1;
            const safeTotal = safeQuantity * item.price;

            return [
                ...prev,
                {
                    ...item,
                    cartId: uuidv4(),
                    quantity: safeQuantity,
                    total: safeTotal,
                }
            ];
        });
    };

    const removeFromCart = (cartId: string) => {
        setCartState((prev) => prev.filter((item) => item.cartId !== cartId));
    };

    const updateQuantity = (cartId: string, quantity: number) => {
        const safeQuantity = Math.max(1, quantity);
        setCartState((prev) =>
            prev.map((item) =>
                item.cartId === cartId
                    ? {
                        ...item,
                        quantity: safeQuantity,
                        total: safeQuantity * item.price,
                    }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartState([]);

        // Clear from backend
        fetch('https://welcoming-backend.onrender.com/api/pending-cart/clear', {
            method: 'DELETE',
        }).catch((err) => console.error('Failed to clear backend cart:', err));

        // Clear from localStorage
        const key = getCartKey();
        localStorage.removeItem(key);
    };

    const setCart = (items: CartItem[]) => {
        const safeItems = items.map(item => ({
            ...item,
            cartId: item.cartId || uuidv4(),
            total: item.quantity * item.price,
        }));
        setCartState(safeItems);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                clearCart,
                removeFromCart,
                updateQuantity,
                setCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
