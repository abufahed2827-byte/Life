import { createContext, useContext, useState, type ReactNode } from 'react';

export type Gender = 'male' | 'female';

interface ProfileCtx {
  gender: Gender;
  setGender: (g: Gender) => void;
  name: string;
  setName: (n: string) => void;
}

const ProfileContext = createContext<ProfileCtx>({
  gender: 'male',
  setGender: () => {},
  name: 'مستخدم',
  setName: () => {},
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [gender, setGenderState] = useState<Gender>(() => {
    if (typeof window === 'undefined') return 'male';
    return (localStorage.getItem('lifeos-gender') as Gender) || 'male';
  });
  const [name, setNameState] = useState<string>(() => {
    if (typeof window === 'undefined') return 'مستخدم';
    return localStorage.getItem('lifeos-name') || 'مستخدم';
  });

  const setGender = (g: Gender) => {
    setGenderState(g);
    localStorage.setItem('lifeos-gender', g);
  };

  const setName = (n: string) => {
    setNameState(n);
    localStorage.setItem('lifeos-name', n);
  };

  return (
    <ProfileContext.Provider value={{ gender, setGender, name, setName }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
