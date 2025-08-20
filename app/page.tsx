"use client"

import React, { useState, useEffect } from "react"
import { DollarSign, Users, Package, AlertTriangle, ArrowUpRight, ArrowDownRight, Target, TrendingUp, RefreshCw, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

// --- Interfaces ---
interface SyncResult {
  success: boolean;
  message: string;
}

interface DashboardData {
    totalRevenue: number;
    activeClients: number;
}

// --- Dados de Exemplo (Mock Data para os gráficos) ---
const monthlyRevenueData = [
  { month: "Jan", revenue: 4000, profit: 2400 }, { month: "Fev", revenue: 3000, profit: 1800 },
  { month: "Mar", revenue: 5000, profit: 3200 }, { month: "Abr", revenue: 4500, profit: 2800 },
  { month: "Mai", revenue: 6000, profit: 4000 }, { month: "Jun", revenue: 5500, profit: 3500 },
]
const topProductsData = [
  { name: "Sérum Vitamina C", value: 400 }, { name: "Máscara Hidratante", value: 300 },
  { name: "Shampoo Nutritivo", value: 250 }, { name: "Batom Matte", value: 200 },
  { name: "Protetor Solar", value: 150 },
]
const churnRiskData = [
  { name: "Baixo Risco", value: 1890 }, { name: "Médio Risco", value: 420 },
  { name: "Alto Risco", value: 130 },
]
const newVsReturningCustomersData = [
    { month: "Jan", new: 65, returning: 35 }, { month: "Fev", new: 70, returning: 40 },
    { month: "Mar", new: 80, returning: 55 }, { month: "Abr", new: 85, returning: 60 },
    { month: "Mai", new: 95, returning: 70 }, { month: "Jun", new: 110, returning: 85 },
]
const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

// --- Componentes do Dashboard ---
function StatCard({ title, value, icon: Icon, trend, trendType, loading }: { title: string, value: string, icon: React.ElementType, trend?: string, trendType?: "positive" | "negative", loading?: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="h-10 flex items-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        ) : (
            <>
                <div className="text-2xl font-bold">{value}</div>
                {trend && trendType && (
                    <p className={`text-xs ${trendType === 'positive' ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                    {trendType === 'positive' ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                    {trend} em relação ao mês passado
                    </p>
                )}
            </>
        )}
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      const response = await fetch("/api/dashboard");
      const result = await response.json();
      if (result.success) {
        setDashboardData(result.data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const response = await fetch("/api/sincronizar");
      const result = await response.json();
      setSyncResult(result);
      if (result.success) {
        // Se a sincronização for bem-sucedida, busca os dados atualizados para o dashboard.
        await fetchDashboardData();
      }
    } catch (error) {
      setSyncResult({ success: false, message: "Erro de conexão ao sincronizar." });
    } finally {
      setSyncing(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Executivo</h1>
            <p className="text-muted-foreground">Visão geral do seu negócio de cosméticos em tempo real.</p>
        </div>
        <Button onClick={handleSync} disabled={syncing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? "A Sincronizar..." : "Sincronizar Dados com Omie"}
        </Button>
      </header>

      {syncResult && (
        <Alert className={syncResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <div className="flex items-center gap-2">
            {syncResult.success ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
            <AlertDescription className={syncResult.success ? "text-green-800" : "text-red-800"}>
              {syncResult.message}
            </AlertDescription>
          </div>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            title="Receita Total" 
            value={dashboardData ? formatCurrency(dashboardData.totalRevenue) : 'R$ 0,00'} 
            icon={DollarSign} 
            loading={loadingData}
        />
        <StatCard 
            title="Clientes Únicos" 
            value={dashboardData ? dashboardData.activeClients.toString() : '0'} 
            icon={Users} 
            loading={loadingData}
        />
        <StatCard title="Margem de Lucro (Exemplo)" value="48,2%" icon={TrendingUp} trend="+1.2%" trendType="positive" />
        <StatCard title="Risco de Ruptura (Exemplo)" value="8" icon={AlertTriangle} trend="+2" trendType="negative" />
      </div>
      
      {/* Os gráficos abaixo ainda usam dados de exemplo. Serão conectados no futuro. */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Receita e Lucro (Exemplo)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <RechartsLineChart data={monthlyRevenueData}>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value / 1000}k`} />
                <Tooltip formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Receita" stroke="#3b82f6" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="profit" name="Lucro" stroke="#82ca9d" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top 5 Produtos (Exemplo)</CardTitle>
            <CardDescription>Análise do último mês.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RechartsBarChart layout="vertical" data={topProductsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                 <Tooltip formatter={(value: number) => `${value} unidades`} />
                 <Bar dataKey="value" name="Unidades Vendidas" fill="#3b82f6" background={{ fill: '#eee' }} barSize={20} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
