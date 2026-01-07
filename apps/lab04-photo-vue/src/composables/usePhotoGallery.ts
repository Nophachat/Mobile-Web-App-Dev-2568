import { ref } from 'vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Preferences } from '@capacitor/preferences'

export interface Photo {
    filepath: string
    webviewPath?: string
}

const PHOTO_STORAGE = 'photos'

export function usePhotoGallery() {
    const photos = ref<Photo[]>([])

    const savePicture = async (photo: any) => {
        // 1) แปลงรูปเป็น base64
        const response = await fetch(photo.webPath!)
        const blob = await response.blob()
        const base64Data = await convertBlobToBase64(blob) as string


        // 2) เขียนไฟล์ลง filesystem
        const fileName = new Date().getTime() + '.jpeg'
        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Data,
        })

        return {
            filepath: fileName,
            webviewPath: photo.webPath,
        }
    }

    const addNewToGallery = async () => {
        const capturedPhoto = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 90,
        })

        const savedPhotoFile = await savePicture(capturedPhoto)
        photos.value.unshift(savedPhotoFile)

        // 3) เก็บลง Preferences (cache) ด้วย
        Preferences.set({
            key: PHOTO_STORAGE,
            value: JSON.stringify(photos.value),
        })
    }

    const loadSaved = async () => {
        const photoList = await Preferences.get({ key: PHOTO_STORAGE })
        const photosInPreferences = photoList.value
            ? JSON.parse(photoList.value)
            : []

        const loadedPhotos: Photo[] = []

        for (const photo of photosInPreferences) {
            try {
                const file = await Filesystem.readFile({
                    path: photo.filepath,
                    directory: Directory.Data,
                })

                loadedPhotos.push({
                    filepath: photo.filepath,
                    webviewPath: `data:image/jpeg;base64,${file.data}`,
                })
            } catch (err) {
                // ถ้าอ่านไฟล์ไม่ได้ (เช่นไฟล์หาย) ก็ข้าม
                console.warn('Cannot load photo', photo.filepath)
            }
        }

        photos.value = loadedPhotos
    }


    return {
        photos,
        addNewToGallery,
        loadSaved,
    }
}

// ตัวช่วยแปลง blob → base64
const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
        resolve(reader.result)
    }
    reader.readAsDataURL(blob)
})
