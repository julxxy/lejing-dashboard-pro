import RoleModal from '@/views/system/role/RoleModal.tsx'
import { useEffect, useRef } from 'react'
import { ModalAction } from '@/types/modal.ts'
import { Menu } from '@/types/apiTypes.ts'
import { isDebugEnable, log } from '@/common/Logger.ts'

export default function RoleList() {
  const roleRef = useRef<ModalAction>({
    openModal: (action, data?: Menu.EditParams | { parentId?: string; orderBy?: number }) => {
      if (isDebugEnable) log.info('开开弹窗: ', action, data)
    },

    closeModal: () => {},
  })

  useEffect(() => {}, [])

  return (
    <div className={'sidebar-submenu'}>
      <RoleModal currentRef={roleRef} onRefresh={() => {}} />
    </div>
  )
}
