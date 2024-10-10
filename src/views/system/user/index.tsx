// UserList
import UsersPrimary from '@/views/system/user/UsersPrimary.tsx'
import UsersSecondary from '@/views/system/user/UsersSecondary.tsx'

export default function UserList() {
  const usePrimary = false
  return usePrimary ? <UsersPrimary /> : <UsersSecondary />
}
