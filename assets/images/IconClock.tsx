import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const IconClock = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill={props.fill}
      fillRule="evenodd"
      d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12Z"
      clipRule="evenodd"
    />
    <Path
      fill={props.fill}
      fillRule="evenodd"
      d="M11.293 12.707A1 1 0 0 1 11 12V5h2v6h6v2h-7a1 1 0 0 1-.707-.293Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default IconClock