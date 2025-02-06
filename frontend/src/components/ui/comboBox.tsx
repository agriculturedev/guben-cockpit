
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { LoadingIndicator } from "@/components/loadingIndicator/loadingIndicator";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export interface ComboboxOption {
  label: string;
  value: string;
  hasPriority?: boolean;
}

interface ComboboxProps {
  options: ComboboxOption[];
  placeholder: string;
  onSelect: (value: string | null) => void;
  value?: string | null;
  defaultOpen?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

export const Combobox = ({
                           options,
                           placeholder,
                           onSelect,
                           value,
                           defaultOpen = false,
                           isLoading = false,
                           disabled = false
                         }: ComboboxProps) => {
  const {t} = useTranslation();
  const [open, setOpen] = React.useState(defaultOpen);

  if (options.length === 1 && value == null) {
    onSelect(options[0].value);
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-fit min-w-[200px] justify-between overflow-visible px-1 gap-1"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      {!disabled &&
        <PopoverContent className="w-[200px] p-0">
          <Command filter={(value, search) => {
            const lowerCaseSearch = search.toLowerCase();

            const validOptions = options.filter((option) =>
              option.label
                .toLowerCase()
                .includes(lowerCaseSearch))
              .map(vo => vo.value);

            if (validOptions.includes(value)) return 1;
            return 0;
          }}>
            <CommandInput placeholder={placeholder}/>
            <CommandList>
              {isLoading
                ? <CommandGroup className={"flex justify-center"}><LoadingIndicator/></CommandGroup>
                : <CommandEmpty>{t("NoItemsFound")}</CommandEmpty>
              }

              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onSelect(currentValue === value ? null : currentValue)
                      setOpen(false)
                    }}
                    className={option.hasPriority ? "font-bold" : ""}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      }
    </Popover>
  )
}
