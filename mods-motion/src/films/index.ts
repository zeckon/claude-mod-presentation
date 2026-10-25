import {FilmDef} from '../Film';
import {devcontainers} from './devcontainers';
import {explain} from './explain';
import {history} from './history';
import {pixelbar} from './pixelbar';

export const FILMS: Record<string, FilmDef> = {pixelbar, history, devcontainers, explain};
