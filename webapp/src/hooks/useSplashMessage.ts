import { ConnectionStatus } from 'hooks/useWebSocket';
import { sample } from 'lodash';
import { useEffect, useState } from 'react';
import { MatchOutcome } from 'state/match';

// TODO clean this up

type Key = string | number | symbol;
type Splashes<T extends Key = string> = Record<T, string[]>;
type Splasher<T = string> = (key: T) => string;

const welcomeSplashes: Splashes = {
  '': [
    'Welcome!',
    'Bienvenidos!',
    'Tere tulemast!',
    'Wilkommen!',
    'пожалуйста',
    '欢迎',
    'RPS is certified Dank®',
  ],
};

const notFoundSplashes: Splashes = {
  '': ['It seems you are lost', 'What are you doing in my swamp?!'],
};

const connectionStatusSplashes: Splashes<ConnectionStatus> = {
  connecting: [`Oooooh, he's trying!`],
  connected: [
    'You are Online™',
    'Welcome to the THUNDERDOME',
    'Now with 20% less trans fat!',
  ],
  closedError: [':sad_parrot:', "It's a feature"],
  closedNormal: ['Head aega!', 'Nägemist!', 'Nägemiseni!'],
};

const matchOutcomeSplashes: Splashes<MatchOutcome> = {
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

const makeSplasher = <T extends Key>(splashes: Splashes<T>): Splasher<T> => {
  return key => {
    return sample(splashes[key]) || '';
  };
};

export const welcomeSplasher: Splasher = makeSplasher(welcomeSplashes);

export const notFoundSplasher: Splasher = makeSplasher(notFoundSplashes);

export const connectionStatusSplasher: Splasher<
  ConnectionStatus
> = makeSplasher(connectionStatusSplashes);

export const matchOutcomeSplasher: Splasher<MatchOutcome> = makeSplasher(
  matchOutcomeSplashes
);

/**
 * EXTREMELY important hook. Integral to the operation of the entire program.
 */
const useSplashMessage = <T extends Key>(
  splasher: Splasher<T>,
  key?: T
): string => {
  const [splash, setSplash] = useState('');
  useEffect(() => setSplash(key !== undefined ? splasher(key) : ''), [
    splasher,
    key,
  ]);
  return splash;
};

export default useSplashMessage;
