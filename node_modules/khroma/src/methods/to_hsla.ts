
/* IMPORT */

import Color from '../color';

/* TO HSLA */

function toHsla ( color: string ): string {

  return Color.format.hsla.stringify ( Color.parse ( color ) );

}

/* EXPORT */

export default toHsla;
