import { ConnectionStatus } from 'hooks/useWebSocket';
import { sample } from 'lodash';
import { useEffect, useState } from 'react';
import { MatchOutcome } from 'state/match';

// TODO clean this up

type Splashes = Record<string, string[]>;
type Splasher = (key: string) => string;

const welcomeSplashes: Splashes = {
  '': [
    'Welcome!',
    'Bienvenidos!',
    'Tere tulemast!',
    'Wilkommen!',
    'пожалуйста',
    '欢迎',
  ],
};

const notFoundSplashes: Splashes = {
  '': ['It seems you are lost', 'What are you doing in my swamp?!'],
};

const connectionStatusSplashes: Record<ConnectionStatus, string[]> = {
  connecting: [`Oooooh, he's trying!`],
  connected: [
    'You are Online™',
    'Welcome to the THUNDERDOME',
    'Now with 20% less trans fat!',
  ],
  closedError: [':sad_parrot:', "It's a feature"],
  closedNormal: ['Head aega!', 'Nägemist!', 'Nägemiseni!'],
};

const matchOutcomeSplashes: Record<MatchOutcome, string[]> = {
  win: ['gg ez', 'gg no re', 'ez game ez life'],
  loss: [
    'Damn, you just got dumpstered',
    'Absolutely eviscerated',
    'Embarrassing',
    'You are a disgrace to your family',
    "You friggin'  moron, you just got porched",
    'sit',
    "That's the way she goes",
  ],
};

const makeSplasher = (splashes: Splashes): Splasher => {
  return key => {
    return sample(splashes[key]) || '';
  };
};

export const welcomeSplasher: Splasher = makeSplasher(welcomeSplashes);

export const notFoundSplasher: Splasher = makeSplasher(notFoundSplashes);

export const connectionStatusSplasher: Splasher = makeSplasher(
  connectionStatusSplashes
);

export const matchOutcomeSplasher: Splasher = makeSplasher(
  matchOutcomeSplashes
);

/**
 * EXTREMELY important hook. Integral to the operation of the entire program.
 */
const useSplashMessage = (splasher: Splasher, key: string = ''): string => {
  const [splash, setSplash] = useState('');
  useEffect(() => setSplash(splasher(key)), [splasher, key]);
  return splash;
};

export default useSplashMessage;
