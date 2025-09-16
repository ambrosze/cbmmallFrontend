import debounce from '@/utils/debounce'
import { Icon } from '@iconify/react'
import React, { useCallback } from 'react'
import { twMerge } from 'tailwind-merge'

interface IProps {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  placeholder: string
  className?: string
  debounceTimer: number
  iconColor?: string
}

const InputSearch: React.FC<IProps> = ({search, setSearch, placeholder, className, debounceTimer, iconColor}) => {
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearch(value)
    }, debounceTimer),
    [setSearch]
  )

  return (
    <div className="relative w-full">
      <Icon icon="iconamoon:search-light" className={twMerge('absolute left-4 top-1/2 -translate-y-1/2', iconColor)} />
      <input
        type="text"
        className={twMerge(
          'hover:border-primary-40 focus:ring-darkColor w-full rounded-[8px] py-[10px] pl-10 pr-[40px] font-light placeholder:text-sm focus:outline-none focus:ring-1',
          className
        )}
        placeholder={placeholder}
        name="search"
        id="search"
        autoComplete="off"
        onChange={e => debouncedSearch(e.target.value)}
        value={search}
      />
    </div>
  )
}

export default InputSearch
