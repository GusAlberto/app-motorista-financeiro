'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/validation/transaction'

interface TransactionFiltersProps {
  defaultPeriod?: string
  defaultType?: string
  defaultCategory?: string
  defaultSearch?: string
}

const PERIOD_LABELS: Record<string, string> = {
  today: 'Hoje',
  week: 'Esta Semana',
  month: 'Este Mês',
  year: 'Este Ano',
}

const TYPE_LABELS: Record<string, string> = {
  all: 'Todos os Tipos',
  income: 'Ganhos',
  expense: 'Despesas',
}

const selectClasses =
  'px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 text-slate-900 dark:text-white disabled:opacity-50 text-sm font-medium'

export function TransactionFilters({
  defaultPeriod = 'month',
  defaultType = 'all',
  defaultCategory = '',
  defaultSearch = '',
}: TransactionFiltersProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [period, setPeriod] = useState(defaultPeriod)
  const [type, setType] = useState(defaultType)
  const [category, setCategory] = useState(defaultCategory)
  const [search, setSearch] = useState(defaultSearch)

  // Get available categories based on selected type
  const availableCategories =
    type === 'income' ? INCOME_CATEGORIES : type === 'expense' ? EXPENSE_CATEGORIES : []

  // Update URL params
  const updateFilters = (
    newPeriod?: string,
    newType?: string,
    newCategory?: string,
    newSearch?: string
  ) => {
    const params = new URLSearchParams()

    if (newPeriod || period) params.set('period', newPeriod || period)
    if (newType || type) params.set('type', newType || type)
    if (newCategory || category) params.set('category', newCategory || category)
    if (newSearch || search) params.set('search', newSearch || search)

    startTransition(() => {
      router.push(`/transactions?${params.toString()}`)
    })
  }

  const handlePeriodChange = (value: string) => {
    setPeriod(value)
    updateFilters(value, type, category, search)
  }

  const handleTypeChange = (value: string) => {
    setType(value)
    setCategory('') // Reset category when changing type
    updateFilters(period, value, '', search)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    updateFilters(period, type, value, search)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    updateFilters(period, type, category, value)
  }

  const hasActiveFilters = period !== 'month' || type !== 'all' || category !== '' || search !== ''

  const handleClearFilters = () => {
    setPeriod('month')
    setType('all')
    setCategory('')
    setSearch('')
    startTransition(() => {
      router.push('/transactions')
    })
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          type="text"
          placeholder="Buscar por descrição ou categoria..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:ring-amber-400"
        />
      </div>

      {/* Filter controls */}
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <select
          value={period}
          onChange={(e) => handlePeriodChange(e.target.value)}
          disabled={isPending}
          className={selectClasses}
        >
          <option value="today">Hoje</option>
          <option value="week">Esta Semana</option>
          <option value="month">Este Mês</option>
          <option value="year">Este Ano</option>
        </select>

        <select
          value={type}
          onChange={(e) => handleTypeChange(e.target.value)}
          disabled={isPending}
          className={selectClasses}
        >
          <option value="all">Todos os Tipos</option>
          <option value="income">Ganhos</option>
          <option value="expense">Despesas</option>
        </select>

        {type !== 'all' && availableCategories.length > 0 && (
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            disabled={isPending}
            className={selectClasses}
          >
            <option value="">Todas as Categorias</option>
            {availableCategories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        )}

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            disabled={isPending}
            className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Limpar
          </button>
        )}
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {period !== 'month' && (
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <span>Período: {PERIOD_LABELS[period] || period}</span>
              <button
                onClick={() => handlePeriodChange('month')}
                aria-label="Remover filtro de período"
                className="hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          )}

          {type !== 'all' && (
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <span>Tipo: {TYPE_LABELS[type] || type}</span>
              <button
                onClick={() => handleTypeChange('all')}
                aria-label="Remover filtro de tipo"
                className="hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          )}

          {category && (
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <span>Categoria: {[...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].find((c) => c.value === category)?.label || category}</span>
              <button
                onClick={() => handleCategoryChange('')}
                aria-label="Remover filtro de categoria"
                className="hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          )}

          {search && (
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <span>Busca: &ldquo;{search}&rdquo;</span>
              <button
                onClick={() => handleSearchChange('')}
                aria-label="Remover filtro de busca"
                className="hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
