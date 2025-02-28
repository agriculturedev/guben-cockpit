import { usePagesGet, usePagesUpdate } from "@/endpoints/gubenComponents";
import { LoadingIndicator } from "@/components/loadingIndicator/loadingIndicator";
import { PageResponse, UpdatePageQuery } from "@/endpoints/gubenSchemas";
import { useErrorToast } from "@/hooks/useErrorToast";
import { usePageFormSchema } from "@/components/admin/pages/usePageFormSchema";
import { z } from "zod";
import { PageForm } from "@/components/admin/pages/PageForm";

interface EditPageFormProps {
  pageId: string
}

export const EditPageForm = ({pageId}: EditPageFormProps) => {
  const {data: pageData, error, isLoading, isFetching, refetch} = usePagesGet({
    pathParams: { id: pageId },
  }, {retry:  false}); // disable retry so going to a new page doesn't take too long


  if (isLoading || isFetching)
    return (<LoadingIndicator/>)

  if (pageData != null && pageData.id == pageId)
    return (<Form page={pageData} refetch={refetch} />);

  const newPage: PageResponse = {
    id: pageId,
    title: "",
    description: "",
  }

  return (<Form page={newPage} refetch={refetch} />);
}


interface FormProps {
  page: PageResponse;
  refetch: () => Promise<any>;
}

const Form = ({page, refetch}: FormProps) => {
  const mutation = usePagesUpdate({
    onSuccess: async () => {
      await refetch();
    },
    onError: (error) => {
      useErrorToast(error);
    }
  });

  const {formSchema, form} = usePageFormSchema(page);

  function onSubmit(values: z.infer<typeof formSchema>) {
    var updateQuery: UpdatePageQuery = {
      id: page.id,
      title: values.title,
      description: values.description,
    }

    mutation.mutate({body: updateQuery, pathParams: {id: page.id}});
  }

  return (
    <PageForm form={form} onSubmit={onSubmit}/>
  )
}
