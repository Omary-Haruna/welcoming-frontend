import React, { createContext, useContext, useState, ReactNode } from 'react';
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

    const addToCart = (item: Omit<CartItem, 'cartId' | 'total'>) => {
        setCartState((prev) => {
            const index = prev.findIndex(p => p.id === item.id);

            if (index !== -1) {
                const existing = prev[index];
                const safeQuantity = item.quantity > 0 ? item.quantity : 1;
                const newQuantity = existing.quantity + safeQuantity;

                const updatedItem: CartItem = {
                    ...existing,
                    price: item.price, // ✅ update price
                    buyingPrice: item.buyingPrice, // ✅ update buying price
                    quantity: newQuantity,
                    total: newQuantity * item.price,
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

    const clearCart = () => setCartState([]);

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
