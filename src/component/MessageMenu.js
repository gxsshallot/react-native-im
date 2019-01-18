import React from 'react';
import { Text, View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Popover from 'react-native-popover-view';

export default class extends React.PureComponent {
    static propTypes = {
        menuShow: PropTypes.bool.isRequired,
        menuRect: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
            width: PropTypes.number,
            height: PropTypes.number,
        }).isRequired,
        actionList: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            action: PropTypes.func,
        })).isRequired,
        onClose: PropTypes.func,
    };

    static defaultProps = {};

    render() {
        const {menuShow, menuRect, onClose} = this.props;
        return (
            <Popover
                isVisible={menuShow}
                fromRect={menuRect}
                onClose={onClose}
                placement={'top'}
                showBackground={false}
                popoverStyle={styles.popover}
            >
                {this._renderContent()}
            </Popover>
        );
    }

    _renderContent = () => {
        const {actionList} = this.props;
        return (
            <View style={styles.menuContainer}>
                {actionList.map((item, index) => {
                    const isLast = index === actionList.length - 1;
                    return this._renderButton(item, isLast);
                })}
            </View>
        );
    };

    _renderButton = ({title, action}, isLast) => {
        return (
            <View key={title} style={styles.menuContainer}>
                <TouchableWithoutFeedback onPress={this._onPress.bind(this, action)}>
                    <View style={styles.btnContainer}>
                        <Text style={styles.btnTitle}>
                            {title}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
                {!isLast && <View style={styles.line} />}
            </View>
        );
    };

    _onPress = (action) => {
        this.props.onClose && this.props.onClose();
        action && action();
    };
}

const styles = StyleSheet.create({
    menuContainer: {
        flexDirection: 'row',
        height: 30,
    },
    btnContainer: {
        alignItems: 'center',
        height: 30,
        width: 60,
        justifyContent: 'center',
    },
    line: {
        height: 40,
        width: 1,
        backgroundColor: '#eff1f1',
        alignSelf: 'flex-start',
    },
    btnTitle: {
        color: 'white',
        fontSize: 16,
    },
    popover: {
        backgroundColor: 'black',
    },
});