import { useGetUsersQuery } from "../../features/user/userApiSlice";

const UserList = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading users.</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

export default UserList;
