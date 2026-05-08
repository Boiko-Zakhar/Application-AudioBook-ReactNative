import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const IconBookmark = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill={props.fill}
      fillRule="evenodd"
      d="M3 4a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v18a1 1 0 0 1-1.4.916L12 19.591l-7.6 3.325A1 1 0 0 1 3 22V4Zm3-1a1 1 0 0 0-1 1v16.471l6.6-2.887a1 1 0 0 1 .8 0L19 20.47V4a1 1 0 0 0-1-1H6Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default IconBookmark
