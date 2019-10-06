import React from 'react';
import { ConnectionStatus } from 'hooks/useWebSocket';
import { sample } from 'lodash';
import { useEffect, useState } from 'react';
import { MatchOutcome } from 'state/match';
import Link from 'components/common/Link';

// TODO clean this up

type Splashes<K extends string = string> = Record<K, React.ReactNode[]>;

/* eslint-disable react/jsx-key */

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
    <span>
      Great moments are born from great opportunity. And that&apos;s what you
      have here tonight, boys. That&apos;s what you&apos;ve earned here tonight.
      One game. If we play &apos;em ten times, they might win nine. But not this
      game. Not tonight. Tonight, we skate with them. Tonight, we stay with
      them. And we shut them down, because we can. Tonight, we are the greatest
      hockey team in the world. You were born to be hockey players. Every one of
      you. And you were meant to be here tonight. This is your time. Their time
      is done. It&apos;s over. Now I&apos;m sick and tired of hearing about what
      a great hockey team the soviets have. Screw &apos;em. This is your time.
      Now go out there and take it.
    </span>,
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
    'Unlucky',
    'You hate to see it',
  ],
};

/* eslint-enable react/jsx-key */

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
