import {
  FontAwesome,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import ViewPager from "@react-native-community/viewpager";
import { useNavigation } from "@react-navigation/native";
import numeral from "numeral";
import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Image,
  NativeSyntheticEvent,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Pagination } from "react-native-snap-carousel";

import { AuthenticationContext, LikedPropertiesContext } from "../../context";
import { getImageUrl } from "../../helpers";
import { useLocalization } from "../../localization";
import { Property } from "../../models";
import NavigationNames from "../../navigations/NavigationNames";
import { PropertyService } from "../../services";
import { Theme } from "../../theme";
import { Box } from "../box";
import { LikeButton } from "../buttons";
import { Divider } from "../divider";
import { Text } from "../text";

const SLIDER_HEIGHT = 180;

const PropertyDetail: React.FC<{
  iconName: string;
  title: string;
  style: StyleProp<ViewStyle>;
}> = ({ iconName, title, style }) => (
  <View style={[styles.propertyContent, style]}>
    <FontAwesome name={iconName} size={17} color={Theme.colors.green} />
    <Text style={styles.propertyTitle}>{title}</Text>
  </View>
);

type TProps = {
  model: Property;
  onClick: () => void;
};

export const ListingItemView: React.FC<TProps> = ({ model, onClick }) => {
  const { isLoggedIn } = useContext(AuthenticationContext);
  const { likedProperties, likeProperty } = useContext(LikedPropertiesContext);
  const navigation = useNavigation();
  const { getString } = useLocalization();
  const [indicatorIndex, setIndicatorIndex] = useState(0);

  const isLiked = likedProperties.hasOwnProperty(model.id);

  const onClickLike = () => {
    if (!isLoggedIn) {
      navigation.navigate(NavigationNames.RootLoginScreen);
      return;
    }
    PropertyService.likeProperty(model.id, !isLiked)
      .then((_) => {
        model.isLiked = !isLiked;
        likeProperty(model, !isLiked);
      })
      .catch((err) => alert(err.message));
  };

  const onPageSelected = (event: NativeSyntheticEvent<any>) => {
    setIndicatorIndex(event.nativeEvent.position);
  };

  const propertyImagesNames = model.imageNames
    .split(",")
    .filter((a) => a !== "");

  return (
    <Box style={styles.container}>
      <View style={styles.labelContent}>
        <Text style={styles.labelText}>
          {model.propertyType.name.toLocaleLowerCase("en") === "desks"
            ? getString("Desks")
            : getString("Meeting Rooms")}
        </Text>
      </View>
      <LikeButton
        isLiked={isLiked}
        onClick={onClickLike}
        style={styles.likeIcon}
      />
      <View>
        <View style={{ overflow: "hidden" }}>
          <ViewPager
            style={styles.viewPager}
            initialPage={0}
            onPageSelected={onPageSelected}
          >
            {propertyImagesNames.slice(0, 5).map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={onClick}
                key={`pageItemKey${index}`}
              >
                <Image
                  key={index}
                  source={{
                    uri: getImageUrl(item),
                  }}
                  style={styles.viewPagerItemImage}
                />
              </TouchableOpacity>
            ))}
          </ViewPager>
        </View>
        <Pagination
          dotsLength={Math.min(propertyImagesNames.length, 5)}
          activeDotIndex={indicatorIndex}
          dotColor={Theme.colors.primaryColor}
          inactiveDotColor={Theme.colors.lightgray}
          inactiveDotScale={0.8}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.paginationDot}
        />
      </View>
      <TouchableOpacity onPress={onClick}>
        <View style={styles.ph16}>
          <View style={styles.mv14}>
            <Text style={styles.priceText}>
              {/* {`${numeral(model.points).format("0,0")}`}{" "}
              {model.points > 1 ? "Points" : "Point"} Per Hour */}
              {model.title}
            </Text>
            <View style={styles.infoContainer}>
              <View style={{ flexDirection: "row" }}>
                <Entypo
                  name="location-pin"
                  size={14}
                  color={Theme.colors.textColor}
                />
                <Text style={styles.locationText} numberOfLines={1}>
                  {model.address}
                </Text>
              </View>

              {/* <View style={{ flexDirection: "row" }}>
                <MaterialCommunityIcons name="floor-plan" size={14} />
                <Text style={styles.locationText}>{` ${model.size}m² `}</Text>
              </View> */}
            </View>
          </View>
          <Divider style={{ backgroundColor: Theme.colors.gray }} />
          <View style={styles.propertiesContainer}>
            <PropertyDetail
              iconName="desktop"
              title={getString("deskWithCount", {
                count: model.desksCount,
              })}
              style={{}}
            />
            <PropertyDetail
              iconName="diamond"
              title={getString("pointWithCount", {
                count: model.points,
              })}
              style={{ marginLeft: 15 }}
            />
            {/* <PropertyDetail
              iconName="car"
              title={getString("parkingWithCount", {
                count: model.parkingCount,
              })}
            /> */}
          </View>
        </View>
      </TouchableOpacity>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.lightgray,
    overflow: "hidden",
    marginHorizontal: 16,
  },
  viewPager: { height: SLIDER_HEIGHT, overflow: "hidden" },
  viewPagerItemImage: {
    flex: 1,
    borderTopLeftRadius: Theme.sizes.boxBorderRadius,
    borderTopRightRadius: Theme.sizes.boxBorderRadius,
  },
  paginationContainer: {
    position: "absolute",
    margin: 0,
    minHeight: 0,
    paddingVertical: 0,
    bottom: 14,
    alignSelf: "center",
  },
  paginationDot: { marginHorizontal: -20 },
  labelContent: {
    backgroundColor: Theme.colors.green,
    position: "absolute",
    paddingHorizontal: 8,
    paddingVertical: 4,
    left: 16,
    top: 16,
    borderRadius: 4,
    zIndex: 10,
  },
  labelText: {
    color: "white",
    fontFamily: "default-medium",
    fontSize: 11,
  },
  likeIcon: {
    position: "absolute",
    top: SLIDER_HEIGHT - 18,
    right: 16,
    zIndex: 5,
  },
  ph16: { paddingHorizontal: 16 },
  mv14: { paddingVertical: 14 },
  priceText: {
    fontFamily: "default-medium",
    fontSize: 18,
    color: Theme.colors.textColor,
    textAlign: "justify",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    opacity: 0.4,
  },
  locationText: {
    color: Theme.colors.textColor,
    fontSize: 13,
    fontFamily: "default-medium",
  },
  propertiesContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 4,
    paddingVertical: 14,
    alignItems: "center",
    alignContent: "center",
  },
  propertyContent: { flexDirection: "row" },
  propertyTitle: {
    marginStart: 12,
    fontSize: 13,
    marginTop: 1,
    color: Theme.colors.darkgray,
    fontFamily: "default-medium",
  },
});
