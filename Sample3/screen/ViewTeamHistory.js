import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet, StatusBar, FlatList, Pressable, Image, SafeAreaView, ImageBackground, TouchableOpacity, Dimensions } from 'react-native'
import { COLORS } from '../utils/colors';
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const ViewTeamHistory = (props) => {

    const [teamHistoryList, setTeamHistoryList] = useState(props.userProfile?.teamHistory);

    const renderItem = (item, index) => {
        console.log('my item===>', item);
        return (
            <View>
                <View style={styles.rowView}>
                    <View style={{ width: '50%' }}>
                        <Text style={styles.blueTextStyle}>Team Name</Text>
                        <Text style={styles.grayTextStyle}>{item?.teamName}</Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={styles.blueTextStyle}>Level</Text>
                        <Text style={styles.grayTextStyle}>{item?.Level}</Text>
                    </View>
                </View>
                <View style={styles.rowView}>
                    <View style={{ width: '50%' }}>
                        <Text style={styles.blueTextStyle}>Start Date</Text>
                        <Text style={styles.grayTextStyle}>{item?.StartDate}</Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <Text style={styles.blueTextStyle}>End Date</Text>
                        <Text style={styles.grayTextStyle}>{item?.EndDate}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={{ width: '100%', height: '100%' }}>
            <StatusBar backgroundColor={COLORS.appLightBlue} />
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View style={styles.container}>
                    <Text style={styles.allAboutText}>Team History</Text>
                    <View>
                        <FlatList
                            data={teamHistoryList}
                            keyExtractor={(item, index) => item.label + index}
                            listKey={'SelectIndustriesScreen' + moment().format('x')}
                            removeClippedSubvisews={false}
                            renderItem={({ item, index }) => {
                                return renderItem(item, index);
                            }}
                        />
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.appWhite,
        // paddingLeft: 15,
        // paddingRight: 15
    },
    allAboutText: {
        fontSize: 20,
        color: COLORS.appTitleBlue,
        marginTop: 20,
        fontFamily: 'Poppins-Bold',
        marginLeft: 20
    },
    rowView: {
        width: '100%',
        flexDirection: "row",
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginVertical: 8
    },
    blueTextStyle: {
        color: COLORS.appLightBlue,
        fontFamily: 'Poppins-Medium',
        fontSize: 14
    },
    grayTextStyle: {
        color: COLORS.appAccentGreyDark,
        fontFamily: 'Poppins-Light',
        fontSize: 14
    }

});
export default ViewTeamHistory;