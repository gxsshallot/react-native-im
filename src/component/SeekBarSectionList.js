import React from 'react';
import { LayoutAnimation, StyleSheet, Text, TouchableHighlight, View, SectionList } from 'react-native';
import PropTypes from 'prop-types';
import getItemLayout from 'react-native-section-list-get-item-layout';
import delegate from '../delegate';

export default class extends React.PureComponent {
    static propTypes = {
        sections: PropTypes.array.isRequired,
        itemHeight: PropTypes.number.isRequired,
        sectionHeight: PropTypes.number.isRequired,
        separatorHeight: PropTypes.number,
        headerHeight: PropTypes.number,
    };

    static defaultProps = {
        separatorHeight: 0,
        headerHeight: 0,
    };

    constructor(props) {
        super(props);
        this.state = {isShowBackTop: false};
    }

    render() {
        return (
            <View style={styles.container}>
                <SectionList
                    ref={ref => this.list = ref}
                    {...this.props}
                    onScroll={this._onScroll}
                    getItemLayout={getItemLayout({
                        getItemHeight: () => this.props.itemHeight,
                        getSeparatorHeight: () => this.props.separatorHeight,
                        getSectionHeaderHeight: () => this.props.sectionHeight,
                        listHeaderHeight: () => this.props.headerHeight,
                    })}
                />
                <delegate.component.SelectList
                    sections={['↑'].concat(this.props.sections.map(i => i.title))}
                    onItemChange={this._scrollToLocation}
                />
                {this.state.isShowBackTop && this._renderBackTop()}
            </View>
        );
    }

    _renderBackTop = () => {
        return (
            <TouchableHighlight
                style={styles.backTop}
                onPress={() => this.list.scrollToLocation({
                    sectionIndex: 0,
                    itemIndex: 0,
                    animated: true,
                    viewOffset: this.props.sectionHeight
                })}
            >
                <View>
                    <Text style={styles.backTopText}>
                        {'返回顶部'}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    };

    _scrollToLocation = (index) => {
        this.list.scrollToLocation({
            animated: true,
            itemIndex: 0,
            sectionIndex: index > 0 ? index - 1 : 0,
            viewPosition: 0,
            viewOffset: index !== 0 ? this.props.sectionHeight : this.props.sectionHeight + this.props.headerHeight
        });
    };

    _onScroll = (event) => {
        const {contentOffset: {y}, layoutMeasurement: {height}} = event.nativeEvent;
        const needShowBtn = y > height;
        if (needShowBtn && !this.state.isShowBackTop) {
            this._showBackTopBtn(true);
        } else if (!needShowBtn && this.state.isShowBackTop) {
            this._showBackTopBtn(false);
        }
    };

    _showBackTopBtn = (isShow) => {
        global.isIos && LayoutAnimation.easeInEaseOut();
        this.setState({
            isShowBackTop: isShow,
        });
    };
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
    },
    backTop: {
        borderTopLeftRadius: 13,
        height: 26,
        borderBottomLeftRadius: 13,
        borderWidth: 2,
        borderRightWidth: 0,
        borderColor: '#e15151',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: 'white',
        position: 'absolute',
        right: 0,
        bottom: 48,
    },
    backTopText: {
        color: '#e15151',
        fontSize: 11,
    },
});