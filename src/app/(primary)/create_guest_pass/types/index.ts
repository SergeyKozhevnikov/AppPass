import type React from "react"

// Интерфейс для табов
export interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
  onSubmit?: () => void
  onSave?: () => void
  onCancel?: () => void
  [key: string]: unknown // Для остальных пропсов, если они есть
}

// Интерфейс для согласующего
export interface Approver {
  id: number
  name: string
  position: string
  login: string
  status_id?: number
  status?: string
}

// Интерфейс для согласующих
export interface ApprovalTabProps {
  approvers: Approver[]
  setApproversAction: React.Dispatch<React.SetStateAction<Approver[]>>
  onSubmitForm?: () => void
}

// Интерфейс для уведомлений
export interface AlertState {
  open: boolean
  message: string
  severity: "error" | "warning" | "info" | "success"
}

// Интерфейс для операций в истории
export interface HistoryOperation {
  date: string
  action: string
  user: string
}

// Интерфейс для вкладки истории
export interface HistoryTabProps {
  operations: HistoryOperation[]
}

// Интерфейс для пропсов компонента
export interface GuestPassFormProps {
  onClose?: () => void
}

// Интерфейс для пользователя
export interface User {
  id: number
  role: string
  tabNum: string
  surname: string
  name: string
  patronymic: string
  pos: string
  department: string
  login: string
  email: string
  password: string
  phoneNum: string
}

// Интерфейс для статуса согласования
export interface ApprovalStatus {
  id: number
  name: string
  description: string | null
  color: string
}