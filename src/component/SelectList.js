import React from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

export default class extends React.PureComponent {
    static propTypes = {
        sections: PropTypes.array.isRequired,
        getSectionTitle: PropTypes.func,
        onItemChange: PropTypes.func.isRequired,
        itemStyle: PropTypes.any,
        style: PropTypes.any,
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderTerminationRequest: () => false,
            onPanResponderGrant: this._responderMove,
            onPanResponderMove: this._responderMove,
            onPanResponderRelease: this._responderRelease,
            onPanResponderTerminate: this._responderRelease,
        });
        this.state = {
            isTouch: false,
        };
    }

    render() {
        const {sections, style, getSectionTitle} = this.props;
        const data = getSectionTitle ? sections.map(section => getSectionTitle(section)) : sections;
        const bgColorStyle = {
            backgroundColor: this.state.isTouch ? '#e1e1e1' : 'transparent',
        };
        return sections.length === 0 ? null : (
            <View
                ref={ref => this.seekBar = ref}
                style={[styles.seekBar, style, bgColorStyle]}
                onLayout={this._onLayout}
                {...this.panResponder.panHandlers}
            >
                {data.map(this._renderItem)}
            </View>
        );
    }

    _renderItem = (item) => {
        const {itemStyle} = this.props;
        return (
            <Text
                key={item}
                style={[styles.seekBarItem, itemStyle]}
                onLayout={this._onLayoutText}
            >
                {item}
            </Text>
        );
    };

    _onLayout = () => {
        this.seekBar.measure((x, y, width, height, pageX, pageY) => {
            this.seekBarTopY = pageY;
        });
    };

    _onLayoutText = (event) => {
        if (!this.seekItemHeight) {
            this.seekItemHeight = event.nativeEvent.layout.height;
        }
    };

    _responderMove = (event) => {
        const y = event.nativeEvent.pageY - this.seekBarTopY;
        const index = Math.floor(y / this.seekItemHeight);
        if (index >= 0 && index < this.props.sections.length && index !== this.currentIndex) {
            this.props.onItemChange && this.props.onItemChange(index);
            this.currentIndex = index;
        }
        if (!this.state.isTouch) {
            this.setState({
                isTouch: true,
            });
        }
    };

    _responderRelease = () => {
        this.setState({
            isTouch: false,
        });
        this.currentIndex = undefined;
    };
}

const styles = StyleSheet.create({
    seekBar: {
        borderRadius: 3,
        position: 'absolute',
        right: 0,
    },
    seekBarItem: {
        fontSize: 10,
        padding: 2,
        textAlign: 'center',
        color: '#666666',
    },
});