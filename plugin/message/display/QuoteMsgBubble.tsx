import React from 'react';
import { Image, Platform, StyleSheet, Text, TextStyle, TouchableWithoutFeedback, View } from 'react-native';
import { Message } from 'react-native-im/standard/typings';
import { Delegate, Typings } from '../../../standard';
import { IMConstant } from 'react-native-im-easemob';
import delegate from '../../../standard/delegate';
import {showPhotoBrowserPage} from 'react-native-photo-browse';
import Navigation from '@hecom/navigation';
import Constant from '../../../../../core/constant';
import Model from '../../../../../core/model';

interface Props {
    message: Message.General;
    maxWidth: number,
    paddingLeft: number,
    paddingRight: number,
    innerMaxWidth: number,
}
const FilePreviewPage = 'standard/accessory/FilePreviewPage';

export default class QuoteMsgBubble extends React.PureComponent<Props> {

    constructor(props: Props) {
        super(props);
    }


    render() {

        const { message: { data: { quoteMsg } }, maxWidth, paddingLeft, paddingRight, innerMaxWidth } = this.props;
        var msgDesc: String = '';
        if (quoteMsg != undefined) {
            switch (quoteMsg.type) {
                case IMConstant.MessageType.text:
                    msgDesc = (quoteMsg as Message.General).data.text;
                    break;
                case IMConstant.MessageType.image:
                    msgDesc = '[图片]';
                    break;
                case IMConstant.MessageType.video:
                    msgDesc = '[视频]';
                    break;
                case IMConstant.MessageType.location:
                    msgDesc = '[位置]';
                    break;
                case IMConstant.MessageType.file:
                    msgDesc = '[文件]';
                    break;
                case IMConstant.MessageType.material:
                    msgDesc = '[资料]';
                    break;
            }
        }

        return quoteMsg ? (
            <TouchableWithoutFeedback
                onPress={this._onPress.bind(this)}
            >
                <Text
                    style={[styles.quoteText, { maxWidth: maxWidth, paddingLeft:paddingRight,paddingRight:paddingRight }]}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                >
                    {delegate.user.getUser((quoteMsg as Message.General).from).name + ':' + msgDesc}
                </Text>
            </TouchableWithoutFeedback>
        ) : null;
    }

    protected _onPress() {
        const { message: {data:{quoteMsg: quoteMsg}}  } = this.props;
        console.log(`####quoteMsg:####\n ${JSON.stringify(quoteMsg)}`);
        switch (quoteMsg.type) {
            case IMConstant.MessageType.text:
                break;
            case IMConstant.MessageType.image:
                let img = (quoteMsg as Message.Image).data;
                showPhotoBrowserPage({
                    currentIndex: 0,
                    images:[img.localPath?img.localPath:img.remotePath ],
                    canSave: true,
                    renderIndicator: () => null,
                });
                break;
            case IMConstant.MessageType.video:
                // if (this.isAndroid) {
                //     if (this.state.downloadReady) {
                //         IMStandard.Delegate.func.playVideo(this.displayPath.replace('file://', ''));
                //     }
                // } else {
                //     this.player.presentFullscreenPlayer();
                // }
                break;
            case IMConstant.MessageType.location:
                let loc =(quoteMsg as Message.Location).data
                Delegate.func.pushToLocationViewPage(loc);
                break;
            case IMConstant.MessageType.file:
                let file = (quoteMsg as Message.File).data;
                Navigation.push(FilePreviewPage, { url: file.remotePath,name: file.name, size:file.size, inComponent: false });
                break;
            case IMConstant.MessageType.material:
                let obj= quoteMsg.data.object;
                Model.event.trigger(Constant.event.JumpToDetail, {
                    metaid: obj.metaName,
                    itemData: obj,
                });
                break;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    quoteText: {
        height: 20,
        fontSize: 13,
        marginTop:3,
        paddingTop:2,
        alignContent:"center",
        paddingBottom:2,
        borderRadius: 3,
        backgroundColor: '#cccccc',
        ...Platform.select({
            android: { textAlignVertical: 'center' },
        }),
        overflow: 'hidden',
    } as TextStyle,
    view: {
        backgroundColor: 'transparent',
        paddingHorizontal: 13,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
});