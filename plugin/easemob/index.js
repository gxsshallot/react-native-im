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
    const displayActions = [
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
}

export {
    EMConstant,
    EMUtil,
};