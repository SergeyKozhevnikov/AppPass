/**
 * Сервис для работы с API бэкенда
 */

import { BACKEND_ADDRESS } from "@/lib/constants"

// Базовый URL API - используется в бэкенде
const API_BASE_URL = BACKEND_ADDRESS

// Интерфейс для данных пропуска
export interface PassData {
  fullName: string
  phone: string
  organization: string
  email: string
  birthDate: string
  hasCar: string
  justification: string
  startDate: string
  endDate: string
  photo?: string
  approvers: Array<{
    id?: number
    user_id: number // Передаем ID пользователя вместо логина
    name: string
    position: string
    status_id?: number
  }>
}

// Интерфейс для ответа API
export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

/**
 * Создает новый пропуск
 * @param passData - данные пропуска
 * @returns Promise с ответом API
 */
export const createPass = async (passData: PassData): Promise<ApiResponse> => {
  try {
    console.log("Отправка данных на сервер:", JSON.stringify(passData))

    const response = await fetch(`${API_BASE_URL}/passes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passData),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error("Ошибка ответа сервера:", response.status, responseData)

      // Формируем детальное сообщение об ошибке
      let errorMessage = "Ошибка при создании пропуска"

      if (responseData.error) {
        errorMessage = responseData.error
      } else if (responseData.message) {
        errorMessage = responseData.message
      }

      // Добавляем информацию о статусе ответа
      if (response.status === 413) {
        errorMessage =
          "Размер отправляемых данных слишком большой. Пожалуйста, уменьшите размер изображения или попробуйте другое фото."
      } else if (response.status === 400) {
        errorMessage = `Ошибка валидации данных: ${errorMessage}`
      } else if (response.status === 401 || response.status === 403) {
        errorMessage = `Ошибка авторизации: ${errorMessage}`
      } else if (response.status === 500) {
        errorMessage = `Внутренняя ошибка сервера: ${errorMessage}`
      }

      return {
        success: false,
        message: errorMessage,
        error: responseData.error || `Ошибка сервера: ${response.status}`,
      }
    }

    return responseData
  } catch (error) {
    console.error("Ошибка при создании пропуска:", error)

    // Формируем детальное сообщение об ошибке
    let errorMessage = "Ошибка при отправке запроса"

    if (error instanceof Error) {
      errorMessage = error.message

      // Проверяем тип ошибки
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        errorMessage = "Ошибка сети. Пожалуйста, проверьте подключение к интернету и доступность сервера."
      } else if (error.message.includes("PayloadTooLargeError") || error.message.includes("request entity too large")) {
        errorMessage = "Размер отправляемых данных слишком большой. Пожалуйста, уменьшите размер изображения."
      }
    }

    return {
      success: false,
      message: "Ошибка при отправке запроса",
      error: errorMessage,
    }
  }
}

/**
 * Получает список всех пропусков
 * @returns Promise с ответом API
 */
export const getAllPasses = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/passes`)

    const responseData = await response.json()

    if (!response.ok) {
      console.error("Ошибка ответа сервера:", response.status, responseData)

      return {
        success: false,
        message: responseData.message || `Ошибка сервера: ${response.status}`,
        error: responseData.error || `Не удалось получить список пропусков. Код ошибки: ${response.status}`,
      }
    }

    return responseData
  } catch (error) {
    console.error("Ошибка при получении списка пропусков:", error)

    let errorMessage = "Ошибка при отправке запроса"

    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      message: "Ошибка при получении списка пропусков",
      error: errorMessage,
    }
  }
}

/**
 * Получает пропуск по ID
 * @param id - ID пропуска
 * @returns Promise с ответом API
 */
export const getPassById = async (id: number): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/passes/${id}`)

    const responseData = await response.json()

    if (!response.ok) {
      console.error("Ошибка ответа сервера:", response.status, responseData)

      return {
        success: false,
        message: responseData.message || `Ошибка сервера: ${response.status}`,
        error: responseData.error || `Не удалось получить пропуск. Код ошибки: ${response.status}`,
      }
    }

    return responseData
  } catch (error) {
    console.error("Ошибка при получении пропуска:", error)

    let errorMessage = "Ошибка при отправке запроса"

    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      message: "Ошибка при получении пропуска",
      error: errorMessage,
    }
  }
}

/**
 * Обновляет пропуск
 * @param id - ID пропуска
 * @param passData - данные пропуска
 * @returns Promise с ответом API
 */
export const updatePass = async (id: number, passData: PassData): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/passes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passData),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error("Ошибка ответа сервера:", response.status, responseData)

      return {
        success: false,
        message: responseData.message || `Ошибка сервера: ${response.status}`,
        error: responseData.error || `Не удалось обновить пропуск. Код ошибки: ${response.status}`,
      }
    }

    return responseData
  } catch (error) {
    console.error("Ошибка при обновлении пропуска:", error)

    let errorMessage = "Ошибка при отправке запроса"

    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      message: "Ошибка при обновлении пропуска",
      error: errorMessage,
    }
  }
}

/**
 * Удаляет пропуск
 * @param id - ID пропуска
 * @returns Promise с ответом API
 */
export const deletePass = async (id: number): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/passes/${id}`, {
      method: "DELETE",
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error("Ошибка ответа сервера:", response.status, responseData)

      return {
        success: false,
        message: responseData.message || `Ошибка сервера: ${response.status}`,
        error: responseData.error || `Не удалось удалить пропуск. Код ошибки: ${response.status}`,
      }
    }

    return responseData
  } catch (error) {
    console.error("Ошибка при удалении пропуска:", error)

    let errorMessage = "Ошибка при отправке запроса"

    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      message: "Ошибка при удалении пропуска",
      error: errorMessage,
    }
  }
}
