import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Home } from '@/pages/Home';
import { Toaster } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="clipwise-theme">
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: 'var(--color-canvas)', color: 'var(--color-ink)', border: '1px solid var(--color-hairline)' },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
