import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Esta API busca os dados processados da nossa base de dados para alimentar o dashboard.
export async function GET(request: NextRequest) {
  try {
    // --- Conectar ao Supabase ---
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Credenciais do Supabase não configuradas.")
    }
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    // --- Realizar as Consultas à Base de Dados ---
    
    // 1. Calcular a Receita Total (soma de todos os valores na tabela 'vendas')
    const { data: revenueData, error: revenueError } = await supabase
      .from("vendas")
      .select("valor_documento")

    if (revenueError) throw new Error("Falha ao buscar dados de receita.")

    const totalRevenue = revenueData.reduce((acc, sale) => acc + sale.valor_documento, 0)

    // 2. Contar Clientes Únicos (exemplo de outra métrica)
    const { data: clientsData, error: clientsError } = await supabase
        .from("vendas")
        .select("codigo_cliente_omie", { count: 'exact', head: true })

    if(clientsError) throw new Error("Falha ao contar clientes.")
    
    // Por enquanto, os outros dados continuarão a ser de exemplo.
    // No futuro, adicionaremos mais consultas aqui para calcular todos os KPIs.
    const dashboardData = {
        totalRevenue: totalRevenue,
        activeClients: clientsData?.count || 0,
        // ...outros KPIs seriam calculados aqui
    }

    return NextResponse.json({ success: true, data: dashboardData })

  } catch (error: any) {
    console.error("Falha ao buscar dados para o dashboard:", error)
    return NextResponse.json({ success: false, message: error.message || "Erro interno do servidor." }, { status: 500 })
  }
}
