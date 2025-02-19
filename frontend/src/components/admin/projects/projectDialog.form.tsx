import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { formDefaults, formSchema, FormSchema } from "./projectDialog.formSchema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface IProps {
  defaultData?: FormSchema;
  onSubmit: (form: FormSchema) => void;
}

export default function ProjectDialogForm(props: IProps) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaults
  })

  //ensure form is reset on mount
  useEffect(() => form.reset(props.defaultData ?? formDefaults), [props.defaultData]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={field => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Input placeholder="placeholder" {...field} />
              </FormControl>
              <FormDescription>this is a description</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
