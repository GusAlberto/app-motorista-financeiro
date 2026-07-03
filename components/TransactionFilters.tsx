'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, X } from 'lucide-react'
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
  const [showCategoryFilter, setShowCategoryFilter] = useState(false)

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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por descrição ou categoria..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* Filter controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Period select */}
        <select
          value={period}
          onChange={(e) => handlePeriodChange(e.target.value)}
          disabled={isPending}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white disabled:opacity-50"
        >
          <option value="today">Hoje</option>
          <option value="week">Esta Semana</option>
          <option value="month">Este Mês</option>
          <option value="year">Este Ano</option>
        </select>

        {/* Type select */}
        <select
          value={type}
          onChange={(e) => handleTypeChange(e.target.value)}
          disabled={isPending}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white disabled:opacity-50"
        >
          <option value="all">Todos os Tipos</option>
          <option value="income">Ganhos</option>
          <option value="expense">Despesas</option>
        </select>

        {/* Category select (only when type is selected) */}
        {type !== 'all' && availableCategories.length > 0 && (
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            disabled={isPending}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white disabled:opacity-50"
          >
            <option value="">Todas as Categorias</option>
            {availableCategories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        )}

        {/* Clear filters button */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Limpar
          </button>
        )}
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {period !== 'month' && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-sm">
              <span>Período: {PERIOD_LABELS[period] || period}</span>
              <button
                onClick={() => handlePeriodChange('month')}
                className="hover:text-blue-600 dark:hover:text-blue-300"
              >
                ✕
              </button>
            </div>
          )}

          {type !== 'all' && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-sm">
              <span>Tipo: {TYPE_LABELS[type] || type}</span>
              <button
                onClick={() => handleTypeChange('all')}
                className="hover:text-blue-600 dark:hover:text-blue-300"
              >
                ✕
              </button>
            </div>
          )}

          {category && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-sm">
              <span>Categoria: {[...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].find((c) => c.value === category)?.label || category}</span>
              <button
                onClick={() => handleCategoryChange('')}
                className="hover:text-blue-600 dark:hover:text-blue-300"
              >
                ✕
              </button>
            </div>
          )}

          {search && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-sm">
              <span>Busca: "{search}"</span>
              <button
                onClick={() => handleSearchChange('')}
                className="hover:text-blue-600 dark:hover:text-blue-300"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
