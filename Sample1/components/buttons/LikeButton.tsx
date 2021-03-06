import React from "react";
import { StyleProp, ViewStyle } from "react-native";

import { Theme } from "../../theme";
import { CircleIconButton } from "./CircleIconButton";

type TProps = {
  isLiked: boolean;
  style: StyleProp<ViewStyle>;
  onClick: () => void;
};

export const LikeButton: React.FC<TProps> = ({ isLiked, style, onClick }) => {
  return (
    <CircleIconButton
      iconName={isLiked ? "md-heart" : "md-heart-empty"}
      iconColor={isLiked ? "#FE346E" : Theme.colors.gray}
      style={style}
      // iconSize={26}
      onPress={onClick}
    />
  );
};
