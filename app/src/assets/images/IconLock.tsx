import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const IconLock = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill={props.fill}
      fillRule="evenodd"
      d="M12 12.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1Zm-2.5.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0Z"
      clipRule="evenodd"
    />
    <Path
      fill={props.fill}
      fillRule="evenodd"
      d="M11 18v-3.5h2V18h-2ZM9 3a1 1 0 0 0-1 1v3.578H6V4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v.878h-2V4a1 1 0 0 0-1-1H9Z"
      clipRule="evenodd"
    />
    <Path
      fill={props.fill}
      fillRule="evenodd"
      d="M12 7a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm-9 7a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default IconLock
