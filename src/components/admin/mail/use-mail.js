import { create } from 'zustand'

export const useMail = create((set) => ({
    selected: null,
    setSelected: (id) => set({ selected: id }),
    mails: [],
    setMails: (mails) => set({ mails }),
    mailFolder: 'inbox',
    setMailFolder: (folder) => set({ mailFolder: folder }),
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),
}))
