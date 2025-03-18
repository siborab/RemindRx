import { UserInfo } from '@/types/UserData'
import { atom } from 'jotai';

export const userAtom = atom<UserInfo>();