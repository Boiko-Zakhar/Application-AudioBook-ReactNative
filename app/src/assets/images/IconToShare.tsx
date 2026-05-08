import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const IconToShare = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill={props.fill}
      fillRule="evenodd"
      d="M6 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-4 2a4 4 0 1 1 8 0 4 4 0 0 1-8 0ZM18 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-4 2a4 4 0 1 1 8 0 4 4 0 0 1-8 0ZM18 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-4 2a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
      clipRule="evenodd"
    />
    <Path
      fill={props.fill}
      fillRule="evenodd"
      d="m15.474 7.88-6.5 3.5-.948-1.76 6.5-3.5.948 1.76ZM14.526 17.88l-6.5-3.5.948-1.76 6.5 3.5-.948 1.76Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default IconToShare
