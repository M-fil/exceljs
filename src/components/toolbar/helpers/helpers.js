import { toolbarButtonKeys } from '../../../constants/toolbar';

const { ALIGN, TEXT } = toolbarButtonKeys;

export const getTextAlignByKey = (key) => {
  switch (key) {
    case ALIGN.CENTER:
      return 'center';
    case ALIGN.LEFT:
      return 'left';
    case ALIGN.RIGHT:
      return 'right';
    default:
      return '';
  }
};

export const getKeyByTextAlign = (textAlign) => {
  switch (textAlign) {
    case 'center':
      return ALIGN.CENTER;
    case 'left':
      return ALIGN.LEFT;
    case 'right':
      return ALIGN.RIGHT;
    default:
      return '';
  }
};

export const getPropNameByKey = (key) => {
  switch (key) {
    case ALIGN.LEFT:
    case ALIGN.RIGHT:
    case ALIGN.CENTER:
      return 'align';
    case TEXT.BOLD:
      return 'isBold';
    case TEXT.ITALIC:
      return 'isItalic';
    case TEXT.UNDERLINED:
      return 'isUnderlined';
    default:
      return '';
  }
};
