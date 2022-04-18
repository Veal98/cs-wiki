
/* IMPORT */

import Color from '../color';

/* TO KEYWORD */

function toKeyword ( color: string ): string | undefined {

  return Color.format.keyword.stringify ( Color.parse ( color ) );

}

/* EXPORT */

export default toKeyword;
