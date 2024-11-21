import { createTheme, MantineProvider } from '@mantine/core';
import { ModalProvider } from './context/ModalContext';

const theme = createTheme({
  fontFamily: 'DB Heavent, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: { fontFamily: 'DB Heavent, sans-serif' },
});

function MantineProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme}>
      <ModalProvider>
        {children}
      </ModalProvider>
    </MantineProvider>
  );
}

export default MantineProviderWrapper;