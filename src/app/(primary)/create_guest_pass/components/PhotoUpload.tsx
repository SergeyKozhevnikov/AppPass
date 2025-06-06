"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Box, IconButton } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import PersonIcon from '@mui/icons-material/Person';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';

interface PhotoUploadProps {
  profilePhoto: string | null
  onProfilePhotoChangeAction: React.Dispatch<React.SetStateAction<string | null>>
  onError: (message: string, severity: "error" | "warning" | "info" | "success") => void
}

export default function PhotoUpload({ profilePhoto, onProfilePhotoChangeAction , onError}: PhotoUploadProps) {
  const [isPhotoLoading, setIsPhotoLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Функция для сжатия изображения
  const compressImage = (file: File, maxWidth = 800, maxHeight = 600, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        // Вычисляем новые размеры с сохранением пропорций
        let { width, height } = img

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        // Рисуем изображение на canvas с новыми размерами
        ctx?.drawImage(img, 0, 0, width, height)

        // Конвертируем в base64 с заданным качеством
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality)
        resolve(compressedDataUrl)
      }

      img.onerror = () => {
        reject(new Error("Ошибка при загрузке изображения"))
      }

      img.src = URL.createObjectURL(file)
    })
  }

  // Обработчик загрузки фотографии со сжатием
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Максимальный размер файла в байтах (10MB для исходного файла)
    const MAX_FILE_SIZE = 10 * 1024 * 1024
    // Допустимые типы файлов
    const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"]

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]

      // Проверка размера файла
      if (file.size > MAX_FILE_SIZE) {
        onError("Размер файла превышает 10MB. Пожалуйста, выберите файл меньшего размера.", "error")
        // Сбрасываем значение input file
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        return
      }

      // Проверка типа файла
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        onError("Недопустимый формат файла. Пожалуйста, выберите изображение в формате JPEG или PNG.", "error")
        // Сбрасываем значение input file
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        return
      }

      setIsPhotoLoading(true)

      try {
        // Сжимаем изображение перед сохранением
        const compressedImage = await compressImage(file, 800, 600, 0.8)

        // Проверяем размер сжатого изображения
        const compressedSize = Math.round((compressedImage.length * 3) / 4) // Приблизительный размер в байтах
        console.log(
          `Исходный размер: ${Math.round(file.size / 1024)}KB, Сжатый размер: ${Math.round(compressedSize / 1024)}KB`,
        )

        // Имитация задержки загрузки для демонстрации LoadingButton
        setTimeout(() => {
          onProfilePhotoChangeAction(compressedImage)
          setIsPhotoLoading(false)
          onError(`Фотография успешно загружена и сжата (${Math.round(compressedSize / 1024)}KB)`, "success")
        }, 1000)
      } catch (error) {
        console.error("Ошибка при сжатии изображения:", error)
        setIsPhotoLoading(false)
        onError("Ошибка при обработке изображения. Попробуйте другой файл.", "error")

        // Сбрасываем значение input file
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    }
  }

  // Обработчик удаления фотографии
  const handlePhotoDelete = () => {
    onProfilePhotoChangeAction(null) // Очищаем состояние фото
    // Сброс значения input file, чтобы можно было загрузить тот же файл снова
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onError("Фотография удалена", "info")
  }

  return (
    <Box
      sx={{
        width: 300,
        height: 400,
        bgcolor: "primary.main",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative", // Для позиционирования кнопки удаления
        overflow: "hidden",
        borderRadius: 2,
        ...(profilePhoto && {
          backgroundImage: `url(${profilePhoto})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::before": {
            // Псевдоэлемент для затемнения фона под кнопкой удаления
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "50px", // Примерный размер области затемнения
            height: "50px",
            borderRadius: "0 0 0 10px",
          },
        }),
      }}
    >
      {/* Кнопка удаления фотографии */}
      {profilePhoto && (
        <IconButton
          aria-label="Удалить фото"
          onClick={handlePhotoDelete}
          sx={{
            position: "absolute",
            top: 8, // Отступ сверху
            right: 8, // Отступ справа
            color: "white", // Цвет иконки
            backgroundColor: "rgba(0, 0, 0, 0.4)", // Полупрозрачный фон для контраста
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.6)", // Фон при наведении
            },
            zIndex: 2, // Делаем кнопку поверх остальных элементов
          }}
        >
          <ClearIcon fontSize="small" /> {/* Иконка удаления */}
        </IconButton>
      )}

      {!profilePhoto && <PersonIcon sx={{ width: 80, height: 80, color: "white", mb: 2 }} />}

      {/* Input для загрузки файла */}
      <input
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/jpg"
        type="file"
        id="upload-photo"
        style={{ display: "none" }}
        onChange={handlePhotoUpload}
      />

      {/* Кнопка загрузки/изменения фото */}
      <label
        htmlFor="upload-photo"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: 1, // Чтобы была под кнопкой удаления, если пересекутся
        }}
      >
        <LoadingButton
          loading={isPhotoLoading}
          loadingPosition="start"
          startIcon={<CloudUploadIcon />}
          variant="contained"
          component="span"
          fullWidth
          sx={{
            borderRadius: profilePhoto ? "0" : "0 0 8px 8px",
            height: "48px",
            bgcolor: profilePhoto ? "rgba(0, 0, 0, 0.6)" : "white", // Цвет фона
            color: profilePhoto ? "white" : "primary.main", // Цвет текста
            "&:hover": {
              bgcolor: profilePhoto ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)",
            },
          }}
        >
          {profilePhoto ? "Изменить фото" : "Добавить фото"}
        </LoadingButton>
      </label>
    </Box>
  )
}
