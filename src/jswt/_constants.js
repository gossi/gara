/**
 * The <tt>MessageBox</tt> style constant for an ABORT button; the only valid combination is ABORT|RETRY|IGNORE (value is 1<<9).
 */
gara.jswt.ABORT = 1 << 9; 

/**
 * @field
 * Style constant for application modal behavior (value is 1<<16).
 */
gara.jswt.APPLICATION_MODAL = 1 << 16;

/**
 * Style constant for align bottom behavior (value is 1<<10, since align DOWN and align BOTTOM are considered the same).
 */
gara.jswt.BOTTOM = 1 << 10;

/**
 * The <tt>MessageBox</tt> style constant for a CANCEL button; valid combinations are OK|CANCEL, YES|NO|CANCEL, RETRY|CANCEL (value is 1<<8).
 */
gara.jswt.CANCEL = 1 << 8;

/**
 * Style constant for close box trim (value is 1<<6, since we do not distinguish between CLOSE style and MENU style).
 */
gara.jswt.CLOSE = 1 << 6;

/**
 * Indicates that a default should be used (value is 0).
 * 
 * NOTE: In SWT, this value is -1, but that causes problems with bitwise JavaScript operators...
 */
gara.jswt.DEFAULT = 0;

/**
 * Style constant for align down behavior (value is 1<<10, since align DOWN and align BOTTOM are considered the same).
 */
gara.jswt.DOWN = 1 << 10;

/**
 * Indicates that a user-interface component is being dragged, for example dragging the thumb of a scroll bar (value is 1).
 */
gara.jswt.DRAG = 1;

/**
 * Style constant for full row selection behavior (value is 1<<16).
 */
gara.jswt.FULL_SELECTION = 1 << 16;
/**
 * The MessageBox style constant for an IGNORE button; the only valid combination is ABORT|RETRY|IGNORE (value is 1<<11).
 */
gara.jswt.IGNORE = 1 << 11;

/**
 * Style constant for shell menu trim (value is 1<<6, since we do not distinguish between CLOSE style and MENU style).
 */
gara.jswt.MENU = 1 << 6;

/**
 * Style constant for multi-selection behavior in lists and multiple line support on text fields (value is 1<<1).
 */
gara.jswt.MULTI = 1 << 1; 

/**
 * The <tt>MessageBox</tt> style constant for NO button; valid combinations are YES|NO, YES|NO|CANCEL (value is 1<<7).
 */
gara.jswt.NO = 1 << 7;

/**
 * The <tt>MessageBox</tt> style constant for an OK button; valid combinations are OK, OK|CANCEL (value is 1<<5). 
 */
gara.jswt.OK = 1 << 5;
 
/**
 * The MessageBox style constant for a RETRY button; valid combinations are ABORT|RETRY|IGNORE, RETRY|CANCEL (value is 1<<10).
 */
gara.jswt.RETRY = 1 << 10;

/**
 * Style constant for single selection behavior in lists and single line support on text fields (value is 1<<2).
 */
gara.jswt.SINGLE = 1 << 2;

/**
 * Style constant for system modal behavior (value is 1<<17).
 */
gara.jswt.SYSTEM_MODAL = 1 << 17;

/**
 * Style constant for align top behavior (value is 1<<7, since align UP and align TOP are considered the same).
 */
gara.jswt.TOP = 1 << 7;

/**
 * Style constant for align up behavior (value is 1<<7, since align UP and align TOP are considered the same).
 */
gara.jswt.UP = 1 << 7;

/**
 * The MessageBox style constant for YES button; valid combinations are YES|NO, YES|NO|CANCEL (value is 1<<6).
 */
gara.jswt.YES = 1 << 6;