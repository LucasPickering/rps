import { ConnectionStatus } from 'hooks/useWebSocket';
import { sample } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { MatchOutcome } from 'state/match';
import { UserStateContext } from 'state/user';

type Key = string | number | symbol;
type Splashes<T extends Key> = Record<T, string[]>;
type Splasher<T> = (key: T, isAlt: boolean) => string;

const connectionStatusSplashes: Splashes<ConnectionStatus> = {
  [ConnectionStatus.Connecting]: [`Oooooh, he's trying!`],
  [ConnectionStatus.Connected]: [
    'You are Online™',
    'Welcome to the THUNDERDOME',
  ],
  [ConnectionStatus.ClosedError]: [':sad_parrot:'],
  [ConnectionStatus.ClosedNormal]: ['Head aega!', 'Nägemist!', 'Nägemiseni!'],
};

const matchOutcomeSplashes: Splashes<MatchOutcome> = {
  [MatchOutcome.Win]: ['gg ez', 'gg no re', 'ez game ez life'],
  [MatchOutcome.Loss]: [
    'Damn, you just got dumpstered',
    'Embarrassing',
    'You are a disgrace to your family',
  ],
};

const makeSplasher = <T extends Key>(
  splashes: Splashes<T>,
  altSplashes?: Splashes<T>
): Splasher<T> => {
  return (key, isAlt) => {
    const toSample = isAlt && altSplashes ? altSplashes : splashes;
    return sample(toSample[key]) || '';
  };
};

export const connectionStatusSplasher: Splasher<
  ConnectionStatus
> = makeSplasher(connectionStatusSplashes);

export const matchOutcomeSplasher: Splasher<MatchOutcome> = makeSplasher(
  matchOutcomeSplashes
);

/**
 * EXTREMELY important hook. Integral to the operation of the entire program.
 */
export default <T>(splasher: Splasher<T>, key?: T): string => {
  const { user } = useContext(UserStateContext);
  const isAlt = Boolean(user && user.username.toLowerCase() === 'nick'); // lol

  const [splash, setSplash] = useState('');
  useEffect(() => setSplash(key ? splasher(key, isAlt) : ''), [splasher, key]);
  return splash;
};
