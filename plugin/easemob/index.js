import * as IMStandard from '../../src';
import * as EMUtil from './util';
import * as EMConstant from './constant';
import { isMobileText, convertMobileText } from './text/text-mobile';
import { isWebText, convertWebText } from './text/text-web';
import { isMobileImage, convertMobileImage } from './image/image-mobile';
import { isMobileLocation, convertMobileLocation } from './location/location-mobile';
import { isMobileVideo, convertMobileVideo } from './video/video-mobile';
import { isMobileVoice, convertMobileVoice } from './voice/voice-mobile';
import * as StandardMessage from '../message';

export function setup() {
    // Parse操作
    const parseActions = [
        [isMobileText, convertMobileText],
        [isWebText, convertWebText],
        [isMobileImage, convertMobileImage],
        [isMobileLocation, convertMobileLocation],
        [isMobileVideo, convertMobileVideo],
        [isMobileVoice, convertMobileVoice],
    ];
    parseActions.forEach(([specialFunc, handleFunc, priority]) => {
        IMStandard.Model.Action.register(
            IMStandard.Constant.Action.Parse,
            undefined,
            (message) => specialFunc(message),
            (message) => handleFunc(message),
            priority,
        );
    });
    // Display操作
    const displayActions = [
        [undefined, StandardMessage.Display.GeneralBubble],
        [EMConstant.MessageType.Text, StandardMessage.Display.TextBubble],
        [EMConstant.MessageType.Image, StandardMessage.Display.ImageBubble],
        [EMConstant.MessageType.Location, StandardMessage.Display.LocationBubble],
        [EMConstant.MessageType.Video, StandardMessage.Display.VideoBubble],
        [EMConstant.MessageType.Voice, StandardMessage.Display.VoiceBubble],
    ];
    displayActions.forEach(([messageType, handleFunc, priority]) => {
        IMStandard.Model.Action.register(
            IMStandard.Constant.Action.Display,
            messageType,
            undefined,
            handleFunc,
            priority,
        );
    });
    // Abstract操作
    const abstractActions = [
        [undefined, (params) => ''],
        [EMConstant.MessageType.Text, StandardMessage.Abstract.TextAbstract],
        [EMConstant.MessageType.Image, StandardMessage.Abstract.ImageAbstract],
        [EMConstant.MessageType.Location, StandardMessage.Abstract.LocationAbstract],
        [EMConstant.MessageType.Video, StandardMessage.Abstract.VideoAbstract],
        [EMConstant.MessageType.Voice, StandardMessage.Abstract.VoiceAbstract],
        [EMConstant.MessageType.File, StandardMessage.Abstract.FileAbstract],
    ];
    abstractActions.forEach(([messageType, abstractFunc, priority]) => {
        IMStandard.Model.Action.register(
            IMStandard.Constant.Action.Abstract,
            messageType,
            undefined,
            abstractFunc,
            priority,
        );
    });
    // MoreBoard操作
    const moreboardActions = [
        ['photo', StandardMessage.MoreBoard.takePhoto, EMConstant.MessageType.Image],
        ['camera', StandardMessage.MoreBoard.takeCamera, EMConstant.MessageType.Image],
        ['video', StandardMessage.MoreBoard.takeVideo, EMConstant.MessageType.Video],
        ['location', StandardMessage.MoreBoard.chooseLocation, EMConstant.MessageType.Location],
    ];
    moreboardActions.forEach(([action, handleFunc, messageType, priority]) => {
        IMStandard.Model.Action.register(
            IMStandard.Constant.Action.MoreBoard,
            action,
            undefined,
            {...handleFunc, messageType},
            priority,
        );
    });
    // 默认值设置
    const { BottomBar, MoreBoard } = IMStandard.Delegate.component;
    BottomBar.defaultProps.textMessageType = EMConstant.MessageType.Text;
    BottomBar.defaultProps.voiceMessageType = EMConstant.MessageType.Voice;
    MoreBoard.defaultProps.getItems = (imId, chatType) =>
        ['photo', 'camera', 'video', 'location'];
}

export {
    EMConstant,
    EMUtil,
};