import React, { useEffect, useImperativeHandle, useState } from 'react'
import { Action, IModalProps, ModalVariables } from '@/types/modal.ts'
import { Form, Modal, Tree, TreeDataNode, TreeProps } from 'antd'
import { isDebugEnable, log } from '@/common/Logger.ts'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Menu, Role } from '@/types/apiType.ts'
import api from '@/api'
import { MenuType } from '@/types/appEnum.ts'
import { message } from '@/context/AntdGlobalProvider.ts'

/**
 * 权限弹窗
 */
export default function PermissionModal({ currentRef, onRefresh }: IModalProps) {
  const [showModal, setShowModal] = useState(false)
  const [treeMenus, setTreeMenus] = useState<TreeDataNode[]>([]) // 统一为 TreeDataNode[]
  const [roleDetail, setRoleDetail] = useState<Role.RoleDetail>()
  const [permission, setPermission] = useState<Role.Permission>()
  const [defaultExpandAll, setDefaultExpandAll] = useState(false)
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [form] = Form.useForm() // 使用 Antd Form
  // Expose methods to parent component
  useImperativeHandle(currentRef, () => modalController)
  const modalController = {
    openModal: (action: Action, data?: any) => {
      if (isDebugEnable) log.info('收到父组件的弹窗显示请求: ', action, data)
      setShowModal(true)
      setRoleDetail(data)
      setCheckedKeys((data as Role.Permission).permissionList.checkedKeys || [])
    },
    closeModal: () => {
      setShowModal(false)
      form.resetFields()
    },
  }

  // 获取树形权限菜单
  const initTreeMenus = async () => {
    const data = await api.menu.getMenus(undefined)
    const treeData = transformMenuToTreeData(data) // 转换为 TreeDataNode[]
    setTreeMenus(treeData)
    if (isDebugEnable) log.debug('转换 Menu.Item[] 为 TreeDataNode[]: ', treeData)
    setDefaultExpandAll(true)
  }

  // 转换 Menu.Item[] 为 TreeDataNode[]
  const transformMenuToTreeData = (menus: Menu.Item[]): TreeDataNode[] => {
    return menus.map(menu => ({
      title: menu.menuName, // Map 'menuName' to 'title'
      key: menu._id, // Map '_id' to 'key'
      children: menu.children ? transformMenuToTreeData(menu.children) : undefined, // Recursively map children
      menu, // Keep original 'Menu.Item' object
    }))
  }

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue, item: any) => {
    if (isDebugEnable) log.debug('Checked keys value:', checkedKeysValue, item)
    setCheckedKeys(checkedKeysValue as React.Key[])
    const { checkedNodes, halfCheckedKeys } = item
    const checkedKeys: string[] = []
    const parentKeys: string[] = []
    checkedNodes.map((_item: any) => {
      const { menu } = _item
      if (isDebugEnable) log.debug('Checked menu:', menu)
      const target = menu as Menu.Item
      if (target.menuType == MenuType.btn.code) {
        checkedKeys.push(target._id)
      } else {
        parentKeys.push(target._id)
      }
    })
    setPermission({
      _id: roleDetail?._id ?? '',
      permissionList: {
        checkedKeys,
        halfCheckedKeys: [...parentKeys, halfCheckedKeys],
      },
    })
    if (isDebugEnable) log.debug('Permission:', permission)
  }

  function handleSetPermissions() {
    if (!permission) return
    Promise.all([api.role.setPermission(permission)])
    message.success('权限分配成功')
    setPermission(undefined)
  }

  const handleSubmit = () => {
    if (isDebugEnable) log.debug('Submit')
    handleSetPermissions()
    modalController.closeModal()
    onRefresh()
  }

  useEffect(() => {
    initTreeMenus()
  }, [])

  return (
    <Modal
      title="分配权限"
      width={ModalVariables.width}
      open={showModal}
      onOk={handleSubmit}
      okButtonProps={{ icon: <CheckCircleOutlined /> }}
      okText="确定"
      onCancel={modalController.closeModal}
      cancelButtonProps={{ icon: <CloseCircleOutlined /> }}
      cancelText="取消"
    >
      <Form {...ModalVariables.layout} form={form} style={{ maxWidth: 600 }}>
        <Form.Item label="角色名称" name="roleName">
          <span>{roleDetail?.roleName ?? ''}</span>
        </Form.Item>
        <Form.Item label="权限列表" name="permissions">
          <Tree
            checkable
            defaultExpandAll={defaultExpandAll}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            treeData={treeMenus}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
