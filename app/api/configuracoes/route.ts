import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Esta API irá guardar as configurações na sua base de dados Supabase.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { omieAppKey, omieAppSecret, openaiApiKey } = body // Recebe a nova chave

    if (!omieAppKey || !omieAppSecret || !openaiApiKey) {
      return NextResponse.json(
        { success: false, message: "Todas as chaves de API são obrigatórias." },
        { status: 400 }
      )
    }

    // --- Conexão com o Supabase ---
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        return NextResponse.json(
            { success: false, message: "Credenciais do Supabase não configuradas no servidor." },
            { status: 500 }
        )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Atualiza a linha de configuração com todas as chaves
    const { error } = await supabase
      .from("configuracoes")
      .upsert({ 
        id: 1, 
        omie_app_key: omieAppKey, 
        omie_app_secret: omieAppSecret,
        openai_api_key: openaiApiKey, // Guarda a nova chave
      })
      .select()

    if (error) {
      console.error("Erro do Supabase:", error)
      throw new Error("Falha ao guardar as credenciais na base de dados.")
    }
    // -----------------------------

    return NextResponse.json({ success: true, message: "Configurações guardadas com sucesso!" })

  } catch (error: any) {
    console.error("Erro ao guardar as configurações:", error)
    return NextResponse.json({ success: false, message: error.message || "Erro interno do servidor." }, { status: 500 })
  }
}
