"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"


interface ApiResponse {
  success: boolean
  message: string
}

export default function SettingsPage() {
  const [omieAppKey, setOmieAppKey] = useState("")
  const [omieAppSecret, setOmieAppSecret] = useState("")
  const [openaiApiKey, setOpenaiApiKey] = useState("") // Novo estado para a chave da IA
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ApiResponse | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/configuracoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ omieAppKey, omieAppSecret, openaiApiKey }), // Envia a nova chave
      })

      const data: ApiResponse = await response.json()
      setResult(data)

    } catch (error) {
      setResult({
        success: false,
        message: "Erro de conexão. Tente novamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
        <p className="text-muted-foreground">Gestão de integrações e definições da aplicação.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Configuração das APIs</CardTitle>
          <CardDescription>
            Insira as suas credenciais para conectar a aplicação às APIs externas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Secção Omie */}
            <div className="space-y-4 rounded-md border p-4">
                <h3 className="font-semibold">Integração com Omie</h3>
                <div className="space-y-2">
                    <Label htmlFor="omie-app-key">OMIE_APP_KEY</Label>
                    <Input 
                    id="omie-app-key" 
                    placeholder="Cole a sua App Key da Omie aqui" 
                    type="password" 
                    value={omieAppKey}
                    onChange={(e) => setOmieAppKey(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="omie-app-secret">OMIE_APP_SECRET</Label>
                    <Input 
                    id="omie-app-secret" 
                    placeholder="Cole a sua App Secret da Omie aqui" 
                    type="password" 
                    value={omieAppSecret}
                    onChange={(e) => setOmieAppSecret(e.target.value)}
                    />
                </div>
            </div>

            {/* Secção IA */}
            <div className="space-y-4 rounded-md border p-4">
                <h3 className="font-semibold">Integração com IA (OpenAI)</h3>
                <div className="space-y-2">
                    <Label htmlFor="openai-api-key">OPENAI_API_KEY</Label>
                    <Input 
                    id="openai-api-key" 
                    placeholder="Cole a sua API Key da OpenAI aqui" 
                    type="password" 
                    value={openaiApiKey}
                    onChange={(e) => setOpenaiApiKey(e.target.value)}
                    />
                </div>
            </div>

            <Button type="submit" disabled={loading || !omieAppKey || !omieAppSecret || !openaiApiKey}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A guardar...
                </>
              ) : (
                "Guardar Configurações"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <div className="flex items-center gap-2">
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
              {result.message}
            </AlertDescription>
          </div>
        </Alert>
      )}
    </div>
  )
}
