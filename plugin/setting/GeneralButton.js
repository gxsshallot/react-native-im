import React from 'react';
import { TouchableHighlight, View, Text, StyleSheet } from 'react-native';

export default function (key, text, onPress) {
    return (
        <TouchableHighlight
            key={key}
            style={styles.touch}
            activeOpacity={0.9}
            onPress={onPress}
        >
            <View>
                <Text style={styles.text}>
                    {text}
                </Text>
            </View>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    touch: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'red',
        fontSize: 18,
    },
});