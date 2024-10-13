import UsersDefault from '@/views/system/user/UsersDefault.tsx'
import UsersPrimary from '@/views/system/user/UsersPrimary.tsx'

export default function UserManagement() {
  const usePrimary = false
  return usePrimary ? <UsersDefault /> : <UsersPrimary />
}
