import { useState, useEffect } from 'react';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
}

const PHOTO_STORAGE = 'photos';

export function usePhotoGallery() {
    const [photos, setPhotos] = useState<UserPhoto[]>([]);

    useEffect(() => {
        loadSaved();
    }, []);

    const loadSaved = async () => {
        const { value } = await Preferences.get({ key: PHOTO_STORAGE });
        const photosInStorage: UserPhoto[] = value ? JSON.parse(value) : [];

        if (!Capacitor.isNativePlatform()) {
            // 🌐 Web: ใช้ path เดิมได้เลย
            setPhotos(photosInStorage);
            return;
        }

        // 📱 Mobile: ต้องแปลง file path
        const loadedPhotos = await Promise.all(
            photosInStorage.map(async (photo) => {
                const file = await Filesystem.readFile({
                    path: photo.filepath,
                    directory: Directory.Data,
                });

                return {
                    ...photo,
                    webviewPath: `data:image/jpeg;base64,${file.data}`,
                };
            })
        );

        setPhotos(loadedPhotos);
    };


    const addNewToGallery = async () => {
        const capturedPhoto = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
        });

        const fileName = new Date().getTime() + '.jpeg';
        const savedImage = await savePicture(capturedPhoto, fileName);

        const newPhotos = [savedImage, ...photos];
        setPhotos(newPhotos);
        Preferences.set({
            key: PHOTO_STORAGE,
            value: JSON.stringify(newPhotos),
        });
    };

    const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
        const response = await fetch(photo.webPath!);
        const blob = await response.blob();
        const base64Data = await convertBlobToBase64(blob);

        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Data,
        });

        return {
            filepath: fileName,
            webviewPath: Capacitor.convertFileSrc(savedFile.uri),
        };
    };

    const convertBlobToBase64 = (blob: Blob): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });

    return {
        photos,
        addNewToGallery,
    };
}
