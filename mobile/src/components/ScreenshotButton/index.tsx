import { Camera, Trash } from 'phosphor-react-native';
import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { theme } from '../../theme';

import { styles } from './styles';

interface Props {
  screenshot: string | null;
  isDisabled: boolean;
  isLoading: boolean;
  onTakeShot: () => void;
  onRemoveShot: () => void;
}

export function ScreenshotButton({
  screenshot,
  isDisabled,
  isLoading,
  onTakeShot,
  onRemoveShot
}: Props) {
  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={[styles.container, isDisabled ? { opacity: 0.5 } : {}]}
      onPress={screenshot ? onRemoveShot : onTakeShot}
    >
      {
        screenshot ? (
          <View>
            <Image
              style={styles.image}
              source={{ uri: screenshot }}
            />
            <Trash
              size={22}
              color={theme.colors.text_secondary}
              weight="fill"
              style={styles.removeIcon}
            />
          </View>) : (
          <>
            {
              isLoading ? (
                <ActivityIndicator
                  color={theme.colors.text_on_brand_color}
                />
              ) : (
                <Camera
                  size={24}
                  color={theme.colors.text_primary}
                  weight="bold"
                />
              )
            }
          </>
        )
      }
    </TouchableOpacity>
  );
}