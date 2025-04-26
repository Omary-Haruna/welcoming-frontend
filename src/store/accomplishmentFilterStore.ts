// src/store/accomplishmentFilterStore.ts
import { create } from 'zustand';

type OutcomeType = '' | 'success' | 'fail';

interface AccomplishmentFilterState {
    search: string;
    sort: string;
    dateJoined: string;
    starFilter: string;
    outcomeFilter: OutcomeType;
    setSearch: (value: string) => void;
    setSort: (value: string) => void;
    setDateJoined: (value: string) => void;
    setStarFilter: (value: string) => void;
    setOutcomeFilter: (value: OutcomeType) => void;
}

export const useAccomplishmentFilter = create<AccomplishmentFilterState>((set) => ({
    search: '',
    sort: '',
    dateJoined: '',
    starFilter: '',
    outcomeFilter: '',
    setSearch: (value) => set({ search: value }),
    setSort: (value) => set({ sort: value }),
    setDateJoined: (value) => set({ dateJoined: value }),
    setStarFilter: (value) => set({ starFilter: value }),
    setOutcomeFilter: (value) => set({ outcomeFilter: value }),
}));
