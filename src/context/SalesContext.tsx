import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 🛒 Make sure CartItem matches your app
export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
    buyingPrice: number;
}

export interface Summary {
    subtotal: number;
    tax: number;
    total: number;
    items: CartItem[];
    soldAt: string; // DateTime string
}

interface SalesContextType {
    summaries: Summary[];
    setSummaries: React.Dispatch<React.SetStateAction<Summary[]>>;
    addSummary: (summary: Summary) => void;
    deleteSummary: (index: number) => void;
    deleteItemFromSummary: (summaryIndex: number, itemId: string) => void;
    editItemInSummary: (
        summaryIndex: number,
        itemId: string,
        updatedFields: { price?: number; quantity?: number }
    ) => void;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider = ({ children }: { children: ReactNode }) => {
    const [summaries, setSummaries] = useState<Summary[]>([]);

    // ⬇ Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('sales');
        if (saved) setSummaries(JSON.parse(saved));
    }, []);

    // ⬆ Save to localStorage whenever summaries change
    useEffect(() => {
        localStorage.setItem('sales', JSON.stringify(summaries));
    }, [summaries]);

    const addSummary = (summary: Summary) => {
        setSummaries((prev) => [...prev, summary]);
    };

    const deleteSummary = (index: number) => {
        setSummaries((prev) => prev.filter((_, i) => i !== index));
    };

    const deleteItemFromSummary = (summaryIndex: number, itemId: string) => {
        setSummaries((prev) =>
            prev.map((summary, idx) => {
                if (idx !== summaryIndex) return summary;

                const updatedItems = summary.items.filter((item) => item.id !== itemId);
                const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
                const tax = subtotal * 0.18; // Example: 18% tax
                const total = subtotal + tax;

                return {
                    ...summary,
                    items: updatedItems,
                    subtotal,
                    tax,
                    total,
                };
            })
        );
    };

    const editItemInSummary = (
        summaryIndex: number,
        itemId: string,
        updatedFields: { price?: number; quantity?: number }
    ) => {
        setSummaries((prev) =>
            prev.map((summary, idx) => {
                if (idx !== summaryIndex) return summary;

                const updatedItems = summary.items.map((item) => {
                    if (item.id !== itemId) return item;

                    const newPrice = updatedFields.price ?? item.price;
                    const newQuantity = updatedFields.quantity ?? item.quantity;
                    const newTotal = newPrice * newQuantity;

                    return {
                        ...item,
                        price: newPrice,
                        quantity: newQuantity,
                        total: newTotal,
                    };
                });

                const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
                const tax = subtotal * 0.18;
                const total = subtotal + tax;

                return {
                    ...summary,
                    items: updatedItems,
                    subtotal,
                    tax,
                    total,
                };
            })
        );
    };

    return (
        <SalesContext.Provider
            value={{
                summaries,
                setSummaries,
                addSummary,
                deleteSummary,
                deleteItemFromSummary,
                editItemInSummary,
            }}
        >
            {children}
        </SalesContext.Provider>
    );
};

export const useSales = () => {
    const context = useContext(SalesContext);
    if (!context) throw new Error('useSales must be used within a SalesProvider');
    return context;
};
