import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Home, Users, FileText, Settings, Package } from "lucide-react"
import "./globals.css" // Certifique-se de que este ficheiro existe

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Análise Omie | IA para Cosméticos",
  description: "Inteligência de Negócios para o setor de cosméticos, integrada ao Omie.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                  <Package className="h-6 w-6 text-blue-600" />
                  <span>Análise Omie</span>
                </Link>
              </div>
              <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                  <Link
                    href="/"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/clientes"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Users className="h-4 w-4" />
                    Clientes
                  </Link>
                  <Link
                    href="/relatorios"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <FileText className="h-4 w-4" />
                    Relatórios
                  </Link>
                   <Link
                    href="/configuracoes"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Settings className="h-4 w-4" />
                    Configurações
                  </Link>
                </nav>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
              {/* Cabeçalho para mobile, pode ser adicionado no futuro */}
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Package className="h-6 w-6 text-blue-600" />
                <span>Análise Omie</span>
              </Link>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-50">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
