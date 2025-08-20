import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Esta API irá buscar as credenciais no Supabase e depois os clientes na Omie.
export async function POST(request: NextRequest) {
  try {
    // --- 1. Conectar ao Supabase para obter as credenciais ---
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { success: false, message: "Credenciais do Supabase não configuradas no servidor." },
        { status: 500 }
      )
    }
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Busca a primeira (e única) linha da tabela de configurações
    const { data: config, error: configError } = await supabase
      .from("configuracoes")
      .select("omie_app_key, omie_app_secret")
      .limit(1)
      .single() // .single() garante que obtemos um objeto, não um array

    if (configError || !config) {
      console.error("Erro ao buscar configurações no Supabase:", configError)
      throw new Error("Falha ao obter as credenciais da Omie. Verifique se estão guardadas na página de Configurações.")
    }

    const { omie_app_key: appKey, omie_app_secret: appSecret } = config

    if (!appKey || !appSecret) {
        return NextResponse.json(
            { success: false, message: "As credenciais da Omie não foram encontradas na base de dados." },
            { status: 404 }
        )
    }

    // --- 2. Usar as credenciais para contactar a Omie ---
    const omiePayload = {
      call: "ListarClientes",
      app_key: appKey,
      app_secret: appSecret,
      param: [{ pagina: 1, registros_por_pagina: 50 }],
    }

    const omieResponse = await fetch("https://app.omie.com.br/api/v1/geral/clientes/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(omiePayload),
    })

    const data = await omieResponse.json()

    if (data.faultstring) {
      console.error("Erro da API Omie:", data.faultstring)
      return NextResponse.json({ success: false, message: data.faultstring }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: data.clientes_cadastro })

  } catch (error: any) {
    console.error("Erro no processo de busca de clientes:", error)
    return NextResponse.json({ success: false, message: error.message || "Erro interno do servidor." }, { status: 500 })
  }
}
