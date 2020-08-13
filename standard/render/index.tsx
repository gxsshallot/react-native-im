import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import Badge from '@hecom/badge';
import {getSafeAreaInset} from '@hecom/react-native-pure-navigation-bar';

function renderBadge(avoid, count) {
    const {width} = Dimensions.get('window');
    const inset = getSafeAreaInset();
    const style = avoid ? {
        top: 5,
        right: width - 70 - inset.left + 5,
    } : {
        top: 0,
        right: width - 70 - inset.left,
    };
    return (
        <Badge
            count={avoid ? null : count}
            maxCount={99}
            radius={avoid ? 3 : 8}
            outSpace={2}
            style={[styles.badge, style]}
        />
    );
}

const styles = StyleSheet.create({
    badge: {position: 'absolute', zIndex: 1}
});


export {
    renderBadge
}