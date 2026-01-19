import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const IconHome = (props : SvgProps) => (
  <Svg
    width={props.width}
    height={props.height}
    fill="none"
    {...props}
  >
    <Path
      stroke={props.stroke}
      fillRule="evenodd"
      d="M0 10.5a3 3 0 0 1 3-3h.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3v-4.5Zm3-1a1 1 0 0 0-1 1V15a1 1 0 0 0 1 1h.5a1 1 0 0 0 1-1v-4.5a1 1 0 0 0-1-1H3ZM11.5 10.5a3 3 0 0 1 3-3h.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-.5a3 3 0 0 1-3-3v-4.5Zm3-1a1 1 0 0 0-1 1V15a1 1 0 0 0 1 1h.5a1 1 0 0 0 1-1v-4.5a1 1 0 0 0-1-1h-.5Z"
      clipRule="evenodd"
    />
    <Path
      stroke={props.stroke}
      fillRule="evenodd"
      d="M8 2a6 6 0 0 0-6 6v4.5H0V8a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8v4.5h-2V8a6 6 0 0 0-6-6H8Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default IconHome