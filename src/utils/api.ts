// utils/api.ts
export const fetchData = async (endpoint: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${endpoint}`);
    }
    return res.json();
};
