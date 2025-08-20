import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, AlertTriangle, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"

const kpiData = [
  {
    title: "Receita Total",
    value: "R$ 2.847.392",
    change: "+20%",
    changeType: "positive" as const,
    period: "vs. mês passado",
    icon: DollarSign,
  },
  {
    title: "Clientes Ativos",
    value: "1.247",
    change: "+12%",
    changeType: "positive" as const,
    period: "vs. mês passado",
    icon: Users,
  },
  {
    title: "Risco de Churn",
    value: "8.2%",
    change: "-3%",
    changeType: "positive" as const,
    period: "vs. mês passado",
    icon: AlertTriangle,
  },
  {
    title: "Margem de Lucro",
    value: "34.8%",
    change: "+5%",
    changeType: "positive" as const,
    period: "vs. mês passado",
    icon: TrendingUp,
  },
]

export function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon
          const ChangeIcon = kpi.changeType === "positive" ? ArrowUpRight : ArrowDownRight

          return (
            <Card key={kpi.title} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground mb-1">{kpi.value}</div>
                <div className="flex items-center text-xs">
                  <ChangeIcon
                    className={`h-3 w-3 mr-1 ${kpi.changeType === "positive" ? "text-primary" : "text-destructive"}`}
                  />
                  <span
                    className={`font-medium ${kpi.changeType === "positive" ? "text-primary" : "text-destructive"}`}
                  >
                    {kpi.change}
                  </span>
                  <span className="text-muted-foreground ml-1">{kpi.period}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Additional Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Vendas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Maquiagem</span>
                <span className="text-sm font-medium text-card-foreground">R$ 1.247.392</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cuidados com a Pele</span>
                <span className="text-sm font-medium text-card-foreground">R$ 892.150</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-accent h-2 rounded-full" style={{ width: "45%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fragrâncias</span>
                <span className="text-sm font-medium text-card-foreground">R$ 707.850</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-chart-3 h-2 rounded-full" style={{ width: "35%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Integração OMIE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status da Conexão</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm font-medium text-primary">Conectado</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Última Sincronização</span>
                <span className="text-sm font-medium text-card-foreground">Há 5 minutos</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Registros Processados</span>
                <span className="text-sm font-medium text-card-foreground">2.847 hoje</span>
              </div>

              <div className="pt-2">
                <div className="text-xs text-muted-foreground mb-2">Próxima sincronização em 25 minutos</div>
                <div className="w-full bg-muted rounded-full h-1">
                  <div className="bg-accent h-1 rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
