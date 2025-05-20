/**
 * Сервис для работы с API пользователей
 */

// Базовый URL API
const API_BASE_URL = "http://localhost:3001/api"

// Интерфейс для данных пользователя
export interface UserData {
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

// Интерфейс для ответа API
export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

/**
 * Получает список всех пользователей
 * @returns Promise с ответом API
 */
export const getAllUsers = async (): Promise<ApiResponse<UserData[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`)

    const responseData = await response.json()

    if (!response.ok) {
      console.error("Ошибка ответа сервера:", response.status, responseData)

      return {
        success: false,
        message: responseData.message || `Ошибка сервера: ${response.status}`,
        error: responseData.error || `Не удалось получить список пользователей. Код ошибки: ${response.status}`,
      }
    }

    return responseData
  } catch (error) {
    console.error("Ошибка при получении списка пользователей:", error)

    let errorMessage = "Ошибка при отправке запроса"

    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      message: "Ошибка при получении списка пользователей",
      error: errorMessage,
    }
  }
}

/**
 * Получает пользователя по ID
 * @param id - ID пользователя
 * @returns Promise с ответом API
 */
export const getUserById = async (id: number): Promise<ApiResponse<UserData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`)

    const responseData = await response.json()

    if (!response.ok) {
      console.error("Ошибка ответа сервера:", response.status, responseData)

      return {
        success: false,
        message: responseData.message || `Ошибка сервера: ${response.status}`,
        error: responseData.error || `Не удалось получить пользователя. Код ошибки: ${response.status}`,
      }
    }

    return responseData
  } catch (error) {
    console.error("Ошибка при получении пользователя:", error)

    let errorMessage = "Ошибка при отправке запроса"

    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      message: "Ошибка при получении пользователя",
      error: errorMessage,
    }
  }
}
