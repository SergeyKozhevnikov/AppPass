import type React from "react"

// Интерфейс для табов
export interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
  onSubmit?: () => void
  onSave?: () => void
  [key: string]: unknown // Для остальных пропсов, если они есть
}

// Интерфейс для согласующего
export interface Approver {
  id: number
  name: string
  position: string
}

// Интерфейс для согласующих
export interface ApprovalTabProps {
  approvers: Approver[]
  setApproversAction: React.Dispatch<React.SetStateAction<Approver[]>>
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