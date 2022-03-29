import React, { useEffect, useState } from "react";
import { Alert, Dimensions, ScrollView } from "react-native";

import { HtmlView } from "../../components";
import { AppSettingsService } from "../../services";

const WIDTH = Dimensions.get("screen").width;

export const AboutUsScreen = () => {
  const [state, setState] = useState<{ aboutUs: string; website: string }>({
    aboutUs: "Goin is a specialized platform that provides ideal co-working spaces for companies and entrepreneurs in the Kingdom of Saudi Arabia. Our wide network of prime locations offers you a prestigious business address that suits your ambitions, in addition to a professional work environment that provides you with the required office services to manage your businesses with ease and comfort."+
    "We have various office options whether you are looking for private offices, shared offices, or a Cafe. We offer you great flexibility in contracting and competitive prices that will fit your budget.",
    website: null,
  });

  useEffect(() => {
    AppSettingsService.getAboutUs()
      .then((res) => setState(res.data))
      .catch((err) => Alert.alert(err.message));
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <HtmlView htmlContent={state.aboutUs} imagesMaxWidthOffset={WIDTH - 32} />
    </ScrollView>
  );
};
