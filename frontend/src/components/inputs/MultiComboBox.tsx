import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command";
import { useTranslation } from "react-i18next";
import { LoadingIndicator } from "@/components/loadingIndicator/loadingIndicator";
import { cn } from "@/lib/utils";
import {useCallback, useMemo, useState} from "react";

export interface ComboboxOption {
  label: string;
  value: string;
  hasPriority?: boolean;
}

interface ComboboxProps {
  options: ComboboxOption[];
  placeholder: string;
  onSelect: (values: string[]) => void;
  defaultValues?: string[];
  defaultOpen?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

export const MultiComboBox = ({
                           options,
                           placeholder,
                           onSelect,
                           defaultValues = [],
                           defaultOpen = false,
                           isLoading = false,
                           disabled = false
                         }: ComboboxProps) => {

  const {t} = useTranslation();
  const [open, setOpen] = React.useState(defaultOpen);
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValues
    ?.toSorted((a,b) => a.localeCompare(b)));

  const optionsIndex = useMemo(() => {
    return options.reduce((acc, val) => {
      acc[val.value] = val;
      return acc;
    }, {} as Record<string, ComboboxOption>);
  } ,[options]);

  const unselectedValues = useMemo(() => {
    return options.reduce((acc: string[], val) => {
      if (selectedValues.indexOf(val.value) === -1) acc.push(val.value);
      return acc;
    }, [])
      .toSorted((a, b) => a.localeCompare(b));
  }, [selectedValues, options]);

  const handleItemSelect = useCallback((selectedValue: string) => {
    setSelectedValues(curr => {
      const index = curr?.findIndex(i => i === selectedValue);
      if (index > -1) curr.splice(index, 1);
      else curr.push(selectedValue);
      onSelect([...curr]);
      return [...curr];
    });
  }, []);

  const filter = (value: string, search: string)=> {
    return options
      .filter((option) => option.label.toLowerCase().includes(search.toLowerCase()))
      .map(vo => vo.value)
      .includes(value) ? 1 : 0
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[12rem] justify-between overflow-hidden bg-white"
        >
          {t("ItemsSelected", {count: selectedValues.length})}
          <ChevronsUpDown className="opacity-50"/>
        </Button>
      </PopoverTrigger>
      {!disabled &&
        <PopoverContent className="w-fit p-0">
          <Command filter={filter}>
            <CommandInput placeholder={placeholder}/>
            <CommandList>
              {isLoading ? <LoadingIndicator /> : (
                <>
                  <CommandEmpty>{t("NoItemsFound")}</CommandEmpty>
                  {selectedValues.length > 0 && (
                    <>
                      <CommandGroup heading={t("SelectedItems")}>
                        {selectedValues.map((value) => {
                          const option = optionsIndex[value]
                          return option && (
                            <CommandItem
                              key={option.value}
                              value={option.value}
                              onSelect={handleItemSelect}
                              className={option.hasPriority ? "font-bold" : ""}
                            >
                              {option.label}
                              <Check className={cn("ml-auto")}/>
                            </CommandItem>
                        )})}
                      </CommandGroup>
                      <CommandSeparator />
                    </>
                  )}

                  <CommandGroup heading={t("Items")}>
                    {unselectedValues.map((value) => {
                      const option = optionsIndex[value]
                      return (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={handleItemSelect}
                          className={option.hasPriority ? "font-bold" : ""}
                        >
                          {option.label}
                        </CommandItem>
                      )})}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      }
    </Popover>
  )
}

export default MultiComboBox;
