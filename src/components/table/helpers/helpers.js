import { Dom } from '@core/dom';

export const shouldResize = (resizer) => resizer && resizer.dataAttr.resize;

export const isDomInstance = (element) => element instanceof Dom;
