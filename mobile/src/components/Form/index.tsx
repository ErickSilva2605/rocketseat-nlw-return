import React, { useState } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { ArrowLeft } from 'phosphor-react-native';
import { captureScreen } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';

import { FeedbackType } from '../../components/Widget';
import { Button } from '../../components/Button';
import { ScreenshotButton } from '../../components/ScreenshotButton';

import { styles } from './styles';
import { theme } from '../../theme';
import { feedbackTypes } from '../../utils/feedbackTypes';
import { api } from '../../libs/api';
import { Copyright } from '../Copyright';

interface Props {
  feedbackType: FeedbackType;
  onFeedbackCanceled: () => void;
  onFeedbackSent: () => void;
}

export function Form({
  feedbackType,
  onFeedbackCanceled,
  onFeedbackSent
}: Props) {
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isTakingScreenshot, setIsTakingScreenshot] = useState(false)
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const feedbackTypeInfo = feedbackTypes[feedbackType];

  async function handleScreenshot() {
    setIsTakingScreenshot(true);

    await captureScreen({
      format: 'jpg',
      quality: 0.9
    })
      .then(uri => setScreenshot(uri))
      .catch(error => console.log(error));

    setIsTakingScreenshot(false);
  }

  function handleScreenshotRemove() {
    setScreenshot(null);
  }

  async function handleSendFeedback() {
    if (isSendingFeedback) {
      return;
    }

    setIsSendingFeedback(true);

    const screenshotBase64 =
      screenshot &&
      (await FileSystem.readAsStringAsync(screenshot, { encoding: 'base64' }));

    try {
      await api.post('/feedbacks', {
        type: feedbackType,
        screenshot: `data:image/png;base64, ${screenshotBase64}`,
        comment,
      });

      onFeedbackSent();
    } catch (error) {
      console.log(error);
      setIsSendingFeedback(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCanceled}>
          <ArrowLeft
            size={24}
            weight="bold"
            color={theme.colors.text_secondary}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Image
            style={styles.image}
            source={feedbackTypeInfo.image}
          />
          <Text style={styles.titleText}>
            {feedbackTypeInfo.title}
          </Text>
        </View>
      </View>
      <TextInput
        multiline
        autoCorrect={false}
        style={styles.input}
        placeholder="Algo não está funcionando bem? Queremos corrigir. Conte com detalhes o que está acontecendo..."
        placeholderTextColor={theme.colors.text_secondary}
        onChangeText={(text) => {
          setComment(text);
          setIsDisabled(text.trim().length <= 2);
        }}
      />
      <View style={styles.footer}>
        <ScreenshotButton
          isDisabled={isDisabled}
          isLoading={isTakingScreenshot}
          onTakeShot={handleScreenshot}
          onRemoveShot={handleScreenshotRemove}
          screenshot={screenshot}
        />
        <Button
          isDisabled={isDisabled || isSendingFeedback}
          onPress={handleSendFeedback}
          isLoading={isSendingFeedback}
        />
      </View>
      <Copyright />
    </View>
  );
}