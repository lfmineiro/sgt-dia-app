import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './styles';
import type { PhotoPickerProps } from '@/src/types/components.types';

export default function PhotoPicker({ imagemUri, onChange }: PhotoPickerProps) {
  const handleSelecionarFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  if (imagemUri) {
    return (
      <View style={styles.photoPreviewContainer}>
        <Image source={{ uri: imagemUri }} style={styles.photoPreview} />
        <TouchableOpacity style={styles.removePhotoButton} onPress={() => onChange(null)}>
          <Feather name="trash-2" size={20} color="#ef4444" />
          <Text style={styles.removePhotoText}>Remover Foto</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.photoPickerButton} onPress={handleSelecionarFoto}>
      <View style={styles.photoPickerIconArea}>
        <Feather name="camera" size={20} color="#3b82f6" />
      </View>
      <View style={styles.photoPickerTexts}>
        <Text style={styles.photoPickerTitle}>Escolher Foto</Text>
        <Text style={styles.photoPickerSubtitle}>JPG, PNG ou HEIC · Máx. 10MB</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#94a3b8" />
    </TouchableOpacity>
  );
}