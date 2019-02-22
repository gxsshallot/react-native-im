import React from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { DateUtil } from '../util';

export default class extends React.PureComponent {
    static propTypes = {
        time: PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            text: this._timeText(),
        };
    }
    
    componentDidMount() {
        const { time } = this.props;
        const now = new Date().getTime();
        if (now - time < 60 * 60 * 1000) {
            this.timer = setInterval(
                () => {
                    this.setState({
                        text: this._timeText(),
                    });
                }, 1000 * 60
            );
        }
    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    render() {
        return (
            <Text style={styles.text} numberOfLines={1}>
                {this.state.text}
            </Text>
        );
    }

    _timeText = () => {
        return DateUtil.showDate(this.props.time, true);
    };
}

const styles = StyleSheet.create({
    text: {
        alignSelf: 'center',
        backgroundColor: '#D4D4D4',
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 4,
        color: '#FFFFFF',
        marginBottom: 10,
        fontSize: 11,
        overflow: 'hidden',
    },
});