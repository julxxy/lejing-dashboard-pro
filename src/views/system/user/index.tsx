// UserList
import UserListPrimary from '@/views/system/user/UserListPrimary.tsx'
import UserListSecondary from '@/views/system/user/UserListSecondary.tsx'

export default function UserList() {
  const usePrimary = false
  return usePrimary ? <UserListPrimary /> : <UserListSecondary />
}
