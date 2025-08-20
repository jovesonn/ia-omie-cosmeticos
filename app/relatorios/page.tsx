"use client"

import type React from "react"
import { Download, FileText, MoreHorizontal, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DatePickerWithRange } from "@/components/ui/date-range-picker" // Assumindo que este componente existe ou será criado

// --- Dados de Exemplo (Mock Data) ---
const generatedReports = [
  { id: "REP-001", name: "Vendas Mensais - Julho 2025", generationDate: "2025-08-01", format: "PDF" },
  { id: "REP-002", name: "Análise de Churn - Q2 2025", generationDate: "2025-07-15", format: "Excel" },
  { id: "REP-003", name: "Giro de Estoque - Top 100 SKUs", generationDate: "2025-07-05", format: "PDF" },
  { id: "REP-004", name: "Performance de Vendedores - Julho", generationDate: "2025-08-02", format: "Excel" },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Relatórios Personalizados</h1>
        <p className="text-muted-foreground">Gere e exporte análises detalhadas do seu negócio.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Gerar Novo Relatório</CardTitle>
          <CardDescription>Selecione os parâmetros para gerar um novo relatório personalizado.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Tipo de Relatório</Label>
              <Select>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales_by_product">Vendas por Produto</SelectItem>
                  <SelectItem value="client_analysis">Análise de Clientes</SelectItem>
                  <SelectItem value="stock_turnover">Giro de Estoque</SelectItem>
                  <SelectItem value="financial_summary">Resumo Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-range">Período</Label>
              {/* Este é um componente de calendário de exemplo. Pode ser necessário criá-lo. */}
              <Input type="text" placeholder="Selecione um período"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="format">Formato de Exportação</Label>
              <Select defaultValue="PDF">
                <SelectTrigger id="format">
                  <SelectValue placeholder="Selecione um formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="Excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="CSV">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Gerar Relatório
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Gerados</CardTitle>
          <CardDescription>
            Faça o download ou gestione os relatórios gerados anteriormente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Relatório</TableHead>
                <TableHead className="hidden sm:table-cell">Data de Geração</TableHead>
                <TableHead className="hidden sm:table-cell">Formato</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {generatedReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">{report.generationDate}</TableCell>
                  <TableCell className="hidden sm:table-cell">{report.format}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Opções</DropdownMenuLabel>
                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
