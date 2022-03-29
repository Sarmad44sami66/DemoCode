
import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import {COLORS} from '../utils/colors';

export default Loader = (props) => {
    const { loading, style, containerStyle, color, size, visible } = props

    if (visible)
        return (
            <View style={[styles.container, containerStyle]}>
                {visible &&
                    <ActivityIndicator
                        animating={visible}
                        size={size ? size : 'large'}
                        color={color ? color : COLORS.appDarkBlue}
                        style={[{ marginLeft: 5 }, style ? style : {}]}
                    />
                }
            </View>
        )
    else return null
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: ('#ffffff30'),
        alignItems: 'center',
        justifyContent: 'center',
    }
})
