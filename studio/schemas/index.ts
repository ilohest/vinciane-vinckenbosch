import { localeString, localeText, localeBlock } from './locale';
import { homepage } from './homepage';
import { event } from './event';
import { mediaItem } from './mediaItem';
import { pressItem } from './pressItem';
import { siteSettings } from './siteSettings';
import { socialPreview } from './socialPreview';
import { legalNotice } from './legalNotice';
import { privacyPolicy } from './privacyPolicy';

export const schemaTypes = [
  // Types localisés partagés (FR / EN / DE)
  localeString,
  localeText,
  localeBlock,
  // Documents
  homepage,
  event,
  mediaItem,
  pressItem,
  siteSettings,
  socialPreview,
  legalNotice,
  privacyPolicy,
];
