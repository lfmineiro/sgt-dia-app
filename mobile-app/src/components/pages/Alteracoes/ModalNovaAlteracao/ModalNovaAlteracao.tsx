import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';
import PhotoPicker from './PhotoPicker';
import type { ModalNovaAlteracaoProps } from '@/src/types/components.types';
import { useAlteracaoForm } from '@/src/hooks/useAlteracaoForm';

export default function ModalNovaAlteracao({ visible, onClose, comodoNome, onSave }: ModalNovaAlteracaoProps) {

  const { descricao, setDescricao, imagemUri, setImagemUri, isSubmitting, maxLength, handleSalvar, resetForm } = useAlteracaoForm()

  const onSalvarComReset = async (desc: string, img: string | null) => {
    const saved = await onSave(desc, img)

    if (saved) {
      resetForm()
      onClose()
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        
        <View style={styles.sheetContainer}>
          <View style={styles.dragHandle} />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTitleRow}>
                <View style={styles.iconContainer}><Feather name="file-plus" size={20} color="#3b82f6" /></View>
                <View style={styles.headerTexts}>
                  <Text style={styles.title}>Nova Alteração</Text>
                  <Text style={styles.subtitle}>Preencha os dados abaixo</Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}><Feather name="x" size={20} color="#64748b" /></TouchableOpacity>
            </View>

            {/* Contexto */}
            <View style={styles.contextContainer}>
              <Feather name="map-pin" size={16} color="#64748b" />
              <Text style={styles.contextText}>{comodoNome}</Text>
            </View>

            {/* Input de Descrição */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição <Text style={styles.required}>*</Text></Text>
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Descreva o problema encontrado..."
                  placeholderTextColor="#94a3b8"
                  multiline numberOfLines={4} maxLength={maxLength}
                  value={descricao} onChangeText={setDescricao} textAlignVertical="top"
                />
                <Text style={styles.charCount}>{descricao.length}/{maxLength}</Text>
              </View>
            </View>

            {/* Subcomponente do Image Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Foto da Alteração</Text>
              <PhotoPicker imagemUri={imagemUri} onChange={setImagemUri} />
            </View>

          </ScrollView>

          {/* Botão Salvar */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.saveButton, !descricao.trim() && styles.saveButtonDisabled]} 
              disabled={!descricao.trim() || isSubmitting} onPress={() => handleSalvar(onSalvarComReset)}
            >
              {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Registrar Alteração</Text>}
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}