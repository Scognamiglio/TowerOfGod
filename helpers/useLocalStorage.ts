import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
  // Initialisation paresseuse pour ne lire le storage qu'au premier rendu
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  // Optionnel : on peut aussi synchroniser le storage ici via un useEffect
  // Mais comme tu gères déjà des sauvegardes spécifiques (onBlur, calculate),
  // on peut s'en tenir à l'initialisation seule ou ajouter la persistance auto :
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}