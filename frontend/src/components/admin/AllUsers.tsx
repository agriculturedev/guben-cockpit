import { EventResponse } from "@/endpoints/gubenSchemas";
import { EventCard } from "@/components/events/EventCard";
import { useUsersGetAll } from "@/endpoints/gubenComponents";
import { useAuthHeaders } from "@/hooks/useAuthHeaders";

export const UserList = () => {
  const headers = useAuthHeaders()

  const {data: allUsersResponse, refetch, isLoading} = useUsersGetAll({
    ...headers
  });

  const users = allUsersResponse?.users;


  return (
    <div className={"grid grid-cols-3 gap-2"}>
      {users &&
        users.map((user, index) => (
          <div key={index} >
            {user.id}
          </div>
        ))
      }
    </div>
  )
}
