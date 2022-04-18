
/* IMPORT */

import Color from '../color';

/* TO RGBA */

function toRgba ( color: string ): string {

  return Color.format.rgba.stringify ( Color.parse ( color ) );

}

/* EXPORT */

export default toRgba;
