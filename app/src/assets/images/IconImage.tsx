import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const IconImage = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill={props.fill}
      fillRule="evenodd"
      d="M1 6a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V6Zm3-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4Z"
      clipRule="evenodd"
    />
    <Path
      fill={props.fill}
      fillRule="evenodd"
      d="M17 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM7.293 10.293a1 1 0 0 1 1.043-.235l14 5A1 1 0 0 1 23 16v2a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3v-1a1 1 0 0 1 .293-.707l6-6Zm.967 1.862L3 17.415V18a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-1.295l-12.74-4.55Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default IconImage
