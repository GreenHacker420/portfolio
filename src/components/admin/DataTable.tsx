'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, MoreHorizontal, Plus } from 'lucide-react'
import Link from 'next/link'

export interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
}

export interface Action<T> {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick?: (item: T) => void
  href?: (item: T) => string
  variant?: 'default' | 'destructive'
  separator?: boolean
}

interface DataTableProps<T> {
  title: string
  description?: string
  data: T[]
  columns: Column<T>[]
  actions?: Action<T>[]
  searchPlaceholder?: string
  searchKeys?: (keyof T)[]
  isLoading?: boolean
  createHref?: string
  createLabel?: string
  emptyMessage?: string
  filters?: React.ReactNode
}

export function DataTable<T extends Record<string, any>>({
  title,
  description,
  data,
  columns,
  actions = [],
  searchPlaceholder = 'Search...',
  searchKeys = [],
  isLoading = false,
  createHref,
  createLabel = 'Add New',
  emptyMessage = 'No data found',
  filters
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = data.filter(item => {
    if (!searchTerm) return true
    
    return searchKeys.some(key => {
      const value = item[key]
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchTerm.toLowerCase())
      }
      return false
    })
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {createHref && (
          <Button asChild>
            <Link href={createHref}>
              <Plus className="mr-2 h-4 w-4" />
              {createLabel}
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            {searchKeys.length > 0 && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
            {filters}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.key}>
                      {column.label}
                    </TableHead>
                  ))}
                  {actions.length > 0 && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <TableRow key={item.id || index}>
                      {columns.map((column) => (
                        <TableCell key={column.key}>
                          {column.render 
                            ? column.render(item)
                            : item[column.key]
                          }
                        </TableCell>
                      ))}
                      {actions.length > 0 && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              {actions.map((action, actionIndex) => {
                                if (action.separator) {
                                  return <DropdownMenuSeparator key={actionIndex} />
                                }
                                
                                const content = (
                                  <>
                                    {action.icon && (
                                      <action.icon className="mr-2 h-4 w-4" />
                                    )}
                                    {action.label}
                                  </>
                                )

                                if (action.href) {
                                  return (
                                    <DropdownMenuItem key={actionIndex} asChild>
                                      <Link 
                                        href={action.href(item)}
                                        className={action.variant === 'destructive' ? 'text-red-600' : ''}
                                      >
                                        {content}
                                      </Link>
                                    </DropdownMenuItem>
                                  )
                                }

                                return (
                                  <DropdownMenuItem
                                    key={actionIndex}
                                    onClick={() => action.onClick?.(item)}
                                    className={action.variant === 'destructive' ? 'text-red-600' : ''}
                                  >
                                    {content}
                                  </DropdownMenuItem>
                                )
                              })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm 
                          ? 'No items found matching your search'
                          : emptyMessage
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
