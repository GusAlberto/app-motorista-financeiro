# Timezone Transaction Date Bug — Investigação

## Problema Relatado
- Usuário no Brasil (UTC-3/UTC-2) loga uma despesa de madrugada
- A `transaction_date` fica salva com data do dia **anterior**
- Ex.: madrugada do dia 3 vira dia 2 no BD

## Root Cause

### Código problemático (IncomeForm.tsx:43-60)
```typescript
// L43: Inicial
const [date, setDate] = useState<string>(
  new Date().toISOString().split('T')[0]  // "2024-03-03" (string ISO)
)

// L60: Envio pro servidor
transaction_date: new Date(date),  // ❌ "2024-03-03" → Date as UTC midnight
```

### Por que falha
1. `new Date("2024-03-03")` é **interpretado como UTC midnight** (00:00:00Z)
2. Se o usuário está em São Paulo de madrugada (ex. 03:00 local = 06:00 UTC), a **hora local é perdida**
3. O servidor recebe uma Data UTC que, quando convertida de volta pro timezone local, pode estar no dia anterior

### Exemplo da falha
- Usuário no Brasil (UTC-3), 01:00 da madrugada do dia 3
- Pega `new Date().toISOString().split('T')[0]` → "2024-03-03"
- Envia `new Date("2024-03-03")` → `Date { 2024-03-03T00:00:00Z }` (UTC)
- Servidor salva como UTC "2024-03-03T00:00:00Z"
- Quando o BD/app converte de volta pra horário Brasil: 03:00 local do dia 2 (21:00 UTC do dia 2)

## Solução
Duas abordagens:

### A) Enviar data como STRING (recomendado)
Não converter pra Date object, enviar diretamente como string "YYYY-MM-DD" e deixar o servidor tratar como data local do usuário.

### B) Normalizar pra UTC no cliente
Capturar a data em timezone local, adicionar a hora atual, e garantir que esteja na mesma data antes de enviar.

**Escolhemos A** pois é mais simples e seguro: o servidor trata a data como local do usuário, sem conversão de timezone no cliente.
