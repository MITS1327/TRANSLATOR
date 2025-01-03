import { AddOutgoingEvent1709114757916 } from './1709114757916-AddOutgoingEvent';
import { AddProjectEntity1709120498834 } from './1709120498834-AddProjectEntity';
import { AddLangEntity1709128036857 } from './1709128036857-AddLangEntity';
import { AddKeyEntity1709140847716 } from './1709140847716-AddKeyEntity';
import { ChangeKeyEntity1709228990080 } from './1709228990080-ChangeKeyEntity';
import { AddIsTranslatableToLang1709291263798 } from './1709291263798-AddIsTranslatableToLang';
import { AddQueryProject1710511777182 } from './1710511777182-AddQueryProject';
import { FixCountUntranslatedKeys1710762593943 } from './1710762593943-FixCountUntranslatedKeys';

export const MIGRATIONS = [
  AddOutgoingEvent1709114757916,
  AddProjectEntity1709120498834,
  AddLangEntity1709128036857,
  AddKeyEntity1709140847716,
  ChangeKeyEntity1709228990080,
  AddIsTranslatableToLang1709291263798,
  AddQueryProject1710511777182,
  FixCountUntranslatedKeys1710762593943,
];
