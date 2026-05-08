import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const IconPause = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill={props.fill}
      fillRule="evenodd"
      stroke="#000"
      strokeLinejoin="round"
      strokeOpacity={0.3}
      d="M3.332.763A1.875 1.875 0 0 0 .5 2.375V38a1.875 1.875 0 0 0 2.832 1.612l30-17.812a1.875 1.875 0 0 0 0-3.225L3.332.763Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default IconPause
