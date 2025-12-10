"use client";
import { createContext, useContext } from "react";

interface ProfileContextValue {
   userId: string | undefined;
}

interface ProfileProviderProps {
   userId: string | undefined;
   children: React.ReactNode;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(
   undefined
);

export function useProfileContext() {
   const context = useContext(ProfileContext);
   if (!context) {
      throw new Error(
         "useProfileContext must be used within a ProfileProvider"
      );
   }
   return context;
}

export const ProfileProvider = ({ children, userId }: ProfileProviderProps) => {
   return (
      <ProfileContext.Provider value={{ userId }}>
         {children}
      </ProfileContext.Provider>
   );
};
