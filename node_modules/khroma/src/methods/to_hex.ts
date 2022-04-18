
/* IMPORT */

import Color from '../color';

/* TO HEX */

function toHex ( color: string ): string {

  return Color.format.hex.stringify ( Color.parse ( color ) );

}

/* EXPORT */

export default toHex;
