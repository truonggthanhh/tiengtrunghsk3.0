import React, { ReactNode } from 'react';
import CantoneseThemeProvider from './providers/ThemeProvider';
import CantoneseSettingsProvider from './providers/SettingsProvider';
import CantoneseSessionContextProvider from './providers/SessionContextProvider';
import CantoneseProfileProvider from './providers/ProfileProvider';
import CantonesePageWrapper from './layouts/PageWrapper';

interface CantoneseRouteWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper component for Cantonese routes that provides all necessary context providers
 * This reduces code duplication across Cantonese routes in App.tsx
 */
const CantoneseRouteWrapper: React.FC<CantoneseRouteWrapperProps> = ({ children }) => {
  return (
    <CantoneseThemeProvider>
      <CantoneseSettingsProvider>
        <CantoneseSessionContextProvider>
          <CantoneseProfileProvider>
            <CantonesePageWrapper>
              {children}
            </CantonesePageWrapper>
          </CantoneseProfileProvider>
        </CantoneseSessionContextProvider>
      </CantoneseSettingsProvider>
    </CantoneseThemeProvider>
  );
};

export default CantoneseRouteWrapper;
