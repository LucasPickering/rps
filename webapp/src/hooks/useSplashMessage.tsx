import React from 'react';
import { ConnectionStatus } from 'hooks/useWebSocket';
import { sample } from 'lodash';
import { useEffect, useState } from 'react';
import { MatchOutcome } from 'state/match';
import Link from 'components/common/Link';

// TODO clean this up

type Splashes<K extends string = string> = Record<K, React.ReactNode[]>;

export const welcomeSplashes: Splashes = {
  '': [
    'Welcome!',
    'Bienvenidos!',
    'Tere tulemast!',
    'Wilkommen!',
    'пожалуйста',
    '欢迎',
  ],
};

export const notFoundSplashes: Splashes = {
  '': [
    'It seems you are lost',
    'What are you doing in my swamp?!',
    'Not all those who wander are lost. But you are.',
  ],
};

export const connectionStatusSplashes: Splashes<ConnectionStatus> = {
  connecting: [`Oooooh, he's trying!`],
  connected: [
    'You are Online™',
    'Welcome to the THUNDERDOME',
    'Now with 20% less trans fat!',
  ],
  closedError: [':sad_parrot:', "It's a feature"],
  closedNormal: ['Head aega!', 'Nägemist!', 'Nägemiseni!'],
};

export const matchOutcomeSplashes: Splashes<MatchOutcome> = {
  win: [
    'gg ez',
    'gg no re',
    'ez game ez life',
    'ez clap',
    'Unstoppable',
    // eslint-disable-next-line react/jsx-key
    <Link to="http://niceme.me">niceme.me</Link>,
  ],
  loss: [
    'Damn, you just got dumpstered',
    'Absolutely eviscerated',
    'Embarrassing',
    'You are a disgrace to your family',
    "You friggin' moron, you just got porched",
    'sit',
    "That's the way she goes",
    '¯\\_(ツ)_/¯',
  ],
};

/**
 * EXTREMELY important hook. Integral to the operation of the entire program.
 */
const useSplashMessage = (
  splashes: Splashes,
  key: string = ''
): React.ReactNode => {
  const [splash, setSplash] = useState<React.ReactNode>('');
  useEffect(() => setSplash(sample(splashes[key]) || ''), [splashes, key]);
  return splash;
};

export default useSplashMessage;
