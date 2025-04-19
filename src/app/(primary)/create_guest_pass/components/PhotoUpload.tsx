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
}

export default function PhotoUpload({ profilePhoto, onProfilePhotoChangeAction }: PhotoUploadProps) {
  const [isPhotoLoading, setIsPhotoLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Обработчик загрузки фотографии
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setIsPhotoLoading(true)

      const file = event.target.files[0]
      const reader = new FileReader()

      reader.onloadend = () => {
        // Имитация задержки загрузки для демонстрации LoadingButton
        setTimeout(() => {
          onProfilePhotoChangeAction(reader.result as string)
          setIsPhotoLoading(false)
        }, 1000)
      }

      reader.readAsDataURL(file)
    }
  }

  // Обработчик удаления фотографии
  const handlePhotoDelete = () => {
    onProfilePhotoChangeAction(null) // Очищаем состояние фото
    // Сброс значения input file, чтобы можно было загрузить тот же файл снова
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
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
        accept="image/*"
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
