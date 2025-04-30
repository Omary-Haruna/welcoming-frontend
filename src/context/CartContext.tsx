import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    total: number;
    image?: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    clearCart: () => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    setCart: (items: CartItem[]) => void; // for syncing from backend
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (item: CartItem) => {
        setCart((prev) => {
            const exists = prev.find((i) => i.id === item.id);
            if (exists) {
                return prev.map((i) =>
                    i.id === item.id
                        ? {
                            ...i,
                            quantity: i.quantity + item.quantity,
                            total: (i.quantity + item.quantity) * i.price,
                        }
                        : i
                );
            }
            return [
                ...prev,
                {
                    ...item,
                    quantity: item.quantity || 1,
                    total: (item.quantity || 1) * item.price,
                },
            ];
        });
    };

    const clearCart = () => setCart([]);

    const removeFromCart = (id: number) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: number, newQuantity: number) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.id === id
                        ? {
                            ...item,
                            quantity: newQuantity,
                            total: newQuantity * item.price,
                        }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                clearCart,
                removeFromCart,
                updateQuantity,
                setCart, // expose this for syncing from backend
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
