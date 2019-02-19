import * as React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import Sound from 'react-native-sound';
import { Typings } from '../../../src';

export type Props = Typings.Action.DisplayHandleParams<Typings.Message.VoiceBody>;

export interface State {
    isPlaying: boolean;
}

export default class extends React.PureComponent<Props, State> {
    protected sound: Sound;

    state: State = {
        isPlaying: false,
    };

    constructor(props: Props) {
        super(props);
        const {message: {data: {localPath, remotePath}}} = this.props;
        this.sound = new Sound(localPath || remotePath, '', (error) => {
            if (error) {
                console.log('failed to load the sound', error);
            }
        });
    }

    componentDidMount() {
        this.props.enableBubble(true);
    }

    componentWillUnmount() {
        this.sound.release();
    }

    render() {
        let image;
        const {isSender} = this.props;
        if (this.state.isPlaying) {
            image = isSender ?
                require('./image/senderVoicePlaying.gif') :
                require('./image/receiverVoicePlaying.gif');
        } else {
            image = isSender ?
                require('./image/senderVoice.png') :
                require('./image/receiverVoice.png');
        }
        return (
            <View style={[styles.container]}>
                {isSender && this._renderTimeLabel(false)}
                <Image
                    style={styles.image}
                    source={image}
                />
                {!isSender && this._renderTimeLabel(true)}
            </View>
        );
    }

    public onPress() {
        if (this.state.isPlaying) {
            this.sound.stop();
        } else {
            setTimeout(() => {
                this.sound.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                    this.setState({isPlaying: !this.state.isPlaying});
                });
            }, 100);
        }
        this.setState({isPlaying: !this.state.isPlaying});
    }

    _renderTimeLabel(isLeft: boolean) {
        const time = Math.floor(this.props.message.data.duration / 1000);
        const margin = Math.min(this.props.maxWidth, time * 3) + 10;
        const style = isLeft ? {
            marginRight: margin,
            marginLeft: 10,
        } : {
            marginLeft: margin,
            marginRight: 10,
        };
        return (
            <Text style={[styles.time, style]}>
                {time + "\""}
            </Text>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 12,
        marginTop: 12,
    },
    image: {
        width: 20,
        height: 20
    },
    time: {
        color: 'gray',
        backgroundColor: 'transparent',
    },
});