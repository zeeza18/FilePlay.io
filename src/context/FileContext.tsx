import { createContext, useContext, useState, ReactNode } from 'react';

interface FileData {
  file: File;
  name: string;
  size: string;
  type: string;
  lastModified: string;
  url: string;
}

interface FileContextType {
  sharedFile: FileData | null;
  setSharedFile: (file: FileData | null) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [sharedFile, setSharedFile] = useState<FileData | null>(null);

  return (
    <FileContext.Provider value={{ sharedFile, setSharedFile }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileContext must be used within FileProvider');
  }
  return context;
};
