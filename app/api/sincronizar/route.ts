import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Esta API será o nosso "motor" de sincronização de dados.
// No futuro, ela será acionada automaticamente por um Cron Job.
export async function GET(request: NextRequest) {
  try {
    console.log("Iniciando processo de sincronização...")

    // --- 1. Obter as credenciais do Supabase ---
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Credenciais do Supabase não configuradas.")
    }
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    const { data: config, error: configError } = await supabase
      .from("configuracoes")
      .select("omie_app_key, omie_app_secret")
      .limit(1)
      .single()

    if (configError || !config) {
      throw new Error("Falha ao obter as credenciais da Omie do Supabase.")
    }

    const { omie_app_key: appKey, omie_app_secret: appSecret } = config

    // --- 2. Buscar dados da Omie (Exemplo: Contas a Receber) ---
    // CORREÇÃO: Removido o parâmetro 'apenas_titulos_em_aberto' que causava o erro.
    const omiePayload = {
      call: "ListarContasReceber",
      app_key: appKey,
      app_secret: appSecret,
      param: [{ pagina: 1, registros_por_pagina: 100 }],
    }

    console.log("A buscar dados de Contas a Receber na Omie...")
    const omieResponse = await fetch("https://app.omie.com.br/api/v1/financas/contareceber/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(omiePayload),
    })

    const data = await omieResponse.json()

    if (data.faultstring) {
      throw new Error(`Erro da API Omie: ${data.faultstring}`)
    }

    const contasReceber = data.conta_receber_cadastro
    console.log(`Sucesso! ${contasReceber.length} contas a receber foram encontradas.`)

    // --- 3. Formatar e Guardar os dados no Supabase ---
    if (contasReceber && contasReceber.length > 0) {
      const dadosFormatados = contasReceber.map((conta: any) => ({
        codigo_lancamento_omie: conta.codigo_lancamento,
        codigo_cliente_omie: conta.codigo_cliente_fornecedor,
        valor_documento: conta.valor_documento,
        data_vencimento: conta.data_vencimento,
        data_emissao: conta.data_emissao,
      }));

      console.log(`A inserir/atualizar ${dadosFormatados.length} registos na tabela 'vendas'...`);
      
      const { error: upsertError } = await supabase
        .from("vendas")
        .upsert(dadosFormatados, { onConflict: 'codigo_lancamento_omie' });

      if (upsertError) {
        console.error("Erro ao guardar dados no Supabase:", upsertError);
        throw new Error("Falha ao guardar os dados de vendas na base de dados.");
      }

      console.log("Dados guardados no Supabase com sucesso!");
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Sincronização concluída com sucesso.",
      registros_processados: contasReceber.length,
    })

  } catch (error: any) {
    console.error("Falha no processo de sincronização:", error)
    return NextResponse.json({ success: false, message: error.message || "Erro interno do servidor." }, { status: 500 })
  }
}
