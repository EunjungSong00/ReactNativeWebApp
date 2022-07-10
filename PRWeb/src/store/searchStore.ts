import filterColor from '../../pages/search/filterColor';
import create from 'zustand';
import {devtools} from 'zustand/middleware';

const store = (set: any) => ({
  recentSearchWord: [], // 최근 검색어
  searchWord: '', // 검색어
  autocompleteVisible: false, // 자동완성
  resultSize: 0, // 검색 결과 사이즈
  filter: {
    brand: [],
    bodyType: []
  },

  addRecentSearchWord: (newWord: string) =>
    set((state: any) => ({recentSearchWord: state.recentSearchWord.length < 20 ? [newWord, ...state.recentSearchWord] : [newWord, ...state.recentSearchWord.splice(0, 19)]})),
  loadRecentSearchWord: (loadWord: []) => set(() => ({recentSearchWord: [...loadWord]})),
  removeRecentSearchWord: (removeWord: string) => set((state: any) => ({recentSearchWord: state.recentSearchWord.filter((element: string) => element !== removeWord)})),
  removeAllRecentSearchWord: () => set(() => ({recentSearchWord: []})),

  setSearchWord: (word: string) => set(() => ({searchWord: word})),
  setAutocompleteVisible: (state: boolean) => set(() => ({autocompleteVisible: state})),

  setResultSize: (value: number) => set(() => ({resultSize: value})),

  setFilter: (key: string, value: string) =>
    set((state: any) => ({
      filter: {
        ...state.filter,
        [key]: state.filter?.[key].includes(value) ? [...state.filter[key]] : [...state.filter[key], value]
      }
    })),
  removeFilter: (key: string) =>
    set((state: any) => ({
      filter: {
        ...state.filter,
        [key]: []
      }
    }))
});

const searchStore = create(devtools(store));

export default searchStore;
