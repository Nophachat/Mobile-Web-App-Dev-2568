<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Photo Gallery</ion-title>
        <ion-title size="small">นายนพชาติ น้อยนารถ 663380601-7</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Photo Gallery</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- ✅ Grid ต้องอยู่ใน ion-content -->
      <ion-grid>
        <ion-row>
          <ion-col
            size="6"
            v-for="photo in photos"
            :key="photo.filepath"
          >
            <ion-img :src="photo.webviewPath" />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>

    <!-- FAB อยู่นอก ion-content -->
    <ion-fab slot="fixed" vertical="bottom" horizontal="center">
      <ion-fab-button @click="addNewToGallery">
        <ion-icon :icon="camera" />
      </ion-fab-button>
    </ion-fab>

  </ion-page>
</template>

<script setup lang="ts">
import { camera } from 'ionicons/icons'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  onIonViewWillEnter,
} from '@ionic/vue'

import { usePhotoGallery } from '@/composables/usePhotoGallery'

const { photos, addNewToGallery, loadSaved } = usePhotoGallery()

onIonViewWillEnter(() => {
  loadSaved()
})
</script>
