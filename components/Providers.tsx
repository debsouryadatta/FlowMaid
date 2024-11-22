import { CodeContextProvider } from "@/context/code-context";
import { LLMContextProvider } from "@/context/llm-context";
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';


// Combined Providers
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <LLMContextProvider>
        <CodeContextProvider>
          {children}
          <Toaster />
        </CodeContextProvider>
      </LLMContextProvider>
    </ThemeProvider>
  );
}
