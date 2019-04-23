import { General, GeneralBody, Body, Origin } from '../Message';

export type State = Origin;

export type Params = Origin;

export type Result<T extends Body = GeneralBody> = General<T>;