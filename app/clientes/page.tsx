"use client"

import React, { useState, useEffect } from "react"
import { MoreHorizontal, PlusCircle, Search, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Interface para definir a estrutura de um cliente vindo da API
interface Client {
  codigo_cliente_omie: number
  nome_fantasia: string
  email: string
  tags: { tag: string }[] // As tags podem indicar o status (VIP, Ativo, etc.)
  // Adicione outros campos que a API da Omie retorna e que sejam úteis
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch("/api/clientes", {
          method: "POST", // A nossa API espera um POST
        })
        const result = await response.json()

        if (result.success) {
          setClients(result.data || [])
        } else {
          throw new Error(result.message || "Falha ao buscar clientes.")
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, []) // O array vazio [] faz com que isto execute apenas uma vez, quando a página carrega

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Análise de Clientes</h1>
        <p className="text-muted-foreground">Segmente, analise e entenda o comportamento dos seus clientes.</p>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
          <CardDescription>
            Gestão e análise da sua base de clientes em tempo real.
          </CardDescription>
          <div className="flex items-center gap-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Procurar por nome ou email..." className="pl-8" />
            </div>
            <Button variant="outline">Filtrar</Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Cliente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="ml-4">A carregar clientes da Omie...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-10 text-red-600">
              <p><strong>Ocorreu um erro:</strong> {error}</p>
              <p className="text-sm text-muted-foreground mt-2">Verifique as suas credenciais da API Omie nas configurações e tente novamente.</p>
            </div>
          )}
          {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.codigo_cliente_omie}>
                    <TableCell>
                      <div className="font-medium">{client.nome_fantasia}</div>
                      <div className="text-sm text-muted-foreground">
                        {client.email || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {client.tags.map(tagInfo => (
                        <Badge key={tagInfo.tag} variant="secondary" className="mr-1">{tagInfo.tag}</Badge>
                      ))}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
